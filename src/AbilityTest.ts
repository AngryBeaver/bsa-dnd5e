
class AbilityTest implements TestClass<"ability"|"dc"> {
    public type= "AbilityTest";
    _choices:{[id:string]:{text:string,img?:string}} = {}

    constructor(){
        this._choices = beaversSystemInterface.configAbilities.reduce((object, ability) => {
            object[ability.id] = { text: ability.label };
            return object;
        }, {})
    }

    create(data:Record<"ability"|"dc",any>){
        const result = new AbilityTestCustomized();
        result.data = data;
        result.parent = this;
        return result;
    }

    public informationField:InfoField = {
        name: "type",
        type: "info",
        label: game['i18n'].localize("beaversSystemInterface.tests.abilityTest.info.label"),
        note: game['i18n'].localize("beaversSystemInterface.tests.abilityTest.info.note")
    }
    public get customizationFields(): Record<"ability"|"dc",InputField>{
        return {
            ability: {
                name: "ability",
                label: "ability",
                note: "Ability",
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
        }
    }

}

class AbilityTestCustomized implements Test<"ability"|"dc"> {

    parent: AbilityTest;

    data:{dc:8,ability:""}

    public action = async (initiatorData: InitiatorData):Promise<TestResult> => {
        const actor = beaversSystemInterface.initiator(initiatorData).actor;
        const roll = await beaversSystemInterface.actorRollAbility(actor,this.data.ability);
        return {
            success:(roll>=(this.data.dc||0))?1:0,
            fail: (roll<(this.data.dc||0))?1:0
        }
    }

    public render = (): string => {
        const ability = this.parent._choices[this.data.ability]?.text||"process";
        return `${ability}:dc ${this.data.dc}`;
    };

}
beaversSystemInterface.registerTestClass(new AbilityTest());