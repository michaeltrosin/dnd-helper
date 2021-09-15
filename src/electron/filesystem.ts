import {app} from 'electron';
import * as fs from 'fs';
import * as Path from 'path';

class Filesystem {
    static Appdata: string = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');

    static RootFolder: string = Path.join(Filesystem.Appdata, app.getName(), '/data');
    static StoreFolder: string = Path.join(Filesystem.RootFolder, '/store');

    static creat_if_non_exist(path: string): void {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    static initialize(): void {
        Filesystem.creat_if_non_exist(Filesystem.RootFolder);
        console.log('Rootfolder: ', Filesystem.RootFolder);
        Filesystem.creat_if_non_exist(Filesystem.StoreFolder);
    }
}

export {Filesystem};
