// import {Component} from "react";
// import {ISpell} from "./spell_model";
// import {Attribute, attributes, duration_units, DurationUnit, range_units, RangeUnit, School, schools, spell_classes, SpellClass, time_units, TimeUnit} from "./spell_types";
//
// import '@/utils/extensions';
//
// type Props = {
//     spell: ISpell
// };
//
// export class SpellSumary extends Component<Props, any> {
//     constructor(props: Props) {
//         super(props);
//     }
//
//     render() {
//         return <div>
//             <table>
//                 <tbody>
//                 <tr>
//                     <td>Name:</td>
//                     <td>
//                         {this.props.spell.name.german.notEmpty() ? this.props.spell.name.german : '-'} | {this.props.spell.name.english.notEmpty() ? this.props.spell.name.english : '-'}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Level:</td>
//                     <td>
//                         {this.props.spell.level}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Klassen:</td>
//                     <td>
//                         {
//                             this.props.spell.classes.length === 0 ? ' -' :
//                                 <ul>
//                                     {
//                                         this.props.spell.classes.map(cls => {
//                                             return (<li>{spell_classes[cls as SpellClass]}</li>)
//                                         })
//                                     }
//                                 </ul>
//                         }
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Schule:</td>
//                     <td>
//                         {schools[this.props.spell.school as School]}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Ritual:</td>
//                     <td>
//                         {this.props.spell.ritual ? 'Ja' : 'Nein'}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Zeitaufwand:</td>
//                     <td>
//                         {this.props.spell.time_consumption.value} {time_units[this.props.spell.time_consumption.format as TimeUnit]}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Reichweite:</td>
//                     <td>
//                         {this.props.spell.range.value} {range_units[this.props.spell.range.format as RangeUnit]}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Ziel:</td>
//                     <td>
//                         {this.props.spell.target.notEmpty() ? this.props.spell.target.trim() : '-'}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Komponente:</td>
//                     <td>
//                         {this.props.spell.components.verbal && 'V '}{this.props.spell.components.somatic && 'G '}{this.props.spell.components.material.notEmpty() && `M: ${this.props.spell.components.material}`}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Dauer:</td>
//                     <td>
//                         {this.props.spell.duration.value} {duration_units[this.props.spell.duration.format as DurationUnit]}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Konzentration:</td>
//                     <td>
//                         {this.props.spell.duration.concentration ? 'Ja' : 'Nein'}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Zusätzlich:</td>
//                     <td>
//                         {this.props.spell.duration.additional.notEmpty() ? this.props.spell.duration.additional.trim() : '-'}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Attribut:</td>
//                     <td>
//                         {attributes[this.props.spell.attributes as Attribute]}
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Beschreibung:</td>
//                     <td>
//                         <div>
//                             {this.props.spell.description.notEmpty() ? this.props.spell.description : '-'}
//                         </div>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>Höhere Level:</td>
//                     <td>
//                         <div>
//                             {this.props.spell.higher_levels.notEmpty() ? this.props.spell.higher_levels : '-'}
//                         </div>
//                     </td>
//                 </tr>
//                 </tbody>
//             </table>
//         </div>;
//     }
// }
