export class Dnd5e implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "dnd5e";
    }

    async actorRollSkill(actor, skillId):Promise<Roll|null> {
        let roll = await actor.rollSkill(skillId);
        return this.fixReadySetRoll(roll);
    }

    async actorRollAbility(actor, abilityId): Promise<Roll|null> {
        let roll =  await actor.rollAbilityTest(abilityId);
        return this.fixReadySetRoll(roll);
    }

    async actorRollTool(actor, item): Promise<Roll|null> {
        let roll = await item.rollToolCheck();
        return this.fixReadySetRoll(roll);
    }

    fixReadySetRoll(roll){
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

    actorCurrenciesGet(actor):Currencies {
        return actor["system"].currency;
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {currency: currencies}});
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string): void {
        const tabs = $(html).find('.tabs[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '">' + tabData.label + '</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body");
        const tabContent = $('<div class="tab" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
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