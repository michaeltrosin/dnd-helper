import {DialogChannel} from '@/electron/channels/dialog_channel';
import {Bottombar, BottombarComponent} from '@/react/components/bottombar/bottombar';
import {Edit, EditModel, EditModelKeys, EditType, Space} from '@/react/components/listview/model/edit_model';
import {FilterType, ItemId, ListModel, ListPreview} from '@/react/components/listview/model/listview_model';
import {SummaryModel} from '@/react/components/listview/model/preview_model';
import {convert_spell, ISpell} from '@/react/components/tabs/spell/types/spell';
import {
    Attribute,
    DurationUnit,
    RangeUnit,
    School,
    SpellClass,
    SpellConstants,
    TimeUnit,
} from '@/react/components/tabs/spell/types/spell_types';
import {Channels} from '@/shared/channels';
import {ipc_request} from '@/shared/ipc';
import {SourceBook, SourceBooks, SourceBooksSpell} from '@/shared/source_books';

import '@/utils/extensions';
import './spell_list.scss';

class SpellSummaryModel extends SummaryModel<ISpell> {
    text_from_value(key: keyof ISpell, item: ISpell): string {
        if (item === undefined) {
            return '';
        }

        const data = item[key];

        if (key === 'name_german') {
            if (!data) {
                return item.name.german;
            }
        }
        if (key === 'name_english') {
            if (!data) {
                return item.name.english;
            }
        }

        if (key === 'source_book') {
            return SourceBooks[item.source_book as SourceBook];
        }

        if (key === 'school') {
            return SpellConstants.schools[item.school as School];
        }
        if (key === 'ritual') {
            return item.ritual ? 'Ja' : 'Nein';
        }
        if (key === 'duration_concentration') {
            return item.duration.concentration ? 'Ja' : 'Nein';
        }
        if (key === 'classes') {
            return item.classes.map(cls => {
                return SpellConstants.classes[cls as SpellClass];
            }).join(', ').trim();
        }
        if (key === 'time_consumption') {
            const value = item.time_consumption.value;
            const format = item.time_consumption.format as TimeUnit;

            if (format === 'up_to_hour' || format === 'up_to_minute') {
                return `${SpellConstants.time_units[format].replace('...', value.toString())}`;
            }

            if (format === 'end_of_round' || format === 'reaction') {
                return SpellConstants.time_units[format];
            }

            return `${value} ${SpellConstants.time_units[format]}`;
        }
        if (key === 'duration') {
            const value = item.duration.value;
            const format = item.duration.format as DurationUnit;

            if (format === 'end_of_turn' || format === 'end_of_target_turn' || format === 'instantaneous') {
                return SpellConstants.duration_units[format];
            }

            if (format === 'up_to_hour' || format === 'up_to_minute') {
                return `${SpellConstants.duration_units[format].replace('...', value.toString())}`;
            }

            return `${value} ${SpellConstants.duration_units[format]}`;
        }

        if (key === 'attributes') {
            return SpellConstants.attributes[item.attributes as Attribute];
        }

        if (key === 'range') {
            const value = item.range.value;
            const format = item.range.format as RangeUnit;

            if (format === 'self_cone_feet' ||
                format === 'self_cone_meter' ||
                format === 'self_cube_feet' ||
                format === 'self_cube_meter' ||
                format === 'self_radius_feet' ||
                format === 'self_radius_meter'
            ) {
                return `${SpellConstants.range_units[format].replace('...', value.toString())}`;
            }

            if (format === 'self' || format === 'touch' || format === 'sight' || format === 'unlimited') {
                return SpellConstants.range_units[format];
            }

            return `${value} ${SpellConstants.range_units[format]}`;
        }
        if (key === 'components') {
            const verbal = item.components.verbal;
            const somatic = item.components.somatic;
            const material = item.components.material;

            return `${verbal ? 'V ' : ''}${somatic ? 'S ' : ''}${material.not_empty() ? 'M (' + material + ')' : ''}`;
        }
        if (key === 'duration_additional') {
            return item.duration.additional;
        }
        return (item[key] ?? '-').toString();
    }

