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

    name_english?: string;
    name_german?: string;

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

    time_consumption_value?: number;
    time_consumption_format?: string;

    // Reichweite
    // 'self' | 'touch' | 'view' | 'meters' | 'foot' | 'feet'
    range: {
        format: string;
        value: number;
    };

    range_format?: string;
    range_value?: number;

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

    components_verbal?: boolean;
    components_somatic?: boolean;
    components_material?: string;

    attributes: string;

    // Dauer
    // 'second' | 'seconds' | 'minute' | 'minutes' | 'hour' | 'hours' | 'instant'
    duration: {
        concentration: boolean;
        format: string;
        value: number;
        additional: string;
    };

    duration_concentration?: boolean;
    duration_format?: string;
    duration_value?: number;
    duration_additional?: string;

    // Beschreibung
    description: string;
    // Höhere Level
    higher_levels: string;
}

export const convert_spell = (spell: ISpell): ISpell => {
    const name = {
        german: spell.name.german.text_if_empty(spell.name_german ?? ''),
        english: spell.name.english.text_if_empty(spell.name_english ?? ''),
    };

    const time_consumption = {
        value: +(spell.time_consumption_value?.toString() ?? '0'),
        format: spell.time_consumption_format ?? '',
    };
    const range = {
        value: +(spell.range_value?.toString() ?? '0'),
        format: spell.range_format ?? '',
    };

    const components = {
        verbal: Boolean(String(spell.components_verbal) ?? 'false'),
        somatic: Boolean(String(spell.components_somatic) ?? 'false'),
        material: spell.components_material ?? '',
    };

    const duration = {
        concentration: Boolean(String(spell.duration_concentration) ?? 'false'),
        format: spell.duration_format ?? '',
        value: +(spell.duration_value?.toString() ?? '0'),
        additional: spell.duration_additional ?? '',
    };

    if (!spell.time_consumption_format) {
        time_consumption.value = spell.time_consumption.value;
        time_consumption.format = spell.time_consumption.format;

        range.value = spell.range.value;
        range.format = spell.range.format;

        components.verbal = spell.components.verbal;
        components.somatic = spell.components.somatic;
        components.material = spell.components.material;

        duration.value = spell.duration.value;
        duration.format = spell.duration.format;
        duration.concentration = spell.duration.concentration;
        duration.additional = spell.duration.additional;
    }


    return {
        _id: spell._id,
        level: spell.level,
        source_book: spell.source_book,

        name,
        name_english: name.english,
        name_german: name.german,

        classes: spell.classes,
        school: spell.school,
        ritual: spell.ritual,
        target: spell.target,

        time_consumption,
        time_consumption_value: time_consumption.value,
        time_consumption_format: time_consumption.format,

        range,
        range_value: range.value,
        range_format: range.format,


        components,
        components_verbal: components.verbal,
        components_material: components.material,
        components_somatic: components.somatic,

        attributes: spell.attributes,

        duration,
        duration_additional: duration.additional,
        duration_concentration: duration.concentration,
        duration_format: duration.format,
        duration_value: duration.value,

        description: spell.description,
        higher_levels: spell.higher_levels,
    };
};
