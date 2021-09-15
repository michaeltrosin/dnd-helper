import {Settings, SiteSettings} from '@/electron/files/settings_file';
import {Channels} from '@/shared/channels';
import {AbstractIpcChannel} from '@/shared/ipc';

enum Method {
    Get,
    Set
}

type TArgsGet = {
    method: Method.Get;
};
type TArgsSet = {
    method: Method.Set;
    values: Partial<SiteSettings>;
};

type TArgs = TArgsGet | TArgsSet;

type TPayloadGet = Readonly<SiteSettings>;

class SettingsChannel extends AbstractIpcChannel<TArgs, TPayloadGet> {
    constructor(private settings: Settings) {
        super();
    }

    get name(): string {
        return Channels.Settings;
    }

    handle(win: Electron.BrowserWindow, event: Electron.IpcMainEvent, args: TArgs): void {
        if (args.method === Method.Get) {
            this.resolve(event, this.settings.get('site'));
        } else if (args.method === Method.Set) {
            const site = this.settings.get('site');
            for (const key of Object.keys(args.values)) {
                if (args.values[key] !== undefined) {
                    site[key] = args.values[key];
                }
            }
            this.settings.set('site', site);
            this.resolve(event, site);
        }
        this.reject(event);
    }
}

export {SettingsChannel, Method as SettingsRequestMethod};
