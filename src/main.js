import {Dnd5e} from "./Dnd5e.js";
import {Settings} from './Settings.js';

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Dnd5e());
});

Hooks.on("beavers-system-interface.ready", async function(){
    Settings.init();
    import("./SkillTest.js");
    import("./AbilityTest.js");
    import("./ToolTest.js");
});