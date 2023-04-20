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
        return Object.entries(game["dnd5e"].config.abilities).map(ab => {
            return {id: ab[0], label: ab[1] as string};
        });
    }

    get configCurrencies(): CurrencyConfig[] {
        return [
            {
                id: "pp",
                factor: 1000,
                label: game["dnd5e"].config.currencies.pp.label
            },
            {
                id: "gp",
                factor: 100,
                label: game["dnd5e"].config.currencies.gp.label
            },
            {
                id: "ep",
                factor: 50,
                label: game["dnd5e"].config.currencies.ep.label
            },
            {
                id: "sp",
                factor: 10,
                label: game["dnd5e"].config.currencies.sp.label
            },
            {
                id: "cp",
                factor: 1,
                label: game["dnd5e"].config.currencies.cp.label
            }
        ]
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