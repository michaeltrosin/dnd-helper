import {ChangeEvent, Component} from 'react';

import './spell_view.scss';

import {ISpell} from '@/react/components/spell/model/spell_model';
import '@/utils/extensions';
import {School, SpellClass, SpellTypes} from '@/react/components/spell/model/spell_types';
import {hash} from '@/utils';
import {SpellSumary} from '@/react/components/spell/spell_summary';
import {SpellEditor} from '@/react/components/spell/spell_editor';

type State = {
    filter_visible: boolean;
    filter: {
        levels: number[];
        schools: School[];
        classes: SpellClass[];
    };
    title: string;
    spells: ISpell[];
    selected_spell?: ISpell;
    spell_view?: ISpell;
    sort_level?: 'asc' | 'desc';
    sort_name?: 'asc' | 'desc';
    edit_mode: boolean;
};

const spell_levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export class SpellView extends Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            filter_visible: false,
            title: '',
            spells: [],
            edit_mode: false,

            filter: {
                levels: spell_levels,
                schools: Object.keys(SpellTypes.schools).map((value) => value as School),
                classes: Object.keys(SpellTypes.classes).map((value) => value as SpellClass)
            }
        };

        this.title_changed = this.title_changed.bind(this);
        this.fetch_items = this.fetch_items.bind(this);
        this.sort = this.sort.bind(this);
        this.filtered = this.filtered.bind(this);
        this.edit = this.edit.bind(this);

        this.change_filter_classes = this.change_filter_classes.bind(this);
        this.change_filter_levels = this.change_filter_levels.bind(this);
        this.change_filter_schools = this.change_filter_schools.bind(this);
        this.add_or_remove_array = this.add_or_remove_array.bind(this);
    }

    title_changed(e: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            title: e.target.value
        });
    }

    fetch_items(): void {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        let url: string;
        if (this.state.title.empty()) {
            url = `https://dnd.ra6.io/all`;
        } else {
            url = `https://dnd.ra6.io/spell/${this.state.title}`;
        }
        fetch(url, requestOptions)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    spells: res as ISpell[]
                });
                this.sort('level', 'asc');
            })
            .catch(err => console.log(err));
    }

    sort(type: 'name' | 'level', dir?: 'asc' | 'desc' | undefined): void {
        let new_name: 'asc' | 'desc' | undefined;
        let new_level: 'asc' | 'desc' | undefined;

        if (type === 'name') {
            new_level = undefined;
            new_name = dir ? dir : this.state.sort_name === 'asc' ? 'desc' : 'asc';
        } else {
            new_name = undefined;
            new_level = dir ? dir : this.state.sort_level === 'asc' ? 'desc' : 'asc';
        }

        this.setState({
            sort_name: new_name,
            sort_level: new_level,
            spells: this.state.spells.sort((a, b) => {
                if (type === 'name') {
                    if (new_name === 'asc') {
                        return a.name.german.toLowerCase().localeCompare(b.name.german.toLowerCase());
                    } else {
                        return b.name.german.toLowerCase().localeCompare(a.name.german.toLowerCase());
                    }
                } else {
                    if (new_level === 'asc') {
                        return a.level > b.level ? 1 : -1;
                    } else {
                        return a.level < b.level ? 1 : -1;
                    }
                }
            })
        });
    }

    add_or_remove_array<T>(array: T[], value: T): T[] {
        const arr: T[] = [];
        let found = false;
        for (const cls of array) {
            if (cls === value) {
                found = true;
                continue;
            }
            arr.push(cls);
        }
        if (!found) {
            arr.push(value);
        }
        return arr;
    }

    change_filter_levels(level: number): void {
        this.setState(prevState => ({
            filter: {
                ...prevState.filter,
                levels: this.add_or_remove_array(this.state.filter.levels, level)
            }
        }));
    }

    change_filter_classes(clss: SpellClass): void {
        this.setState(prevState => ({
            filter: {
                ...prevState.filter,
                classes: this.add_or_remove_array(this.state.filter.classes, clss)
            }
        }));
    }

    change_filter_schools(school: School): void {
        this.setState(prevState => ({
            filter: {
                ...prevState.filter,
                schools: this.add_or_remove_array(this.state.filter.schools, school)
            }
        }));
    }

    filtered(): ISpell[] {
        const filter = this.state.filter;
        console.log(filter);
        return this.state.spells.filter(spell => {
            const level_contains = filter.levels.includes(spell.level);
            const class_contains = filter.classes.some(cls => spell.classes.includes(cls));
            const school_contains = filter.schools.includes(spell.school as School);
            return level_contains && class_contains && school_contains;
        });
    }

    edit(spell: ISpell | undefined): void {
        this.setState({
            selected_spell: spell,
            spell_view: spell,
            edit_mode: true
        });
    }

    render(): JSX.Element {
        return (
            <div className='spell-flex spell-flex-horizontal'>
                {
                    !this.state.edit_mode &&
                    <div className='spell-wrapper spell-search'>
                      <div className='spell-flex'>
                        <div className='spell-flex__child spell-search__list'>
                          <table className='spell-search__table'>
                            <thead className='spell-search__table-head'>
                            <tr className='spell-search__table-head-row'>
                              <th className='spell-search__table-head-content spell-search__table-level clickable'
                                  onClick={() => this.sort('level')}>
                                Level{this.state.sort_level && (this.state.sort_level !== 'asc' ? '˅' : '˄')}
                              </th>
                              <th className='spell-search__table-head-content clickable' onClick={() => this.sort('name')}>
                                Name{this.state.sort_name && (this.state.sort_name !== 'asc' ? '˅' : '˄')}
                              </th>
                              <th className='spell-search__table-head-content'>
                                Klasse/-n
                              </th>
                              <th className='spell-search__table-head-content spell-search__table-head-spacing'>
                                &nbsp;
                              </th>
                            </tr>
                            </thead>
                            <tbody className='spell-search__table-body'>
                            {
                                this.filtered().map(spell => {
                                    return (
                                        <tr className='spell-search__table-body-row' onClick={() => this.setState({
                                            spell_view: spell
                                        })} key={hash(spell.name.german)}>
                                            <td className='spell-search__table-body-data spell-search__table-level'>{spell.level}</td>
                                            <td>{spell.name.german}</td>
                                            <td>
                                                {
                                                    spell.classes.sort((a, b) => {
                                                        return SpellTypes.classes[a as SpellClass].localeCompare(SpellTypes.classes[b as SpellClass]);
                                                    }).map((cls, index) => {
                                                        return (
                                                            <span key={index}>
                                                              {SpellTypes.classes[cls as SpellClass]}{index === spell.classes.length - 1 ? '' : ', '}
                                                            </span>
                                                        );
                                                    })
                                                }
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                          </table>
                        </div>
                          {
                              this.state.filter_visible &&
                              <div className='spellfilter'>
                                <div className='spellfilter-padding'>

                                  <table className='spellfilter__table'>
                                    <thead>
                                    <tr>
                                      <th>
                                        <p className='spellfilter__p'>Level</p>
                                      </th>
                                      <th>
                                        <p className='spellfilter__p'>Klasse</p>
                                      </th>
                                      <th>
                                        <p className='spellfilter__p'>Schule</p>
                                      </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                      <td>
                                          {
                                              spell_levels.map(level => {
                                                  return (
                                                      <p className='spellfilter__p' key={level}>
                                                          <input onChange={() => {
                                                              this.change_filter_levels(level);
                                                          }} checked={this.state.filter.levels.includes(level)}
                                                                 type='checkbox'/>{level}
                                                      </p>
                                                  );
                                              })
                                          }
                                      </td>
                                      <td>
                                          {
                                              Object.keys(SpellTypes.classes).sort((a, b) => {
                                                  return SpellTypes.classes[a as SpellClass].localeCompare(SpellTypes.classes[b as SpellClass]);
                                              }).map(cls => {
                                                  return (
                                                      <p className='spellfilter__p' key={cls}>
                                                          <input onChange={() => {
                                                              this.change_filter_classes(cls as SpellClass);
                                                          }} checked={this.state.filter.classes.includes(cls as SpellClass)}
                                                                 type='checkbox'/>{SpellTypes.classes[cls as SpellClass]}
                                                      </p>
                                                  );
                                              })
                                          }
                                      </td>
                                      <td>
                                          {
                                              Object.keys(SpellTypes.schools).sort((a, b) => {
                                                  return SpellTypes.schools[a as School].localeCompare(SpellTypes.schools[b as School]);
                                              }).map(school => {
                                                  return (
                                                      <p className='spellfilter__p' key={school}>
                                                          <input onChange={() => {
                                                              this.change_filter_schools(school as School);
                                                          }} checked={this.state.filter.schools.includes(school as School)}
                                                                 type='checkbox'/>{SpellTypes.schools[school as School]}
                                                      </p>
                                                  );
                                              })
                                          }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>

                                        <button onClick={() => {
                                            this.setState((prev) => ({
                                                filter: {
                                                    ...prev.filter,
                                                    levels: spell_levels
                                                }
                                            }));
                                        }} className='spellfilter__button'>Alle
                                        </button>
                                        <button onClick={() => {
                                            this.setState((prev) => ({
                                                filter: {
                                                    ...prev.filter,
                                                    levels: []
                                                }
                                            }));
                                        }} className='spellfilter__button'>Keine
                                        </button>
                                      </td>
                                      <td>
                                        <button onClick={() => {
                                            this.setState((prev) => ({
                                                filter: {
                                                    ...prev.filter,
                                                    classes: Object.keys(SpellTypes.classes).map((value) => value as SpellClass)
                                                }
                                            }));
                                        }} className='spellfilter__button'>Alle
                                        </button>
                                        <button onClick={() => {
                                            this.setState((prev) => ({
                                                filter: {
                                                    ...prev.filter,
                                                    classes: []
                                                }
                                            }));
                                        }} className='spellfilter__button'>Keine
                                        </button>
                                      </td>
                                      <td>
                                        <button onClick={() => {
                                            this.setState((prev) => ({
                                                filter: {
                                                    ...prev.filter,
                                                    schools: Object.keys(SpellTypes.schools).map((value) => value as School)
                                                }
                                            }));
                                        }} className='spellfilter__button'>Alle
                                        </button>
                                        <button onClick={() => {
                                            this.setState((prev) => ({
                                                filter: {
                                                    ...prev.filter,
                                                    schools: []
                                                }
                                            }));
                                        }} className='spellfilter__button'>Keine
                                        </button>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                          }
                        <div className='spellbottombar'>
                          <input className='spellbottombar__input spellbottombar__input-long'
                                 onKeyPress={event => {
                                     if (event.key.toLowerCase() === 'enter') {
                                         this.fetch_items();
                                     }
                                 }} onChange={e => this.title_changed(e)} type='text'
                                 placeholder='Titel'/>
                          <button className='spellbottombar__button'
                                  onClick={() => this.fetch_items()}>Suchen
                          </button>
                          <button className='spellbottombar__button'
                                  onClick={() => this.setState({filter_visible: !this.state.filter_visible})}>Filter
                            <span>{this.state.filter_visible ? '˅' : '˄'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                }
                {
                    this.state.edit_mode &&
                    <SpellEditor spell_updated_cb={spell => {
                        this.setState({
                            spell_view: spell
                        });
                    }} abort_cb={() => {
                        this.setState({
                            edit_mode: false,
                            spell_view: undefined
                        });
                    }} finish_cb={() => {
                        this.setState({
                            edit_mode: false
                        });
                        this.fetch_items();
                    }} to_edit={this.state.selected_spell}/>

                }
                <div className='spell-wrapper spell-summary_wrapper'>
                    <div className='spell-flex'>
                        <SpellSumary spell={this.state.spell_view}/>
                        {
                            !this.state.edit_mode &&
                            <div className='spellbottombar'>
                              <button className='spellbottombar__button'
                                      onClick={() => {
                                          this.edit(undefined);
                                      }}>Neu
                              </button>
                                {
                                    this.state.spell_view &&
                                    <button className='spellbottombar__button'
                                            onClick={() => {
                                                this.edit(this.state.spell_view);
                                            }}>Bearbeiten
                                    </button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
