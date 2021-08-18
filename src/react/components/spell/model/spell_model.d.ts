export interface ISpell {
    level: number;
    name: {
        english: string;
        german: string;
    };
    classes: string[];
    school: string;
    ritual: boolean;
    time_consumption: {
        value: number;
        format: string;
    };
    range: {
        format: string;
        value: number;
    };
    target: string;
    components: {
        verbal: boolean;
        somatic: boolean;
        material: string;
    };
    attributes: string;
    duration: {
        concentration: boolean;
        format: string;
        value: number;
        additional: string;
    };
    description: string;
    higher_levels: string;
}
