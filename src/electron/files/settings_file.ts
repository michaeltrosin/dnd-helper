import {FileStore} from '@/electron/files/file_store';
import {Theme} from '@/shared/colors';
import isDev from 'electron-is-dev';

type SettingsProfileType = {
    [name: string]: any;
    name: string;
    theme: Theme;
    edit: boolean;
};

type SettingsType = {
    width: number;
    height: number;
    maximized: boolean;
    show_changelog: boolean;

    selected: string;
    profiles: SettingsProfileType[];
};

class Settings extends FileStore<SettingsType> {
    constructor() {
        super('settings', {
            width: 1280,
            height: 720,
            maximized: false,

            show_changelog: true,

            selected: 'Default',

            profiles: [{
                name: 'Default',
                edit: isDev,
                theme: 'wet_asphalt',
            }],
        });
    }

    set_profile(profile: SettingsProfileType): void {
        const existing = this.data.profiles.findIndex(a => {
            return a.name === profile.name;
        });

        if (existing === -1) {
            return;
        }

        this.data.profiles = this.data.profiles.map((element, index) => {
            if (index === existing) {
                return profile;
            }
            return element;
        });
    }
}

export {Settings, SettingsType, SettingsProfileType};
