import {Component} from 'react';
import {Attribute, DurationUnit, RangeUnit, School, SpellClass, SpellTypes, TimeUnit} from '@/react/components/spell/model/spell_types';

import '@/utils/extensions';
import './spell_summary.scss';

import {ISpell} from '@/react/components/spell/model/spell_model';
import {hash} from '@/utils';

type Props = {
    spell?: ISpell
};

export class SpellSumary extends Component<Props, any> {

    render(): JSX.Element {
        if (!this.props.spell) {
            return <div className='spell-flex__child spell-summary'>Kein Spell ausgewählt</div>;
        }
        return (
            <div className='spell-flex__child spell-summary'>
                <table>
                    <tbody>
                    <tr className='spell-summary__id'>
                        <td>Id:</td>
                        <td>{this.props.spell._id}</td>
                    </tr>
                    <tr>
                        <td>Name GER:</td>
                        <td>
                            <div className='spell-summary__description'>
                                {this.props.spell.name.german.notEmpty() ? this.props.spell.name.german : '-'}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Name ENG:</td>
                        <td>
                            <div className='spell-summary__description'>
                                {this.props.spell.name.english.notEmpty() ? this.props.spell.name.english : '-'}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Level:</td>
                        <td>
                            {this.props.spell.level}
                        </td>
                    </tr>
                    <tr>
                        <td>Klassen:</td>
                        <td>
                            {
                                this.props.spell.classes.length === 0 ? ' -' :
                                    <ul>
                                        {
                                            this.props.spell.classes.sort((a, b) => {
                                                return SpellTypes.classes[a as SpellClass].localeCompare(SpellTypes.classes[b as SpellClass]);
                                            }).map(cls => {
                                                return (<li key={hash(cls)}>{SpellTypes.classes[cls as SpellClass]}</li>);
                                            })
                                        }
                                    </ul>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>Schule:</td>
                        <td>
                            {SpellTypes.schools[this.props.spell.school as School]}
                        </td>
                    </tr>
                    <tr>
                        <td>Ritual:</td>
                        <td>
                            {this.props.spell.ritual ? 'Ja' : 'Nein'}
                        </td>
                    </tr>
                    <tr>
                        <td>Zeitaufwand:</td>
                        <td>
                            {(
                                SpellTypes.time_units[this.props.spell.time_consumption.format as TimeUnit] === SpellTypes.time_units.minute ||
                                SpellTypes.time_units[this.props.spell.time_consumption.format as TimeUnit] === SpellTypes.time_units.hour ||
                                SpellTypes.time_units[this.props.spell.time_consumption.format as TimeUnit] === SpellTypes.time_units.round ||
                                SpellTypes.time_units[this.props.spell.time_consumption.format as TimeUnit] === SpellTypes.time_units.action ||
                                SpellTypes.time_units[this.props.spell.time_consumption.format as TimeUnit] === SpellTypes.time_units.bonus_action
                            ) ? this.props.spell.time_consumption.value : ''} {SpellTypes.time_units[this.props.spell.time_consumption.format as TimeUnit].replace('...', this.props.spell.time_consumption.value.toString())}
                        </td>
                    </tr>
                    <tr>
                        <td>Reichweite:</td>
                        <td>
                            {(
                                SpellTypes.range_units[this.props.spell.range.format as RangeUnit] === SpellTypes.range_units.meter ||
                                SpellTypes.range_units[this.props.spell.range.format as RangeUnit] === SpellTypes.range_units.feet
                            ) ? this.props.spell.range.value : ''} {SpellTypes.range_units[this.props.spell.range.format as RangeUnit].replace('...', this.props.spell.range.value.toString())}
                        </td>
                    </tr>
                    <tr>
                        <td>Ziel:</td>
                        <td>
                            <div className='spell-summary__description'>
                                {this.props.spell.target.notEmpty() ? this.props.spell.target.trim() : '-'}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Komponente:</td>
                        <td>
                            {this.props.spell.components.verbal && 'V '}{this.props.spell.components.somatic && 'G '}{this.props.spell.components.material.notEmpty() && `M: ${this.props.spell.components.material}`}
                        </td>
                    </tr>
                    <tr>
                        <td>Dauer:</td>
                        <td>
                            {(
                                SpellTypes.duration_units[this.props.spell.duration.format as DurationUnit] === SpellTypes.duration_units.hour ||
                                SpellTypes.duration_units[this.props.spell.duration.format as DurationUnit] === SpellTypes.duration_units.minute
                            ) ? this.props.spell.duration.value : ''} {SpellTypes.duration_units[this.props.spell.duration.format as DurationUnit]}
                        </td>
                    </tr>
                    <tr>
                        <td>Konzentration:</td>
                        <td>
                            {this.props.spell.duration.concentration ? 'Ja' : 'Nein'}
                        </td>
                    </tr>
                    <tr>
                        <td>Zusätzlich:</td>
                        <td>
                            <div className='spell-summary__description'>
                                {this.props.spell.duration.additional.notEmpty() ? this.props.spell.duration.additional.trim() : '-'}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Attribut:</td>
                        <td>
                            {SpellTypes.attributes[this.props.spell.attributes as Attribute]}
                        </td>
                    </tr>
                    <tr>
                        <td>Beschreibung:</td>
                        <td>
                            <div className='spell-summary__description'>
                                {this.props.spell.description.notEmpty() ? this.props.spell.description : '-'}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Höhere Level:</td>
                        <td>
                            <div className='spell-summary__description'>
                                {this.props.spell.higher_levels.notEmpty() ? this.props.spell.higher_levels : '-'}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
