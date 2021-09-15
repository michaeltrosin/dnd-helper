import {DialogChannel} from '@/electron/channels/dialog_channel';
import {ISpell} from '@/react/components/spell/types/spell';
import {Attribute, DurationUnit, RangeUnit, School, SpellClass, SpellConstants, TimeUnit} from '@/react/components/spell/types/spell_types';
import '@/react/styles/spell_editor.scss';
import {Channels} from '@/shared/channels';
import {ipc_request} from '@/shared/ipc';
import {SourceBook, SourceBooks, SourceBooksSpell} from '@/shared/source_books';

import '@/utils/extensions';
import {Component} from 'react';

type Props = {
    to_edit: ISpell | undefined;
    spell_updated_cb: (spell: ISpell) => void;
    abort_cb: () => void;
    finish_cb: () => void;
};

type State = {
    mode: 'edit' | 'new';
    _id: string;

    source_book: SourceBook;
    level: number;
    name_eng: string;
    name_ger: string;
    classes: SpellClass[];
    school: School;
    ritual: boolean;

    time_consumption_value: number;
    time_consumption_format: TimeUnit;

    range_value: number;
    range_format: RangeUnit;

    target: string;

    components_verbal: boolean;
    components_somatic: boolean;
    components_material: string;

    attributes: string;

    duration_concentration: boolean;
    duration_format: DurationUnit;
    duration_value: number;
    duration_additional: string;

    description: string;
    higher_levels: string;
};

