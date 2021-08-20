import {CSSProperties} from 'react';

export interface CustomStyles extends CSSProperties {
    '--background-color'?: string;

    '--spellview-name-width'?: string;
    '--spellview-level-width'?: string;
    '--spellview-classes-width'?: string;
}
