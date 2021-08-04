export const spell_classes = {
    artificer: 'Erfinder',
    bard: 'Barde',
    cleric: 'Kleriker',
    druid: 'Druide',
    paladin: 'Paladin',
    ranger: 'Waldläufer',
    sorcerer: 'Zauberer',
    warlock: 'Hexenmeister',
    wizard: 'Magier',
};
export const schools = {
    abjuration: 'Bannmagie',
    conjuration: 'Beschwörung',
    divination: 'Erkenntnismagie',
    enchantment: 'Verzauberungsmagie',
    evocation: 'Hervorrufung',
    illusion: 'Illusuionsmagie',
    necromancy: 'Nekromantie',
    transmutation: 'Verwandlung',
};
export const time_units = {
    action: 'Aktion',
    bonus_action: 'Bonus Aktion',
    hour: 'Stunde/-n',
    minute: 'Minute/-n',
};
export const range_units = {
    self: 'Selbst',
    touch: 'Berührung',
    meter: 'Meter',
    feet: 'Fuß',
};
export const attributes = {
    spell: 'Zauber',
    strength: 'Stärke',
    dexterity: 'Geschicklichkeit',
    constitution: 'Konstitution',
    intelligence: 'Intelligenz',
    wisdom: 'Weisheit',
    charisma: 'Charisma',
};
export const duration_units = {
    instantaneous: 'Unmittelbar',
    minute: 'Minute/-n',
    hour: 'Stunde/-n',
    end_of_turn: 'Ende von deinem Zug',
    end_of_target_turn: 'Ende vom Zug des Ziels',
};

export type SpellClass = keyof (typeof spell_classes);
export type School = keyof (typeof schools);
export type TimeUnit = keyof (typeof time_units);
export type RangeUnit = keyof (typeof range_units);
export type DurationUnit = keyof (typeof duration_units);
export type Attribute = keyof (typeof attributes);
