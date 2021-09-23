import {FileStore} from '@/electron/files/file_store';
import {Theme} from '@/shared/colors';
import isDev from 'electron-is-dev';

type SettingsProfile = {
    [name: string]: any;
    name: string;
    theme: Theme;
    edit: boolean;
};

type SettingsValues = {
    width: number;
    height: number;
    maximized: boolean;

    selected: string;
    profiles: SettingsProfile[];
};

class Settings extends FileStore<SettingsValues> {
    constructor() {
        super('settings', {
            width: 1280,
            height: 720,
            maximized: false,

            selected: 'Default',

            profiles: [{
                name: 'Default',
                edit: isDev,
                theme: 'wet_asphalt',
            }],
        });
    }

    set_profile(profile: SettingsProfile): void {
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

export {Settings, SettingsValues, SettingsProfile};
