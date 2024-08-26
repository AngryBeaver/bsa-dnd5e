import {ToolConfig} from "./apps/ToolConfig.js";

export class Settings {

    static NAMESPACE:string = "bsa-dnd5e";
    static TOOL_CONFIG_BUTTON:string = "toolConfigButton";
    static TOOL_CONFIG:string = "toolConfig";
    static VERSION: string = "version";

    static init() {
        game["settings"].register(this.NAMESPACE, this.TOOL_CONFIG, {
            name: "ToolConfig",
            scope: "world",
            config: false,
            default: Settings.toolConfig,
            type: Object
        });
        game["settings"].registerMenu(this.NAMESPACE, this.TOOL_CONFIG_BUTTON, {
            name: game["i18n"].localize('bsa-dnd5e.settings.toolButton.name'),
            label: game["i18n"].localize("bsa-dnd5e.settings.toolButton.label"),
            hint: game["i18n"].localize('bsa-dnd5e.settings.toolButton.hint'),
            scope: "world",
            type: ToolConfig,
            restricted: true
        });
        game["settings"].register(this.NAMESPACE, this.VERSION, {
            scope: "world",
            config: false,
            default: 0,
            type: Number,
        });
        const version = Settings.get(Settings.VERSION);
        if(!version  || version < 210){
            const toolConfig = game["settings"].get("beavers-crafting", "toolConfig;");
            if(toolConfig && toolConfig.length > 0){
                Settings.set(Settings.TOOL_CONFIG,toolConfig);
            }
            Settings.set(Settings.VERSION,210);
        }
    }

    static get(key:string) {
        return game["settings"].get(this.NAMESPACE, key);
    };

    static set(key:string, value:any) {
        game["settings"].set(this.NAMESPACE, key, value);
    }

    static toolConfig= [
        "Compendium.dnd5e.items.8NS6MSOdXtUqD7Ib",
        "Compendium.dnd5e.items.rTbVrNcwApnuTz5E",
        "Compendium.dnd5e.items.fC0lFK8P4RuhpfaU",
        "Compendium.dnd5e.items.YfBwELTgPFHmQdHh",
        "Compendium.dnd5e.items.hM84pZnpCqKfi8XH",
        "Compendium.dnd5e.items.PUMfwyVUbtyxgYbD",
        "Compendium.dnd5e.items.skUih6tBvcBbORzA",
        "Compendium.dnd5e.items.YHCmjsiXxZ9UdUhU",
        "Compendium.dnd5e.items.hJS8yEVkqgJjwfWa",
        "Compendium.dnd5e.items.woWZ1sO5IUVGzo58",
        "Compendium.dnd5e.items.KndVe2insuctjIaj",
        "Compendium.dnd5e.items.0d08g1i5WXnNrCNA",
        "Compendium.dnd5e.items.ap9prThUB2y9lDyj",
        "Compendium.dnd5e.items.xKErqkLo4ASYr5EP",
        "Compendium.dnd5e.items.SztwZhbhZeCqyAes",
        "Compendium.dnd5e.items.Y9S75go1hLMXUD48",
        "Compendium.dnd5e.items.jhjo20QoiD5exf09",
        "Compendium.dnd5e.items.ccm5xlWhx74d6lsK",
        "Compendium.dnd5e.items.ugzwHl8vYaPu2GNd",
        "Compendium.dnd5e.items.i89okN7GFTWHsvPy",
        "Compendium.dnd5e.items.IBhDAr7WkhWPYLVn",
        "Compendium.dnd5e.items.cG3m4YlHfbQlLEOx",
        "Compendium.dnd5e.items.il2GNi8C0DvGLL9P",
        "Compendium.dnd5e.items.V13fjV5oSmvbRdgP",
        "Compendium.dnd5e.items.6rocoBx5jdzG1QQH",
    ]

}
