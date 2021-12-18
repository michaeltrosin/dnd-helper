import { SettingsChannel, SettingsRequestMethod } from '@/electron/channels/settings_channel';
import { SettingsProfileType } from '@/electron/files/settings_file';
import { Bottombar, BottombarComponent } from '@/react/components/bottombar/bottombar';
import { Edit, EditModel, EditType } from '@/react/components/listview/model/edit_model';
import { ItemId, ListModel, ListPreview } from '@/react/components/listview/model/listview_model';
import { SummaryModel } from '@/react/components/listview/model/preview_model';
import { Channels } from '@/shared/channels';
import { Theme, ThemeColors } from '@/shared/colors';
import { ipcRequest } from '@/shared/ipc';
import '@/utils/extensions';
import { getNested, NestedKeyOf } from '@/utils/generics';

type SettingsModelType = SettingsProfileType;

class SettingsEditModel extends EditModel<SettingsModelType> {
    binding_key_value(binding: NestedKeyOf<SettingsModelType>, key: string): string {
        if (binding === 'theme') {
            return key;
        }
        return '';
    }

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

    validate_and_save(object: SettingsModelType, selectedObject: SettingsModelType | undefined): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ipcRequest<SettingsChannel>(Channels.Settings, {
                method: SettingsRequestMethod.Set,
                values: {
                    name: object.name,
                    theme: object.theme,
                    edit: object.edit,
                },
            }).then(result => {
                resolve();
            }).catch(err => reject(err));
        });
    }

    check_input(item: SettingsModelType): Promise<void> {
        return Promise.resolve(undefined);
    }

    keys(): Edit<SettingsModelType>[] {
        return [
            // {
            //     type: EditType.Textfield,
            //     binding: 'name',
            // },
            {
                type: EditType.Combobox,
                binding: 'theme',
                data: Object.keys(ThemeColors),
            },
        ];
    }

    new(old: SettingsModelType | undefined): SettingsModelType {
        if (old !== undefined) {
            return {
                name: old.name,
                theme: old.theme,
                edit: old.edit,
            };
        }
        return {
            name: 'Unnamed',
            theme: 'wet_asphalt',
            edit: false,
        };
    }

    to_html_body(item: SettingsModelType): string {
        return '';
    }
}

class SettingsSummaryModel extends SummaryModel<SettingsModelType> {
    bottombarData(): BottombarComponent[] {
        return [
            Bottombar.button('Bearbeiten', () => {
                this.requestEditEvent.invoke();
            }),
        ];
    }

    keys(): (NestedKeyOf<SettingsModelType>)[] {
        return [
            'name',
            'theme',
        ];
    }

    textFromKey(key: NestedKeyOf<SettingsModelType>): string {
        switch (key) {
            case 'name':
                return 'Name';
            case 'theme':
                return 'Theme';
            case 'edit':
                return 'Bearbeitungs modus';
        }
    }

    textFromValue(key: NestedKeyOf<SettingsModelType>, item: SettingsModelType): string {
        if (item === undefined) {
            return '';
        }

        // const data = item[key];

        if (key === 'name') {
            return item.name;
        }

        if (key === 'theme') {
            return `${item.theme} [${ThemeColors[item.theme as Theme]}]`;
        }

        if (key === 'edit') {
            return item.edit ? 'Ja' : 'Nein';
        }

        return (getNested(item, key) ?? '-').toString();
    }
}

class SettingsModel extends ListModel<SettingsModelType> {
    listPreview: ListPreview<SettingsModelType>[] = [
        { display: 'Profil', binding: 'name' },
    ];

    editModel: EditModel<SettingsModelType> = new SettingsEditModel();
    summaryModel: SummaryModel<SettingsModelType> = new SettingsSummaryModel();

    private selected_profile: SettingsModelType | undefined = undefined;

    private get_index_of(name: string): number {
        for (const item of this.allItems()) {
            if (this.getItem(item)?.data.name === name) {
                return item;
            }
        }
        return -1;
    }

    refresh(): void {
        ipcRequest<SettingsChannel>(Channels.Settings, {
            method: SettingsRequestMethod.Get,
        }).then(payload => {
            this.clear();

            for (const profile of payload.profiles) {
                this.add({
                    name: profile.name,
                    theme: profile.theme,
                    edit: profile.edit,
                });
            }

            this.selected_profile = this.getItem(this.get_index_of(payload.selected))?.data;
        }).then(() => {
            this.requestChangeEvent.invoke();
        });
    }

    public get SelectedProfile(): SettingsModelType | undefined {
        return this.selected_profile;
    }

    bottombarData(): BottombarComponent[] {
        return [
            Bottombar.button('Profile laden', () => {
                console.log('Loading');
            }),
            Bottombar.button('Anwenden', () => {
                this.refresh();
                window.location.reload();
            }),
        ];
    }

    textFromBingind(itemId: ItemId, binding: NestedKeyOf<SettingsModelType>): string {
        const item = this.getItem(itemId);
        if (item === undefined) {
            return '';
        }
        return this.summaryModel.textFromValue(binding, item.data);
    }
}

export { SettingsModel, SettingsSummaryModel };
