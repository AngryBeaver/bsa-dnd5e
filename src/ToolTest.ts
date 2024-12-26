import {Settings} from './Settings.js';
import {fixReadySetRoll} from "./Dnd5e.js";
class ToolTest implements TestClass<"tool"|"dc"> {
    public type:string =  "ToolTest"
    _choices:{[key:string]:{text:string, img?:string}} = {};
    constructor(choices:{[key:string]:{text:string, img?:string}}){
        this._choices = choices;
    }
    public create(data:Record<"tool"|"dc",any>){
        const result = new ToolTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }
    public informationField:InfoField = {
        name: "type",
        type: "info",
        label: game['i18n'].localize("bsa-dnd5e.tests.toolTest.info.label"),
        note: game['i18n'].localize("bsa-dnd5e.tests.toolTest.info.note")
    }

    get customizationFields(): Record<"tool"|"dc",InputField>{
        return {
            tool: {
                name: "tool",
                label: "tool",
                note: "Tool",
                type: "selection",
                choices: this._choices
            },
            dc: {
                name: "dc",
                label: "dc",
                note: "Difficulty Class ",
                defaultValue: 8,
                type: "number",
            }
        };
    }

    readonly renderTypes: Record<"dc"|"tool",TestRenderType> = {
        tool:"setup",
        dc: "config"
    }

}

class ToolTestCustomized implements Test<"tool"|"dc"> {

    parent: ToolTest
    data:{tool:"", dc:8}

    public action = async (initiatorData: InitiatorData):Promise<TestResult> => {
        const actor = beaversSystemInterface.initiator(initiatorData).actor;
        const originalItem = await beaversSystemInterface.uuidToDocument(this.data.tool);
        let actorComponent:Component|undefined;
        if(originalItem) {
            const toolComponent = beaversSystemInterface.componentFromEntity(originalItem);
            const results = beaversSystemInterface.itemListComponentFind(actor.items, toolComponent);
            actorComponent = results.components[0]
        }
        if(actorComponent == undefined){
            // @ts-ignore
            ui.notifications.warn("actor does not have this tool");
            throw Error("actor does not have this tool");
        }
        // @ts-ignore
        const item = await actorComponent.getEntity()
        let roll = await item.rollToolCheck();
        roll = fixReadySetRoll(roll);
        return {
            success:roll.total>=this.data.dc?1:0,
            fail: roll.total<this.data.dc?1:0
        }
    }

    public render = (): string => {
        const tool = this.parent._choices[this.data.tool];
        if(!tool){
            return `tool not found`;
        }
        return `<span style="overflow:hidden;text-overflow:ellipsis; background-image: url('${tool.img}');background-repeat:no-repeat;padding-left:22px;background-size:20px" >${tool.text}:dc ${this.data.dc}</span>`;
    };

}

async function getChoices(){
    const uuids:string[] = Settings.get(Settings.TOOL_CONFIG);
    const choices:{[key:string]:{text:string, img?:string}} = {};
    for(const uuid of uuids){
        try {
            const item = await beaversSystemInterface.uuidToDocument(uuid);
            choices[uuid] = {img: item.img, text: item.name}
        }catch(e){
            console.warn(`Tool not found ${uuid}`,e);
        }
    }
    return choices;
}
getChoices().then((choices)=> {
    beaversSystemInterface.registerTestClass(new ToolTest(choices));
});