export class SpellEditor extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        if (this.props.to_edit) {
            this.state = {
                mode: 'edit',
                _id: this.props.to_edit._id ? this.props.to_edit._id : '',

                source_book: this.props.to_edit.source_book as SourceBook,

                components_verbal: this.props.to_edit.components.verbal,
                components_material: this.props.to_edit.components.material,
                components_somatic: this.props.to_edit.components.somatic,
                classes: this.props.to_edit.classes as SpellClass[],
                school: this.props.to_edit.school as School,
                attributes: this.props.to_edit.attributes,
                ritual: this.props.to_edit.ritual,
                time_consumption_value: this.props.to_edit.time_consumption.value,
                time_consumption_format: this.props.to_edit.time_consumption.format as TimeUnit,
                target: this.props.to_edit.target,
                duration_format: this.props.to_edit.duration.format as DurationUnit,
                duration_value: this.props.to_edit.duration.value,
                duration_concentration: this.props.to_edit.duration.concentration,
                duration_additional: this.props.to_edit.duration.additional,
                description: this.props.to_edit.description,
                higher_levels: this.props.to_edit.higher_levels,
                level: this.props.to_edit.level,
                name_eng: this.props.to_edit.name.english,
                name_ger: this.props.to_edit.name.german,
                range_format: this.props.to_edit.range.format as RangeUnit,
                range_value: this.props.to_edit.range.value
            };
        } else {
            this.state = {
                mode: 'new',

                _id: '',

                source_book: 'players_handbook',
                range_value: 0,
                range_format: 'meter',
                name_ger: '',
                name_eng: '',
                level: 0,
                higher_levels: '',
                description: '',
                duration_additional: '',
                duration_format: 'instantaneous',
                duration_concentration: false,
                duration_value: 0,
                target: '',
                time_consumption_format: 'action',
                time_consumption_value: 0,
                ritual: false,
                attributes: '',
                school: 'abjuration',
                classes: [],
                components_somatic: false,
                components_material: '',
                components_verbal: false
            };
        }

        this.build_spell = this.build_spell.bind(this);
        this.change_class = this.change_class.bind(this);
        this.submit = this.submit.bind(this);
        this.checkinput = this.checkinput.bind(this);

        this.props.spell_updated_cb(this.build_spell());
    }

    build_spell(): ISpell {
        return {
            _id: this.state._id,
            source_book: this.state.source_book,
            level: this.state.level,
            range: {
                format: this.state.range_format,
                value: this.state.range_value
            },
            name: {
                english: this.state.name_eng,
                german: this.state.name_ger
            },
            higher_levels: this.state.higher_levels,
            description: this.state.description,
            target: this.state.target,
            ritual: this.state.ritual,
            duration: {
                concentration: this.state.duration_concentration,
                value: this.state.duration_value,
                format: this.state.duration_format,
                additional: this.state.duration_additional
            },
            attributes: this.state.attributes,
            school: this.state.school,
            classes: this.state.classes,
            time_consumption: {
                value: this.state.time_consumption_value,
                format: this.state.time_consumption_format
            },
            components: {
                verbal: this.state.components_verbal,
                somatic: this.state.components_somatic,
                material: this.state.components_material
            }
        };
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (this.state !== prevState) {
            this.props.spell_updated_cb(this.build_spell());
        }
    }

    change_class(spellclass: SpellClass): void {
        const classes: SpellClass[] = [];
        let found = false;
        for (const cls of this.state.classes) {
            if (cls === spellclass) {
                found = true;
                continue;
            }
            classes.push(cls);
        }
        if (!found) {
            classes.push(spellclass);
        }

        this.setState({
            classes: classes.sort((a, b) => {
                return SpellConstants.classes[a].localeCompare(SpellConstants.classes[b]);
            })
        });
    }

    checkinput(): Promise<void> {
        return new Promise<void>((resolve) => {
            let msg = '';

            if (this.state.name_ger.empty()) {
                msg = 'Kein Deutscher name angegeben!';
            } else if (this.state.name_eng.empty()) {
                msg = 'Kein Englischer name angegeben!';
            } else if (this.state.level < 0) {
                msg = 'Das Level darf nicht unter 0 sein!';
            }

            if (msg.empty()) {
                resolve();
                return;
            }

            ipc_request<DialogChannel>(Channels.Dialog, {
                type: 'question',
                buttons: ['Ok'],
                title: 'Achtung!',
                message: msg
            }).catch();
        });
    }

    submit(): void {
        this.checkinput().then(() => {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.build_spell())
            };
            if (this.state.mode === 'edit') {
                const url = `https://dnd.ra6.io/edit/${this.props.to_edit?._id}`;
                ipc_request<DialogChannel>(Channels.Dialog, {
                    type: 'question',
                    buttons: ['Ja', 'Nein'],
                    message: 'Sicher, dass du die änderungen speichern willst?',
                    title: 'Änderungen Speichern'
                }).then(result => {
                    if (result.selected_index === 0) {
                        fetch(url, requestOptions)
                            .then(res => res.json())
                            .then(res => {
                                this.props.spell_updated_cb(res as ISpell);
                                this.props.finish_cb();
                            })
                            .catch(err => console.error(err));
                    }
                });
            } else {
                const url = `https://dnd.ra6.io./add`;
                ipc_request<DialogChannel>(Channels.Dialog, {
                    type: 'question',
                    buttons: ['Ja', 'Nein'],
                    message: 'Sicher, dass du Speichern willst?',
                    title: 'Speichern'
                }).then(result => {
                    if (result.selected_index === 0) {
                        fetch(url, requestOptions)
                            .then(res => res.json())
                            .then(res => {
                                this.props.spell_updated_cb(res as ISpell);
                                this.props.finish_cb();
                            })
                            .catch(err => console.error(err));
                    }
                });
            }
        }).catch();
    }

    render(): JSX.Element {
        return (
            <div className='spell-wrapper spell-editor'>
                <div className='spell-flex'>
                    <div className='spell-flex__child'>
                        <table>
                            <tbody>
                            <tr>
                                <td>Deutsch</td>
                                <td>
                                    <input defaultValue={this.props.to_edit?.name.german} onChange={e => {
                                        this.setState({
                                            name_ger: e.target.value
                                        });
                                    }} type='text'/>
                                </td>
                            </tr>
                            <tr>
                                <td>Englisch</td>
                                <td>
                                    <input defaultValue={this.props.to_edit?.name.english} onChange={e => {
                                        this.setState({
                                            name_eng: e.target.value
                                        });
                                    }} type='text'/>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Level</td>
                                <td>
                                    <input min={0} max={9} defaultValue={this.props.to_edit?.level} onChange={e => {
                                        this.setState({
                                            level: +e.target.value
                                        });
                                    }} type='number'/>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Source</td>
                                <td>
                                    <select defaultValue={this.props.to_edit?.source_book} onChange={e => {
                                        this.setState({
                                            source_book: e.target.value as SourceBook
                                        });
                                    }} name='source_book'>
                                        {
                                            SourceBooksSpell.map(source => {
                                                return (
                                                    <option key={source} value={source}>{SourceBooks[source as SourceBook]}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Klassen</td>
                            </tr>
                            {
                                Object.keys(SpellConstants.classes).sort((a, b) => {
                                    return SpellConstants.classes[a as SpellClass].localeCompare(SpellConstants.classes[b as SpellClass]);
                                }).map(cls => {
                                    return (
                                        <tr key={cls}>
                                            <td>{SpellConstants.classes[cls as SpellClass]}</td>
                                            <td>
                                                <input checked={this.state.classes.some(c => c === cls as SpellClass)}
                                                       onChange={() => {
                                                           this.change_class(cls as SpellClass);
                                                       }} type='checkbox'/>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Schule</td>
                                <td>
                                    <select defaultValue={this.props.to_edit?.school} onChange={e => {
                                        this.setState({
                                            school: e.target.value as School
                                        });
                                    }} name='school'>
                                        {
                                            Object.keys(SpellConstants.schools).map(school => {
                                                return (
                                                    <option key={school} value={school}>{SpellConstants.schools[school as School]}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Ritual</td>
                                <td>
                                    <input checked={this.props.to_edit?.ritual} onChange={e => {
                                        this.setState({
                                            ritual: e.target.checked
                                        });
                                    }} type='checkbox'/>
                                </td>
                            </tr>
                            <tr>
                                <td>Zeitaufwand</td>
                                <td>
                                    <input min={0} defaultValue={this.props.to_edit?.time_consumption.value} onChange={e => {
                                        this.setState({
                                            time_consumption_value: +e.target.value
                                        });
                                    }} type='number'/>
                                    <select defaultValue={this.props.to_edit?.time_consumption.format} onChange={e => {
                                        this.setState({
                                            time_consumption_format: e.target.value as TimeUnit
                                        });
                                    }} name='time_consumption'>
                                        {
                                            Object.keys(SpellConstants.time_units).map(unit => {
                                                return (
                                                    <option key={unit}
                                                            value={unit}>{SpellConstants.time_units[unit as TimeUnit].replace('...', this.state.time_consumption_value.toString())}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Reichweite</td>
                                <td>
                                    <input min={0} defaultValue={this.props.to_edit?.range.value} onChange={e => {
                                        this.setState({
                                            range_value: +e.target.value
                                        });
                                    }} type='number'/>
                                    <select defaultValue={this.props.to_edit?.range.format} onChange={e => {
                                        this.setState({
                                            range_format: e.target.value as RangeUnit
                                        });
                                        console.log(e.target.value);
                                    }} name='range_units'>
                                        {
                                            Object.keys(SpellConstants.range_units).map(unit => {
                                                return (
                                                    <option key={unit}
                                                            value={unit}>{SpellConstants.range_units[unit as RangeUnit].replace('...', this.state.range_value.toString())}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Ziel</td>
                                <td>
                                    <input defaultValue={this.props.to_edit?.target} onChange={e => {
                                        this.setState({
                                            target: e.target.value
                                        });
                                    }} type='text'/>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Komponenten</td>
                            </tr>
                            <tr>
                                <td>Verbal</td>
                                <td>
                                    <input checked={this.props.to_edit?.components.verbal} onChange={e => {
                                        this.setState({
                                            components_verbal: e.target.checked
                                        });
                                    }} type='checkbox'/>
                                </td>
                            </tr>
                            <tr>
                                <td>Gestikular</td>
                                <td>
                                    <input checked={this.props.to_edit?.components.somatic} onChange={e => {
                                        this.setState({
                                            components_somatic: e.target.checked
                                        });
                                    }} type='checkbox'/>
                                </td>
                            </tr>
                            <tr>
                                <td>Material</td>
                                <td>
                                    <input defaultValue={this.props.to_edit?.components.material} onChange={e => {
                                        this.setState({
                                            components_material: e.target.value
                                        });
                                    }} type='text'/>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Dauer</td>
                                <td>
                                    <input min={0} defaultValue={this.props.to_edit?.duration.value} onChange={e => {
                                        this.setState({
                                            duration_value: +e.target.value
                                        });
                                    }} type='number'/>
                                    <select defaultValue={this.props.to_edit?.duration.format} onChange={e => {
                                        this.setState({
                                            duration_format: e.target.value as DurationUnit
                                        });
                                    }} name='duration'>
                                        {
                                            Object.keys(SpellConstants.duration_units).map(unit => {
                                                return (
                                                    <option key={unit}
                                                            value={unit}>{SpellConstants.duration_units[unit as DurationUnit]}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Konzentration</td>
                                <td>
                                    <input checked={this.props.to_edit?.duration.concentration} onChange={e => {
                                        this.setState({
                                            duration_concentration: e.target.checked
                                        });
                                    }} type='checkbox'/>
                                </td>
                            </tr>
                            <tr>
                                <td>Zusätzlich</td>
                                <td>
                                    <input defaultValue={this.props.to_edit?.duration.additional} onChange={e => {
                                        this.setState({
                                            duration_additional: e.target.value
                                        });
                                    }} type='text'/>
                                </td>
                            </tr>
                            <tr>
                                <td>Attribut</td>
                                <td>
                                    <select defaultValue={this.props.to_edit?.attributes} onChange={e => {
                                        this.setState({
                                            attributes: e.target.value as Attribute
                                        });
                                    }} name='attribute'>
                                        {
                                            Object.keys(SpellConstants.attributes).map(attribute => {
                                                return (
                                                    <option key={attribute}
                                                            value={attribute}>{SpellConstants.attributes[attribute as Attribute]}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr className='spell-editor__table-hr'/>
                            <tr>
                                <td>Beschreibung</td>
                                <td>
                                <textarea defaultValue={this.props.to_edit?.description} onChange={e => {
                                    this.setState({
                                        description: e.target.value
                                    });
                                }} name='description' cols={40} rows={20}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Höhere Level:</td>
                                <td>
                                <textarea defaultValue={this.props.to_edit?.higher_levels} onChange={e => {
                                    this.setState({
                                        higher_levels: e.target.value
                                    });
                                }} name='higher_level' cols={40} rows={10}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='spellbottombar'>
                        <button onClick={() => this.submit()}
                                className='spellbottombar__button'>{this.state.mode === 'edit' ? 'Änderungen ' : ''}Speichern
                        </button>
                        <button onClick={() => ipc_request<DialogChannel>(Channels.Dialog, {
                            type: 'question',
                            buttons: ['Ja', 'Nein'],
                            message: 'Willst du wirklich Abbrechen? Der Fortschritt geht dabei verloren!',
                            title: 'Sicher?'
                        }).then(result => {
                            if (result.selected_index === 0) {
                                this.props.abort_cb();
                            }
                        }).catch()} className='spellbottombar__button'>Abbrechen
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
