import {Dnd5e} from "./Dnd5e.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Dnd5e());
});