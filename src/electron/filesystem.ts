import * as Path from 'path';
import * as fs from 'fs';
import {app} from 'electron';

class Filesystem {
    Appdata: string = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');

    RootFolder: string = Path.join(this.Appdata, app.getName(), '/data');

    initialize(): void {
        if (!fs.existsSync(this.RootFolder)) {
            fs.mkdirSync(this.RootFolder);
        }
    }
}

export const Files = new Filesystem();