    text_from_key(key: keyof ISpell): string {
        switch (key) {
            case '_id':
                return 'ID';
            case 'name_english':
                return 'ENG Name';
            case 'name_german':
                return 'GER Name';
            case 'source_book':
                return 'Quelle';
            case 'level':
                return 'Level';
            case 'classes':
                return 'Klassen';
            case 'school':
                return 'Schule';
            case 'target':
                return 'Ziel';
            case 'ritual':
                return 'Ritual';
            case 'time_consumption':
                return 'Zeitaufwand';
            case 'range':
                return 'Reichweite';
            case 'components':
                return 'Komponente';
            case 'attributes':
                return 'Attribute';
            case 'description':
                return 'Beschreibung';
            case 'higher_levels':
                return 'Auf höheren leveln';

            case 'duration':
                return 'Dauer';
            case 'duration_format':
                return '';
            case 'duration_value':
                return 'Dauer';
            case 'duration_concentration':
                return 'Konzentration';
            case 'duration_additional':
                return 'Zusätzlich';

            case 'time_consumption_format':
                return '';
            case 'time_consumption_value':
                return 'Zeitaufwand';
            case 'time_consumption_extra':
                return '~Zusatz';

            case 'range_format':
                return '';
            case 'range_value':
                return 'Reichweite';

            case 'components_verbal':
                return 'Verbal';
            case 'components_somatic':
                return 'Gestikular';
            case 'components_material':
                return 'Material';
        }
        return `${key.toString()}`;
    }

    keys(): (keyof ISpell)[] {
        return [
            '_id',
            'name_german',
            'name_english',
            'source_book',
            'level',
            'classes',
            'school',
            'ritual',
            'time_consumption',
            'time_consumption_extra',
            'range',
            'target',
            'components',
            'duration',
            'duration_concentration',
            'duration_additional',
            'attributes',
            'description',
            'higher_levels',
        ];
    }

    bottombar_data(): BottombarComponent[] {
        return [
            Bottombar.button('Bearbeiten', () => {
                this.request_edit_event.invoke();
            }),
            Bottombar.button('Neu', () => {
                this.request_new_event.invoke();
            }),
        ];
    }
}

class SpellEditModel extends EditModel<ISpell> {
    bottombar_data(): BottombarComponent[] {
        return [
            Bottombar.button('Speichern', () => {
                this.request_save_event.invoke();
            }),
            Bottombar.button('Abbrechen', () => {
                this.request_cancel_event.invoke();
            }),
        ];
    }

