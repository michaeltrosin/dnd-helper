import {Settings, SettingsProfile} from '@/electron/files/settings_file';
import {Channels} from '@/shared/channels';
import {AbstractIpcChannel} from '@/shared/ipc';

enum Method {
    Get,
    Set,
    GetSelected,
    SetSelected
}

type TArgsGet = {
    method: Method.Get;
};
type TArgsSet = {
    method: Method.Set;
    values: Partial<SettingsProfile>;
};
type TArgsGetSelected = {
    method: Method.GetSelected,
};
type TArgsSetSelected = {
    method: Method.SetSelected,
    name: string;
};

type TArgs = TArgsGet | TArgsSet | TArgsGetSelected | TArgsSetSelected;

type TPayloadGet = {
    selected: string;
    profiles: Readonly<SettingsProfile>[];
};

class SettingsChannel extends AbstractIpcChannel<TArgs, TPayloadGet> {
    constructor(private settings: Settings) {
        super();
    }

    get name(): string {
        return Channels.Settings;
    }

    handle(win: Electron.BrowserWindow, event: Electron.IpcMainEvent, args: TArgs): void {
        if (args.method === Method.Get) {
            this.resolve(event, {
                profiles: this.settings.get('profiles'),
                selected: this.settings.get('selected'),
            });
        } else if (args.method === Method.Set) {
            const profile = this.settings.get('profiles').find(a => {
                return a.name === args.values.name;
            });

            console.log('Profiles', this.settings.get('profiles'));

            if (profile === undefined) {
                this.reject(event, 'Profile not found');
                return;
            }

            const name = profile.name;

            for (const key of Object.keys(args.values)) {
                if (args.values[key] !== undefined) {
                    profile[key] = args.values[key];
                }
            }
            profile.name = name;

            this.settings.set_profile(profile);
            this.settings.save();
            this.resolve(event, {
                profiles: [profile],
                selected: this.settings.get('selected'),
            });
        } else if (args.method === Method.GetSelected) {
            const selected = this.settings.get('selected');
            const profile = this.settings.get('profiles').find(a => {
                return a.name === selected;
            });

            if (!profile) {
                this.reject(event, `Profile ${selected} not found`);
                return;
            }

            this.resolve(event, {
                selected,
                profiles: [profile],
            });
        } else if (args.method === Method.SetSelected) {
            const profile = this.settings.get('profiles').find(a => {
                return a.name === args.name;
            });

            if (!profile) {
                this.reject(event, `Profile ${args.name} not found`);
                return;
            }

            this.settings.set('selected', args.name);
            this.settings.save();
            this.resolve(event, {
                selected: args.name,
                profiles: this.settings.get('profiles'),
            });
        } else {
            this.reject(event);
        }
    }
}

export {SettingsChannel, Method as SettingsRequestMethod};
