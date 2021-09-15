import {FileStore} from '@/electron/files/file_store';
import {Theme} from '@/shared/colors';
import isDev from 'electron-is-dev';

type SettingsValues = {
    width: number;
    height: number;
    maximized: boolean;

    site: SiteSettings;
};

type SiteSettings = {
    [name: string]: any;
    theme: Theme;
    edit: boolean;
};

class Settings extends FileStore<SettingsValues> {
    constructor() {
        super('settings', {
            width: 1280,
            height: 720,
            maximized: false,

            site: {
                edit: isDev,
                theme: 'wet_asphalt'
            }
        });
    }
}

export {Settings, SettingsValues, SiteSettings};
