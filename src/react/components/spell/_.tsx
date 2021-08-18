// import {ChangeEvent, Component} from 'react';
//
// import '@/utils/extensions';
//
// import {classes} from '@/utils/class_utils';
// import {ISpell} from './spell_model';
// import {SpellSumary} from './__';
// import {
//     Attribute,
//     attributes,
//     duration_units,
//     DurationUnit,
//     range_units,
//     RangeUnit,
//     School,
//     schools,
//     spell_classes,
//     SpellClass,
//     time_units,
//     TimeUnit
// } from './spell_types';
//
// import './spell_editor.scss';
//
// import {ipcRenderer} from 'electron';
// import {Ipc} from '@/shared/ipc';
// import {Channels} from '@/shared/channels';
// import {DialogChannel} from '@/electron/channels/dialog_channel';
// import {MessageQueueChannel} from '@/electron/channels/message_queue_channel';
//
// type State = {
//     editing: boolean;
//
//     level: number;
//     name_english: string;
//     name_german: string;
//     classes: SpellClass[];
//     school: School;
//     ritual: boolean;
//     time_consumption_value: number;
//     time_consumption_format: TimeUnit;
//     range_format: RangeUnit;
//     range_value: number;
//     target: string;
//     components_verbal: boolean;
//     components_somatic: boolean;
//     components_material: string;
//     duration_concentration: boolean;
//     duration_format: DurationUnit;
//     duration_value: number;
//     duration_additional: string;
//     description: string;
//     higher_levels: string;
//     attributes: Attribute;
// };
//
// type Props = {
//     spell: (ISpell & { id: number }) | null
// };
//
// export class SpellEditor extends Component<Props, State> {
//     constructor(props: Props) {
//         super(props);
//
//         if (this.props.spell) {
//             this.state = {
//                 editing: false,
//
//                 attributes: this.props.spell.attributes as Attribute,
//                 classes: this.props.spell.classes as SpellClass[],
//                 components_material: this.props.spell.components.material,
//                 components_somatic: this.props.spell.components.somatic,
//                 components_verbal: this.props.spell.components.verbal,
//                 description: this.props.spell.description,
//                 level: this.props.spell.level,
//                 name_german: this.props.spell.name.german,
//                 name_english: this.props.spell.name.english,
//                 duration_additional: this.props.spell.duration.additional,
//                 duration_value: this.props.spell.duration.value,
//                 duration_format: this.props.spell.duration.format as DurationUnit,
//                 duration_concentration: this.props.spell.duration.concentration,
//                 range_format: this.props.spell.range.format as RangeUnit,
//                 range_value: this.props.spell.range.value,
//                 higher_levels: this.props.spell.higher_levels,
//                 ritual: this.props.spell.ritual,
//                 school: this.props.spell.school as School,
//                 target: this.props.spell.target,
//                 time_consumption_format: this.props.spell.time_consumption.format as TimeUnit,
//                 time_consumption_value: this.props.spell.time_consumption.value
//             };
//         } else {
//             this.state = {
//                 editing: true,
//
//                 attributes: 'spell',
//                 classes: [],
//                 components_material: '',
//                 components_somatic: false,
//                 components_verbal: false,
//                 description: '',
//                 level: 0,
//                 name_german: '',
//                 name_english: '',
//                 duration_additional: '',
//                 duration_value: 0,
//                 duration_format: 'minute',
//                 duration_concentration: false,
//                 range_format: 'meter',
//                 range_value: 0,
//                 higher_levels: '',
//                 ritual: false,
//                 school: 'abjuration',
//                 target: '',
//                 time_consumption_format: 'action',
//                 time_consumption_value: 0
//             };
//         }
//
//         this.change_name = this.change_name.bind(this);
//         this.change_level = this.change_level.bind(this);
//         this.change_classes = this.change_classes.bind(this);
//         this.change_higher_level = this.change_higher_level.bind(this);
//         this.change_description = this.change_description.bind(this);
//         this.change_attributes = this.change_attributes.bind(this);
//         this.change_additional = this.change_additional.bind(this);
//         this.change_concentration = this.change_concentration.bind(this);
//         this.change_duration_value = this.change_duration_value.bind(this);
//         this.change_duration_type = this.change_duration_type.bind(this);
//         this.change_component = this.change_component.bind(this);
//         this.change_target = this.change_target.bind(this);
//         this.change_range_type = this.change_range_type.bind(this);
//         this.change_range_value = this.change_range_value.bind(this);
//         this.change_time_type = this.change_time_type.bind(this);
//         this.change_time_value = this.change_time_value.bind(this);
//         this.change_ritual = this.change_ritual.bind(this);
//         this.change_school = this.change_school.bind(this);
//
//         this.submit = this.submit.bind(this);
//         this.get_as_spell = this.get_as_spell.bind(this);
//     }
//
//     readonly url: string = 'https://dnd.ra6.io';
//
//     build_find_query(name: string) {
//         return `/spell/${encodeURI(name)}`;
//     }
//
//     change_name(name: 'english' | 'german', e: ChangeEvent<HTMLInputElement>) {
//         if (name === 'english') {
//             this.setState({
//                 name_english: e.target.value
//             });
//         } else {
//             this.setState({
//                 name_german: e.target.value
//             });
//         }
//     }
//
//     change_level(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             level: +e.target.value
//         });
//     }
//
//     change_classes(cls: SpellClass, e: ChangeEvent<HTMLInputElement>) {
//         let array = [...this.state.classes]; // make a separate copy of the array
//
//         if (!this.state.classes.find(value => value === cls)) {
//             array.push(cls);
//         } else {
//             let index = array.indexOf(cls);
//             if (index !== -1) {
//                 array.splice(index, 1);
//             }
//         }
//         this.setState({
//             classes: array
//         });
//     }
//
//     change_higher_level(e: ChangeEvent<HTMLTextAreaElement>) {
//         this.setState({
//             higher_levels: e.target.value
//         });
//     }
//
//     change_description(e: ChangeEvent<HTMLTextAreaElement>) {
//         this.setState({
//             description: e.target.value
//         });
//     }
//
//     change_attributes(e: ChangeEvent<HTMLSelectElement>) {
//         this.setState({
//             attributes: e.target.value as Attribute
//         });
//     }
//
//     change_additional(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             duration_additional: e.target.value
//         });
//     }
//
//     change_concentration(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             duration_concentration: e.target.checked
//         });
//     }
//
//     change_duration_value(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             duration_value: +e.target.value
//         });
//     }
//
//     change_duration_type(e: ChangeEvent<HTMLSelectElement>) {
//         this.setState({
//             duration_format: e.target.value as DurationUnit
//         });
//     }
//
//     change_component(type: 'verbal' | 'somatic' | 'material', e: ChangeEvent<HTMLInputElement>) {
//         if (type === 'verbal') {
//             this.setState({
//                 components_verbal: e.target.checked
//             });
//         } else if (type === 'somatic') {
//             this.setState({
//                 components_somatic: e.target.checked
//             });
//         } else {
//             this.setState({
//                 components_material: e.target.value
//             });
//         }
//     }
//
//     change_target(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             target: e.target.value
//         });
//     }
//
//     change_range_type(e: ChangeEvent<HTMLSelectElement>) {
//         this.setState({
//             range_format: e.target.value as RangeUnit
//         });
//     }
//
//     change_range_value(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             range_value: +e.target.value
//         });
//     }
//
//     change_time_type(e: ChangeEvent<HTMLSelectElement>) {
//         this.setState({
//             time_consumption_format: e.target.value as TimeUnit
//         });
//     }
//
//     change_time_value(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             time_consumption_value: +e.target.value
//         });
//     }
//
//     change_ritual(e: ChangeEvent<HTMLInputElement>) {
//         this.setState({
//             ritual: e.target.checked
//         });
//     }
//
//     change_school(e: ChangeEvent<HTMLSelectElement>) {
//         this.setState({
//             school: e.target.value as School
//         });
//     }
//
//     get_as_spell(): ISpell {
//         return {
//             classes: this.state.classes,
//             target: this.state.target,
//             ritual: this.state.ritual,
//             school: this.state.school,
//             level: this.state.level,
//             attributes: this.state.attributes,
//             higher_levels: this.state.higher_levels,
//             time_consumption: {
//                 value: this.state.time_consumption_value,
//                 format: this.state.time_consumption_format
//             },
//             range: {
//                 value: this.state.range_value,
//                 format: this.state.range_format
//             },
//             description: this.state.description,
//             duration: {
//                 value: this.state.duration_value,
//                 format: this.state.duration_format,
//                 concentration: this.state.duration_concentration,
//                 additional: this.state.duration_additional
//             },
//             name: {
//                 german: this.state.name_german,
//                 english: this.state.name_english
//             },
//             components: {
//                 somatic: this.state.components_somatic,
//                 verbal: this.state.components_verbal,
//                 material: this.state.components_material
//             }
//         };
//     }
//
//     submit() {
//         Ipc.request<DialogChannel>(Channels.Dialog, {
//             buttons: ['Speichern', 'Nicht Speichern'],
//             message: 'Bist du sicher, dass du speichern willst?',
//             title: 'Speichern?',
//             type: 'question'
//         }).then(result => {
//             if (result.selected_index === 0) {
//                 const spell: ISpell = this.get_as_spell();
//
//                 const requestOptions = {
//                     method: 'POST',
//                     headers: {'Content-Type': 'application/json'},
//                     body: JSON.stringify(spell)
//                 };
//
//                 fetch(`${this.url}/add`, requestOptions)
//                     .then(res => res.json())
//                     .then(res => {
//                         console.log(res);
//                     })
//                     .finally(() => {
//                         Ipc.request<MessageQueueChannel>(Channels.MessageQueue, {
//                             method: 'post',
//                             data: {
//                                 type: 'info',
//                                 title: 'Info',
//                                 content: 'In der Datenbank gespeichert'
//                             },
//                             length: 5000
//                         }).catch(err => console.log(err));
//                     });
//             }
//         });
//     }
//
//     render() {
//         return (
//             <div className="spell-editor">
//                 {
//                     this.state.editing ? (
//                         <div className="data">
//                             <div className={classes('border')}>
//                                 <p>Name</p>
//                                 <table>
//                                     <tbody>
//                                     <tr>
//                                         <td>
//                                             <span>Englisch</span>
//                                         </td>
//                                         <td>
//                                             <input type="text" defaultValue={this.state.name_english}
//                                                    onChange={e => this.change_name('english', e)}/>
//                                         </td>
//                                     </tr>
//                                     <tr>
//                                         <td>
//                                             <span>Deutsch</span>
//                                         </td>
//                                         <td>
//                                             <input type="text" defaultValue={this.state.name_german}
//                                                    onChange={e => this.change_name('german', e)}/>
//                                         </td>
//                                     </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Level</p>
//                                 <input type="number" onChange={e => this.change_level(e)} min={0} defaultValue={this.state.level}/>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Klassen</p>
//                                 <table>
//                                     <tbody>
//                                     {
//                                         Object.entries(spell_classes).map(c => {
//                                             return (
//                                                 <tr key={c[0]}>
//                                                     <td>
//                                                         <input defaultChecked={this.state.classes.indexOf(c[0] as SpellClass) !== -1}
//                                                                onChange={e => this.change_classes(c[0] as keyof (typeof spell_classes), e)}
//                                                                type="checkbox"/>
//                                                     </td>
//                                                     <td>
//                                                         <span>{c[1]}</span>
//                                                     </td>
//                                                 </tr>);
//                                         })
//                                     }
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Schule</p>
//                                 <select defaultValue={this.state.school} onChange={e => this.change_school(e)}>
//                                     {
//                                         Object.entries(schools).map(school => {
//                                             return <option key={school[0]} value={school[0]}>{school[1]}</option>;
//                                         })
//                                     }
//                                 </select>
//                             </div>
//                             <div className={classes('border')}>
//                                 <table>
//                                     <tbody>
//                                     <tr>
//                                         <td>
//                                             <input defaultChecked={this.state.ritual} onChange={e => this.change_ritual(e)}
//                                                    type="checkbox"/>
//                                         </td>
//                                         <td>
//                                             <span>Ritual</span>
//                                         </td>
//                                     </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Zeitaufwand</p>
//                                 <input defaultValue={this.state.time_consumption_value} onChange={e => this.change_time_value(e)} min={0}
//                                        type="number"/>
//                                 <select defaultValue={this.state.time_consumption_format} onChange={e => this.change_time_type(e)}>
//                                     {
//                                         Object.entries(time_units).map(time_unit => {
//                                             return <option key={time_unit[0]} value={time_unit[0]}>{time_unit[1]}</option>;
//                                         })
//                                     }
//                                 </select>
//                             </div>
//                             <div className={classes('range', 'border')}>
//                                 <p>Reichweite</p>
//                                 <input defaultValue={this.state.range_value} onChange={e => this.change_range_value(e)} min={0}
//                                        type="number"/>
//                                 <select defaultValue={this.state.range_format} onChange={e => this.change_range_type(e)}>
//                                     {
//                                         Object.entries(range_units).map(range_unit => {
//                                             return <option key={range_unit[0]} value={range_unit[0]}>{range_unit[1]}</option>;
//                                         })
//                                     }
//                                 </select>
//                                 <br/>
//                                 <span className="description">{this.get_value('feet')} fuß ≙ {this.get_value('meter')} m</span>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Ziel</p>
//                                 <input onChange={e => this.change_target(e)} defaultValue={this.state.target} type="text"/>
//                             </div>
//                             <div className={classes('components', 'border')}>
//                                 <p>Komponente</p>
//                                 <div>
//                                     <table>
//                                         <tbody>
//                                         <tr>
//                                             <td>
//                                                 <input defaultChecked={this.state.components_verbal}
//                                                        onChange={e => this.change_component('verbal', e)} type="checkbox"/>
//                                             </td>
//                                             <td>
//                                                 <span>Verbal</span>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td>
//                                                 <input defaultChecked={this.state.components_somatic}
//                                                        onChange={e => this.change_component('somatic', e)} type="checkbox"/>
//                                             </td>
//                                             <td>
//                                                 <span>Gestikular</span>
//                                             </td>
//                                         </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                                 <div>
//                                     <span>Material</span>
//                                     <input defaultValue={this.state.components_material}
//                                            onChange={e => this.change_component('material', e)} type="text"/>
//                                 </div>
//                             </div>
//                             <div className={classes('duration', 'border')}>
//                                 <div>
//                                     <p>Dauer</p>
//                                     <input defaultValue={this.state.duration_value} onChange={e => this.change_duration_value(e)} min={0}
//                                            type="number"/>
//                                     <select defaultValue={this.state.duration_format} onChange={e => this.change_duration_type(e)}>
//                                         {
//                                             Object.entries(duration_units).map(duration_unit => {
//                                                 return <option key={duration_unit[0]} value={duration_unit[0]}>{duration_unit[1]}</option>;
//                                             })
//                                         }
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <table>
//                                         <tbody>
//                                         <tr>
//                                             <td>
//                                                 <input defaultChecked={this.state.duration_concentration}
//                                                        onChange={e => this.change_concentration(e)} type="checkbox"/>
//                                             </td>
//                                             <td>
//                                                 <span>Konzentration</span>
//                                             </td>
//                                         </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                                 <div>
//                                     <p>Zusätzlich</p>
//                                     <input defaultValue={this.state.duration_additional} onChange={e => this.change_additional(e)}
//                                            type="text"/>
//                                 </div>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Attribut</p>
//                                 <select defaultValue={this.state.attributes} onChange={e => this.change_attributes(e)}>
//                                     {
//                                         Object.entries(attributes).map(attribute => {
//                                             return <option key={attribute[0]} value={attribute[0]}>{attribute[1]}</option>;
//                                         })
//                                     }
//                                 </select>
//                             </div>
//                             <div className={classes('description', 'border')}>
//                                 <p>Beschreibung</p>
//                                 <textarea defaultValue={this.state.description} onChange={e => this.change_description(e)} cols={50}
//                                           rows={20}/>
//                             </div>
//                             <div className={classes('border')}>
//                                 <p>Höhere Level</p>
//                                 <textarea defaultValue={this.state.higher_levels} onChange={e => this.change_higher_level(e)} cols={30}
//                                           rows={10}/>
//                             </div>
//                         </div>
//                     ) : (
//                         <SpellSumary spell={this.get_as_spell()}/>
//                     )
//                 }
//                 <div className="form">
//                     <button
//                         onClick={e => this.setState({editing: !this.state.editing})}>{this.state.editing ? 'Zusammenfassung' : 'Bearbeiten'}</button>
//                     <button onClick={e => this.submit()}>Speichern</button>
//                 </div>
//             </div>
//         );
//     }
//
//     get_value(type: 'feet' | 'meter') {
//         const {range_value, range_format} = this.state;
//
//         if (range_format === 'meter') {
//             if (type === 'feet') {
//                 return +((range_value - range_value / 3) * 5).toFixed(1);
//             } else {
//                 return range_value;
//             }
//         } else if (range_format === 'feet') {
//             if (type === 'feet') {
//                 return range_value;
//             } else {
//                 return +(range_value / 10 * 3).toFixed(1);
//             }
//         } else {
//             if (type === 'feet') {
//                 return 5;
//             } else {
//                 return 1.5;
//             }
//         }
//     }
// }