    validate_and_save(object: ISpell, selected_object: ISpell | undefined): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.check_input(object).then(() => {
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: this.to_html_body(object),
                };

                if (selected_object === undefined) {
                    const url = `https://dnd.ra6.io./add`;
                    ipc_request<DialogChannel>(Channels.Dialog, {
                        type: 'question',
                        buttons: ['Ja', 'Nein'],
                        message: 'Sicher, dass du Speichern willst?',
                        title: 'Speichern',
                    }).then(result => {
                        if (result.selected_index === 0) {
                            fetch(url, requestOptions)
                                .then(res => res.json())
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => console.error(err));
                        }
                    });
                } else {
                    const url = `https://dnd.ra6.io/edit/${selected_object._id}`;
                    console.log(object);
                    ipc_request<DialogChannel>(Channels.Dialog, {
                        type: 'question',
                        buttons: ['Ja', 'Nein'],
                        message: 'Sicher, dass du die Änderungen speichern willst?',
                        title: 'Änderungen Speichern',
                    }).then(result => {
                        if (result.selected_index === 0) {
                            fetch(url, requestOptions)
                                .then(res => res.json())
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => console.error(err));
                        }
                    });
                }
            });
        });
    }

    new(old?: ISpell): ISpell {
        if (old) {
            // console.log(old);
            return old;
        }
        return {
            level: 0,
            source_book: SourceBooksSpell[0],
            name_english: '',
            name_german: '',
            name: {
                german: '',
                english: '',
            },
            classes: [],
            school: 'abjuration',
            ritual: false,
            time_consumption_value: 0,
            time_consumption_format: 'action',
            time_consumption_extra: '',
            time_consumption: {
                value: 0,
                format: 'action',
            },
            range_value: 0,
            range_format: 'self',
            range: {
                value: 0,
                format: 'self',
            },
            target: '',
            components_verbal: false,
            components_somatic: false,
            components_material: '',
            components: {
                verbal: false,
                somatic: false,
                material: '',
            },
            attributes: 'spell',
            duration_concentration: false,
            duration_value: 0,
            duration_format: 'instantaneous',
            duration_additional: '',
            duration: {
                concentration: false,
                value: 0,
                format: 'instantaneous',
                additional: '',
            },
            description: '',
            higher_levels: '',
        };
    }

    to_html_body(item: ISpell): string {
        return JSON.stringify(convert_spell(item));
    }

    keys(): EditModelKeys<ISpell>[] {
        return [
            {
                type: EditType.Textfield,
                binding: 'name_german',
            },
            {
                type: EditType.Textfield,
                binding: 'name_english',
            },

            {
                type: EditType.Numberfield,
                binding: 'level',
                data: [0, 9],
            },
            {
                type: EditType.Combobox,
                binding: 'source_book',
                data: SourceBooksSpell,
            },
            {
                type: EditType.Space,
            },
            {
                type: EditType.CheckboxList,
                binding: 'classes',
                data: Object.keys(SpellConstants.classes),
            },
            {
                type: EditType.Combobox,
                binding: 'school',
                data: Object.keys(SpellConstants.schools),
            },
            {
                type: EditType.Checkbox,
                binding: 'ritual',
            },
            {
                type: EditType.Space,
            },

            {
                type: EditType.Numberfield,
                binding: 'time_consumption_value',
                data: [0],
            },
            {
                type: EditType.Combobox,
                binding: 'time_consumption_format',
                data: Object.keys(SpellConstants.time_units),
            },
            {
                type: EditType.Textfield,
                binding: 'time_consumption_extra',
            },
            {
                type: EditType.Space,
            },

            {
                type: EditType.Numberfield,
                binding: 'range_value',
                data: [0],
            },
            {
                type: EditType.Combobox,
                binding: 'range_format',
                data: Object.keys(SpellConstants.range_units),
            },
            {
                type: EditType.Space,
            },
            {
                type: EditType.Textfield,
                binding: 'target',
            },
            {
                type: EditType.Space,
            },
            {
                type: EditType.Label,
                data: 'Komponente',
            },

            {
                type: EditType.Checkbox,
                binding: 'components_verbal',
            },
            {
                type: EditType.Checkbox,
                binding: 'components_somatic',
            },
            {
                type: EditType.Textfield,
                binding: 'components_material',
            },
            {
                type: EditType.Space,
            },

            {
                type: EditType.Numberfield,
                binding: 'duration_value',
                data: [0],
            },
            {
                type: EditType.Combobox,
                binding: 'duration_format',
                data: Object.keys(SpellConstants.duration_units),
            },
            {
                type: EditType.Checkbox,
                binding: 'duration_concentration',
            },
            {
                type: EditType.Textfield,
                binding: 'duration_additional',
            },
            {
                type: EditType.Combobox,
                binding: 'attributes',
                data: Object.keys(SpellConstants.attributes),
            },
            {
                type: EditType.Space,
            },
            {
                type: EditType.Textarea,
                binding: 'description',
            },
            {
                type: EditType.Textarea,
                binding: 'higher_levels',
            },
        ];
    }

    binding_key_value(binding: keyof ISpell, key: string): string {
        if (binding === 'school') {
            return SpellConstants.schools[key as School];
        }
        if (binding === 'classes') {
            return SpellConstants.classes[key as SpellClass];
        }
        if (binding === 'time_consumption_format') {
            return SpellConstants.time_units[key as TimeUnit];
        }
        if (binding === 'range_format') {
            return SpellConstants.range_units[key as RangeUnit];
        }
        if (binding === 'attributes') {
            return SpellConstants.attributes[key as Attribute];
        }
        if (binding === 'duration_format') {
            return SpellConstants.duration_units[key as DurationUnit];
        }
        if (binding === 'source_book') {
            return SourceBooks[key as SourceBook];
        }
        return '';
    }


    check_input(item: ISpell): Promise<void> {
        return new Promise<void>((resolve) => {
            let msg = '';

            if (item.name_german?.empty()) {
                msg = 'Kein Deutscher name angegeben!';
            } else if (item.name_english?.empty()) {
                msg = 'Kein Englischer name angegeben!';
            } else if (item.level < 0) {
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
                message: msg,
            }).catch();
        });
    }
}

type Sorting = {
    binding: keyof (ISpell);
    dir: 'asc' | 'desc';
};

class SpellModel extends ListModel<ISpell> {
    private title_string = '';

    private sortings: Map<string, Sorting> = new Map<string, Sorting>([
        ['level_asc', {binding: 'level', dir: 'asc'}],
        ['level_desc', {binding: 'level', dir: 'desc'}],
        ['name_asc', {binding: 'name_german', dir: 'asc'}],
        ['name_desc', {binding: 'name_german', dir: 'desc'}],
    ]);

    private sorting: Sorting | undefined = this.sortings.get('level_asc');

    list_preview: ListPreview<ISpell>[] = [
        {display: 'Level', binding: 'level', sortable: true},
        {display: 'Name', binding: 'name_german', sortable: true},
        {display: 'Klassen', binding: 'classes'},
        {display: 'Quelle', binding: 'source_book'},
    ];

