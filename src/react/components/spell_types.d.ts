export declare const spell_classes: {
    artificer: string;
    bard: string;
    cleric: string;
    druid: string;
    paladin: string;
    ranger: string;
    sorcerer: string;
    warlock: string;
    wizard: string;
};
export declare const schools: {
    abjuration: string;
    conjuration: string;
    divination: string;
    enchantment: string;
    evocation: string;
    illusion: string;
    necromancy: string;
    transmutation: string;
};
export declare const time_units: {
    action: string;
    bonus_action: string;
    hour: string;
    minute: string;
};
export declare const range_units: {
    self: string;
    touch: string;
    meter: string;
    feet: string;
};
export declare const attributes: {
    spell: string;
    strength: string;
    dexterity: string;
    constitution: string;
    intelligence: string;
    wisdom: string;
    charisma: string;
};
export declare const duration_units: {
    instantaneous: string;
    minute: string;
    hour: string;
    end_of_turn: string;
    end_of_target_turn: string;
};
export declare type SpellClass = keyof (typeof spell_classes);
export declare type School = keyof (typeof schools);
export declare type TimeUnit = keyof (typeof time_units);
export declare type RangeUnit = keyof (typeof range_units);
export declare type DurationUnit = keyof (typeof duration_units);
export declare type Attribute = keyof (typeof attributes);
