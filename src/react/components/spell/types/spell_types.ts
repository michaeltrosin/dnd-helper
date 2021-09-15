export type SpellClass = keyof (typeof SpellConstants.classes);
export type School = keyof (typeof SpellConstants.schools);
export type TimeUnit = keyof (typeof SpellConstants.time_units);
export type RangeUnit = keyof (typeof SpellConstants.range_units);
export type DurationUnit = keyof (typeof SpellConstants.duration_units);
export type Attribute = keyof (typeof SpellConstants.attributes);

export const SpellConstants = {
    classes: {
        artificer: 'Erfinder',
        bard: 'Barde',
        cleric: 'Kleriker',
        druid: 'Druide',
        paladin: 'Paladin',
        ranger: 'Waldläufer',
        sorcerer: 'Zauberer',
        warlock: 'Hexenmeister',
        wizard: 'Magier',
    },
    schools: {
        abjuration: 'Bannmagie',
        conjuration: 'Beschwörung',
        divination: 'Erkenntnismagie',
        enchantment: 'Verzauberungsmagie',
        evocation: 'Hervorrufung',
        illusion: 'Illusuionsmagie',
        necromancy: 'Nekromantie',
        transmutation: 'Verwandlung',
    },
    time_units: {
        action: 'Aktion',
        bonus_action: 'Bonus Aktion',
        hour: 'Stunde/-n',
        minute: 'Minute/-n',
        up_to_minute: 'Bis zu ... Minute/-n',
        up_to_hour: 'Bis zu ... Stunde/-n',
        end_of_round: 'Ende der Runde',
        round: 'Runde/-n',
        reaction: 'Reaktion',
    },
    range_units: {
        self: 'Selbst',
        sight: 'Sicht',
        line: 'Linie',

        self_cone_meter: 'Selbst (...m großer Kegel)',
        self_radius_meter: 'Selbst (...m großer Radius)',
        self_cube_meter: 'Selbst (...m großer Würfel)',

        self_cone_feet: 'Selbst (...ft. großer Kegel)',
        self_radius_feet: 'Selbst (...ft. großer Radius)',
        self_cube_feet: 'Selbst (...ft. großer Würfel)',

        touch: 'Berührung',
        meter: 'Meter',
        feet: 'Fuß',
    },
    attributes: {
        spell: 'Zauber',
        strength: 'Stärke',
        dexterity: 'Geschicklichkeit',
        constitution: 'Konstitution',
        intelligence: 'Intelligenz',
        wisdom: 'Weisheit',
        charisma: 'Charisma',
    },
    duration_units: {
        instantaneous: 'Unmittelbar',
        minute: 'Minute/-n',
        hour: 'Stunde/-n',
        up_to_minute: 'Bis zu ... Minute/-n',
        up_to_hour: 'Bis zu ... Stunde/-n',
        end_of_turn: 'Ende von deinem Zug',
        end_of_target_turn: 'Ende vom Zug des Ziels',
        round: 'Runde-/n',
    }
};