    summary_model: SummaryModel<ISpell> = new SpellSummaryModel();
    edit_model = new SpellEditModel();

    filter_data: Map<keyof (ISpell), FilterType> = new Map<keyof (ISpell), FilterType>([
        ['level', {
            bounds: Array.from(Array(10).keys()),
            data: Array.from(Array(10).keys()),
        }],
        ['classes', {
            binding: SpellConstants.classes,
            bounds: Array.from(Object.keys(SpellConstants.classes)),
            data: Array.from(Object.keys(SpellConstants.classes)),
        }],
        ['source_book', {
            binding: SourceBooks,
            bounds: Array.from(SourceBooksSpell),
            data: Array.from(SourceBooksSpell),
        }],
    ]);

    text_from_binding(itemId: ItemId, binding: keyof ISpell): string {
        const item = this.get_item(itemId);
        if (item === undefined) {
            return '';
        }
        return this.summary_model.text_from_value(binding, item.data);
    }

    fetch_items(): void {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };
        let url: string;
        if (this.title_string.empty()) {
            url = `https://dnd.ra6.io/all`;
        } else {
            url = `https://dnd.ra6.io/spell/${this.title_string}`;
        }
        fetch(url, requestOptions)
            .then(res => res.json())
            .then(res => {
                this.clear();
                for (const spell of res) {
                    this.add(convert_spell(spell as ISpell));
                }
            })
            .then(() => {
                this.request_change_event.invoke();
            })
            .catch(err => console.log(err));
    }

    header_item_clicked(binding: keyof ISpell): void {
        const cur_sorting = this.sorting;

        if (binding === 'level') {
            // sort by level
            if (cur_sorting === undefined || cur_sorting.binding !== 'level') {
                this.sorting = this.sortings.get('level_asc');
            } else {
                if (cur_sorting.dir === 'asc') {
                    this.sorting = this.sortings.get('level_desc');
                } else {
                    this.sorting = this.sortings.get('level_asc');
                }
            }

        } else if (binding === 'name_german') {
            // sort by name
            if (cur_sorting === undefined || cur_sorting.binding !== 'name_german') {
                this.sorting = this.sortings.get('name_asc');
            } else {
                if (cur_sorting.dir === 'asc') {
                    this.sorting = this.sortings.get('name_desc');
                } else {
                    this.sorting = this.sortings.get('name_asc');
                }
            }
        }

        this.request_change_event.invoke();
    }

    protected sorted_filtered_items(): ItemId[] {
        if (!this.sorting) {
            return Array.from(this.Items.keys());
        }

        // 1. Filter;
        const filtered: ItemId[] = Array.from(this.Items.keys()).filter(id => {
            const item = this.get_item(id)?.data;
            if (item === undefined) {
                return false;
            }

            let includes = true;

            for (const [binding, {data}] of Array.from(this.filter_data.entries())) {
                if (Array.isArray(item[binding])) {
                    includes = includes && data.some(t => {
                        if ((item[binding] as any[]).length === 0) {
                            return true;
                        }
                        return (item[binding] as any[]).includes(t);
                    });
                } else {
                    includes = includes && data.includes(item[binding]);
                }
            }

            return includes;
        });

        // 2. Sort;
        const sorted: ItemId[] = filtered.sort((a, b) => {
            const item_a = this.get_item(a)?.data;
            const item_b = this.get_item(b)?.data;

            if (item_a === undefined || item_b === undefined) {
                return 0;
            }

            if (this.sorting?.binding === 'level') {
                if (this.sorting.dir === 'asc') {
                    return item_a.level - item_b.level;
                } else {
                    return item_b.level - item_a.level;
                }
            } else if (this.sorting?.binding === 'name_german') {
                if (this.sorting.dir === 'asc') {
                    return item_a.name_german?.localeCompare(item_b.name_german ?? '') ?? 0;
                } else {
                    return item_b.name_german?.localeCompare(item_a.name_german ?? '') ?? 0;
                }
            }

            return 0;
        });

        return sorted;
    }

    bottombar_data(): BottombarComponent[] {
        return [
            Bottombar.input('Titel', '', content => {
                this.title_string = content;
            }, key => {
                if (key.toLowerCase() === 'enter') {
                    this.fetch_items();
                }
            }),
            Bottombar.button('Suchen', () => {
                this.fetch_items();
            }),
            Bottombar.button('Filter', () => {
                this.trigger_filter_event.invoke();
            }),
        ];
    }
}

export {SpellModel, SpellSummaryModel};
