import { DialogChannel } from '@/electron/channels/dialog_channel';
import { Bottombar, BottombarComponent } from '@/react/components/bottombar/bottombar';
import { EditModel, EditModelKeys, EditType } from '@/react/components/listview/model/edit_model';
import { FilterType, ItemId, ListModel, ListPreview } from '@/react/components/listview/model/listview_model';
import { SummaryModel } from '@/react/components/listview/model/preview_model';
import { convertSpell, ISpell } from '@/react/components/tabs/spell/types/spell';
import { Attribute, DurationUnit, RangeUnit, School, SpellClass, SpellConstants, TimeUnit } from '@/react/components/tabs/spell/types/spell_types';
import { Channels } from '@/shared/channels';
import { ipcRequest } from '@/shared/ipc';
import { SourceBook, SourceBooks, SourceBooksSpell } from '@/shared/source_books';
import { DEFAULT_GET_OPTIONS, DEFAULT_POST_OPTIONS, SPELL_URLS } from '@/shared/urls';
import '@/utils/extensions';
import { getNested, NestedKeyOf } from '@/utils/generics';
import './spell_list.scss';

class SpellSummaryModel extends SummaryModel<ISpell> {
    textFromValue(key: NestedKeyOf<ISpell>, item: ISpell): string {
        if (item === undefined) {
            return '';
        }

        const data = getNested(item, key);

        if (key === 'name.german') {
            if (!data) {
                return item.name.german;
            }
        }
        if (key === 'name.english') {
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
        if (key === 'duration.concentration') {
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

            return `${verbal ? 'V ' : ''}${somatic ? 'S ' : ''}${material.notEmpty() ? 'M (' + material + ')' : ''}`;
        }
        if (key === 'duration.additional') {
            return item.duration.additional;
        }
        return (data ?? '-').toString();
    }

    textFromKey(key: NestedKeyOf<ISpell>): string {
        switch (key) {
            case '_id':
                return 'ID';
            case 'name.english':
                return 'ENG Name';
            case 'name.german':
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

            case 'attributes':
                return 'Attribute';
            case 'description':
                return 'Beschreibung';
            case 'higher_levels':
                return 'Auf höheren leveln';

            case 'duration':
            case 'duration.value':
                return 'Dauer';
            case 'duration.format':
                return '';
            case 'duration.concentration':
                return 'Konzentration';
            case 'duration.additional':
                return 'Zusätzlich';

            case 'time_consumption':
            case 'time_consumption.value':
                return 'Zeitaufwand';
            case 'time_consumption.format':
                return '';

            case 'range':
            case 'range.value':
                return 'Reichweite';
            case 'range.format':
                return '';

            case 'components':
                return 'Komponente';
            case 'components.verbal':
                return 'Verbal';
            case 'components.somatic':
                return 'Gestikular';
            case 'components.material':
                return 'Material';
        }
        return `${key.toString()}`;
    }

    keys(): (NestedKeyOf<ISpell>)[] {
        return [
            '_id',
            'name.german',
            'name.english',
            'source_book',
            'level',
            'classes',
            'school',
            'ritual',
            'time_consumption',
            // 'time_consumption_extra',
            'range',
            'target',
            'components',
            'duration',
            'duration.concentration',
            'duration.additional',
            'attributes',
            'description',
            'higher_levels',
        ];
    }

    bottombarData(): BottombarComponent[] {
        return [
            Bottombar.button('Bearbeiten', () => {
                this.requestEditEvent.invoke();
            }),
            Bottombar.button('Neu', () => {
                this.requestNewEvent.invoke();
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

    validate_and_save(object: ISpell, selectedObject: ISpell | undefined): Promise<void> {
        return new Promise<void>((resolve) => {
            this.check_input(object).then(() => {
                if (selectedObject === undefined) {
                    ipcRequest<DialogChannel>(Channels.Dialog, {
                        type: 'question',
                        buttons: ['Ja', 'Nein'],
                        message: 'Sicher, dass du Speichern willst?',
                        title: 'Speichern',
                    }).then(result => {
                        if (result.selected_index === 0) {
                            fetch(SPELL_URLS.ADD, DEFAULT_POST_OPTIONS(this.to_html_body(object)))
                                .then(res => res.json())
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => console.error(err));
                        }
                    });
                } else {
                    // console.log(object);
                    ipcRequest<DialogChannel>(Channels.Dialog, {
                        type: 'question',
                        buttons: ['Ja', 'Nein'],
                        message: 'Sicher, dass du die Änderungen speichern willst?',
                        title: 'Änderungen Speichern',
                    }).then(result => {
                        if (result.selected_index === 0) {
                            fetch(SPELL_URLS.EDIT.replace(':id', selectedObject._id as string), DEFAULT_POST_OPTIONS(this.to_html_body(object)))
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
        const result: ISpell = {
            level: 0,
            source_book: SourceBooksSpell[0],
            name: {
                german: '',
                english: '',
            },
            classes: [],
            school: 'abjuration',
            ritual: false,
            time_consumption: {
                value: 0,
                format: 'action',
            },
            range: {
                value: 0,
                format: 'self',
            },
            target: '',
            components: {
                verbal: false,
                somatic: false,
                material: '',
            },
            attributes: 'spell',
            duration: {
                concentration: false,
                value: 0,
                format: 'instantaneous',
                additional: '',
            },
            description: '',
            higher_levels: '',
        };
        // console.log(result);
        return result;
    }

    to_html_body(item: ISpell): string {
        return JSON.stringify(convertSpell(item));
    }

    keys(): EditModelKeys<ISpell>[] {
        return [
            {
                type: EditType.Textfield,
                binding: 'name.german',
            },
            {
                type: EditType.Textfield,
                binding: 'name.english',
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
                binding: 'time_consumption.value',
                data: [0],
            },
            {
                type: EditType.Combobox,
                binding: 'time_consumption.format',
                data: Object.keys(SpellConstants.time_units),
            },
            // {
            //     type: EditType.Textfield,
            //     binding: 'time_consumption_extra',
            // },
            {
                type: EditType.Space,
            },

            {
                type: EditType.Numberfield,
                binding: 'range.value',
                data: [0],
            },
            {
                type: EditType.Combobox,
                binding: 'range.format',
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
                binding: 'components.verbal',
            },
            {
                type: EditType.Checkbox,
                binding: 'components.somatic',
            },
            {
                type: EditType.Textfield,
                binding: 'components.material',
            },
            {
                type: EditType.Space,
            },

            {
                type: EditType.Numberfield,
                binding: 'duration.value',
                data: [0],
            },
            {
                type: EditType.Combobox,
                binding: 'duration.format',
                data: Object.keys(SpellConstants.duration_units),
            },
            {
                type: EditType.Checkbox,
                binding: 'duration.concentration',
            },
            {
                type: EditType.Textfield,
                binding: 'duration.additional',
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

    binding_key_value(binding: NestedKeyOf<ISpell>, key: string): string {
        if (binding === 'school') {
            return SpellConstants.schools[key as School];
        }
        if (binding === 'classes') {
            return SpellConstants.classes[key as SpellClass];
        }
        if (binding === 'time_consumption.format') {
            return SpellConstants.time_units[key as TimeUnit];
        }
        if (binding === 'range.format') {
            return SpellConstants.range_units[key as RangeUnit];
        }
        if (binding === 'attributes') {
            return SpellConstants.attributes[key as Attribute];
        }
        if (binding === 'duration.format') {
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

            if (item.name.german?.empty()) {
                msg = 'Kein Deutscher name angegeben!';
            } else if (item.name.english?.empty()) {
                msg = 'Kein Englischer name angegeben!';
            } else if (item.level < 0) {
                msg = 'Das Level darf nicht unter 0 sein!';
            }

            if (msg.empty()) {
                resolve();
                return;
            }

            ipcRequest<DialogChannel>(Channels.Dialog, {
                type: 'question',
                buttons: ['Ok'],
                title: 'Achtung!',
                message: msg,
            }).catch();
        });
    }
}

type Sorting = {
    binding: NestedKeyOf<ISpell>;
    dir: 'asc' | 'desc';
};

class SpellModel extends ListModel<ISpell> {
    private title_string = '';

    private sortings: Map<string, Sorting> = new Map<string, Sorting>([
        ['level_asc', { binding: 'level', dir: 'asc' }],
        ['level_desc', { binding: 'level', dir: 'desc' }],
        ['name_asc', { binding: 'name.german', dir: 'asc' }],
        ['name_desc', { binding: 'name.german', dir: 'desc' }],
    ]);

    private sorting: Sorting | undefined = this.sortings.get('level_asc');

    listPreview: ListPreview<ISpell>[] = [
        { display: 'Level', binding: 'level', sortable: true },
        { display: 'Name', binding: 'name.german', sortable: true },
        { display: 'Klassen', binding: 'classes' },
        { display: 'Quelle', binding: 'source_book' },
    ];

    summaryModel: SummaryModel<ISpell> = new SpellSummaryModel();
    editModel = new SpellEditModel();

    filterData: Map<NestedKeyOf<ISpell>, FilterType> = new Map<NestedKeyOf<ISpell>, FilterType>([
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

    textFromBingind(itemId: ItemId, binding: NestedKeyOf<ISpell>): string {
        const item = this.getItem(itemId);
        if (item === undefined) {
            return '';
        }
        return this.summaryModel.textFromValue(binding, item.data);
    }

    fetch_items(): void {
        let url: string;
        if (this.title_string.empty()) {
            url = SPELL_URLS.GET_ALL;
        } else {
            url = SPELL_URLS.GET_BY_NAME.replace(':name', this.title_string);
        }
        fetch(url, DEFAULT_GET_OPTIONS)
            .then(res => res.json())
            .then(res => {
                this.clear();
                for (const spell of res) {
                    this.add(convertSpell(spell as ISpell));
                }
            })
            .then(() => {
                this.requestChangeEvent.invoke();
            })
            .catch(err => console.error(err));
    }

    headerItemClicked(binding: NestedKeyOf<ISpell>): void {
        const curSorting = this.sorting;

        if (binding === 'level') {
            // sort by level
            if (curSorting === undefined || curSorting.binding !== 'level') {
                this.sorting = this.sortings.get('level_asc');
            } else {
                if (curSorting.dir === 'asc') {
                    this.sorting = this.sortings.get('level_desc');
                } else {
                    this.sorting = this.sortings.get('level_asc');
                }
            }
        } else if (binding === 'name.german') {
            // sort by name
            if (curSorting === undefined || curSorting.binding !== 'name.german') {
                this.sorting = this.sortings.get('name_asc');
            } else {
                if (curSorting.dir === 'asc') {
                    this.sorting = this.sortings.get('name_desc');
                } else {
                    this.sorting = this.sortings.get('name_asc');
                }
            }
        }

        this.requestChangeEvent.invoke();
    }

    protected sortedFilteredItems(): ItemId[] {
        if (!this.sorting) {
            return Array.from(this.Items.keys());
        }

        // 1. Filter;
        const filtered: ItemId[] = Array.from(this.Items.keys()).filter(id => {
            const item = this.getItem(id)?.data;
            if (item === undefined) {
                return false;
            }

            let includes = true;

            for (const [binding, { data }] of Array.from(this.filterData.entries())) {
                if (Array.isArray(getNested(item, binding))) {
                    includes = includes && data.some(t => {
                        if ((getNested(item, binding) as any[]).length === 0) {
                            return true;
                        }
                        return (getNested(item, binding) as any[]).includes(t);
                    });
                } else {
                    includes = includes && data.includes(getNested(item, binding));
                }
            }

            return includes;
        });

        // 2. Sort;
        const sorted: ItemId[] = filtered.sort((a, b) => {
            const itemA = this.getItem(a)?.data;
            const itemB = this.getItem(b)?.data;

            if (itemA === undefined || itemB === undefined) {
                return 0;
            }

            if (this.sorting?.binding === 'level') {
                if (this.sorting.dir === 'asc') {
                    return itemA.level - itemB.level;
                } else {
                    return itemB.level - itemA.level;
                }
            } else if (this.sorting?.binding === 'name.german') {
                if (this.sorting.dir === 'asc') {
                    return itemA.name.german?.localeCompare(itemB.name.german ?? '') ?? 0;
                } else {
                    return itemB.name.german?.localeCompare(itemA.name.german ?? '') ?? 0;
                }
            }

            return 0;
        });

        return sorted;
    }

    bottombarData(): BottombarComponent[] {
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
                this.triggerFilterEvent.invoke();
            }),
        ];
    }
}

export { SpellModel, SpellSummaryModel };
