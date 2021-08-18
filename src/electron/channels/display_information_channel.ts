import {AbstractIpcChannel} from '@/shared/ipc';
import {Channels} from '@/shared/channels';
import {app, dialog} from 'electron';
import isDev from 'electron-is-dev';
import {multiline} from '@/utils';
import * as os from 'os';

export class DisplayInformationChannel extends AbstractIpcChannel<any> {
    get name(): string {
        return Channels.DisplayInformation;
    }

    handle(win: Electron.BrowserWindow, event: Electron.IpcMainEvent, args: any): void {
        const message = multiline(
            `Version ${app.getVersion()}`,
            `${isDev ? 'Entwicklungs' : 'Produktions'} Umgebung`,
            `${os.platform()} ${os.version()}`
        );
        dialog.showMessageBox(win, {
            title: 'About',
            message,
            detail: 'Made by Ra6nar0k21',
            type: 'info',
            buttons: ['Ok']
        }).then(() => {
            this.resolve(event, {});
        });
    }
}
