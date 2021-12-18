import '@/utils/extensions';

export interface ISpell {
    _id?: string;

    // Level vom Zauber
    level: number;

    source_book: string;

    // Die namen vom Zauber
    name: {
        english: string;
        german: string;
    };

    classes: string[];

    // Die Zauberschule
    /*
     * Bannmagie
     * Beschwörung
     * Erkenntnismagie
     * Verzauberungsmagie
     * Hervorrufung
     * Illusuionsmagie
     * Nekromantie
     * Verwandlung
     */
    school: string;

    // Ritual
    ritual: boolean;

    // Zeitaufwand
    // 'action' | 'bonus action' | 'hour' | 'hours' | 'minute' | 'minutes'
    time_consumption: {
        value: number;
        format: string;
    };
    // Reichweite
    // 'self' | 'touch' | 'view' | 'meters' | 'foot' | 'feet'
    range: {
        format: string;
        value: number;
    };

    // Ziel
    target: string;

    // Komponente
    components: {
        // Verbal
        verbal: boolean;
        // Gestikular
        somatic: boolean;
        // Material
        material: string;
    };

    attributes: string;

    // Dauer
    // 'second' | 'seconds' | 'minute' | 'minutes' | 'hour' | 'hours' | 'instant'
    duration: {
        concentration: boolean;
        format: string;
        value: number;
        additional: string;
    };

    // Beschreibung
    description: string;
    // Höhere Level
    higher_levels: string;
}

export const convertSpell = (spell: ISpell): ISpell => {
    // console.log(components);
    console.log(spell);
    return spell;
};
