export class Dnd5e implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "dnd5e";
    }

    async actorRollSkill(actor, skillId):Promise<Roll|null> {
        let roll;
        if(isGreaterOrEqualThenGameVersion("5.0.4")){
            roll = await actor.rollSkill({skill:skillId});
        }else{
            roll = await actor.rollSkill(skillId);
        }
        if(Array.isArray(roll)){
            roll = roll[0];
        }
        return fixReadySetRoll(roll);
    }

    async actorRollAbility(actor, abilityId): Promise<Roll|null> {
        let roll;
        if(isGreaterOrEqualThenGameVersion("5.0.4")){
            roll = await actor.rollAbilityCheck({ability:abilityId});
        }else{
            roll = await actor.rollAbilityTest(abilityId);
        }
        if(Array.isArray(roll)){
            roll = roll[0];
        }
        return fixReadySetRoll(roll);
    }

    async actorRollTool(actor, item): Promise<Roll|null> {
        let roll = await item.rollToolCheck();
        if(Array.isArray(roll)){
            roll = roll[0];
        }
        return fixReadySetRoll(roll);
    }

    actorCurrenciesGet(actor):Currencies {
        return actor["system"].currency;
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {currency: currencies}});
    }

    _actorSheetAddTab3(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string){
        $(html).find(".beavers-crafting-actor-tab").remove();
        const tabs = $(html).find('.tabs[data-group="primary"]');
        const tabItem = $('<a class="item beavers-crafting-actor-tab" data-group="primary" data-tab="' + tabData.id + '">' + tabData.html + '</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body .tab-body");
        const tabContent = $('<div class="tab beavers-crafting-actor-tab" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }
    _actorSheetAddTabLegacy(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string){
        const tabs = $(html).find('.tabs[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '">' + tabData.label + '</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body");
        const tabContent = $('<div class="tab" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string): void {
        if(game["dnd5e"].version.split(".")[0]>=3){
            this._actorSheetAddTab3(sheet, html, actor, tabData, tabBody);
        }else{
            this._actorSheetAddTabLegacy(sheet, html, actor, tabData, tabBody);
        }
    }

    itemSheetReplaceContent(app, html,element){
        if(game["dnd5e"].version.split(".")[0]>=5){
            this.itemSheetReplaceContentV5(app, html, element);
        }else{
            this.itemSheetReplaceContentLegacy(app, html, element);
        }
    }

    itemSheetReplaceContentLegacy(app, html, element): void {
        html.find('.sheet-navigation').remove();
        var properties = html.find('.item-properties').clone();
        const sheetBody = html.find('.sheet-body');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(properties);
        sheetBody.append(element);
    }

    itemSheetReplaceContentV5(app, html, element): void {
        var header = html.find('.sheet-header').clone();
        const sheetBody = html.find('.window-content');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(header);
        sheetBody.append(element);
    }

    get configSkills(): SkillConfig[] {
        return Object.entries(game["dnd5e"].config.skills)
            .map(skills => {
                // @ts-ignore
                return {id: skills[0], label: skills[1].label as string};
            })
    }

    get configAbilities(): AbilityConfig[] {
        return Object.entries(game["dnd5e"].config.abilities).map(([id,value]) => {
            // @ts-ignore
            return {id: id, label: value.label};
        });
    }

    get configCurrencies(): CurrencyConfig[] {
        let highestConversion = 0;
        const currencies = CONFIG["DND5E"].currencies as {[key:string]:Dnd5eCurrency}
        return Object.entries(currencies)
            .sort(
            ([id,a],[id2,b])=>{
                highestConversion = Math.max(a.conversion,highestConversion)
                if(b.conversion >a.conversion){ return 1}else{return -1}})
            .map(([id,c])=>{
                return {id:id,label:c.label,factor:highestConversion/c.conversion}})
    }

    get configCanRollAbility():boolean {
        return true;
    }
    get configLootItemType(): string {
        return "loot";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}

export function fixReadySetRoll(roll){
    if(roll === null){
        return null
    }
    if(roll.total === undefined){
        if(roll.fields !== undefined && roll.fields[2] !== undefined ){
            roll =  roll.fields[2][1]?.roll
        }
    }
    return roll;
}

function isGreaterOrEqualThenGameVersion(version:string){
    const gameVersion = game["system"].version.split(".");
    const compareVersion = version.split(".");
    if(gameVersion[2] > compareVersion[2]){
        return true;
    }
    if(gameVersion[2] < compareVersion[2]){
        return false;
    }
    if(gameVersion[1] > compareVersion[1]){
        return true;
    }
    if(gameVersion[1] < compareVersion[1]){
        return false;
    }
    if(gameVersion[0] >= compareVersion[0]){
        return true;
    }
    return false
}