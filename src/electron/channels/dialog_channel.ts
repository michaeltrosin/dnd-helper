import {AbstractIpcChannel} from '@/shared/ipc';
import {Channels} from '@/shared/channels';
import {dialog} from 'electron';

type TArgs = {
    buttons: string[],
    message: string,
    title: string,
    type: 'question'
};

type TPayload = {
    selected_index: number;
};

export class DialogChannel extends AbstractIpcChannel<TArgs, TPayload> {
    get name(): string {
        return Channels.Dialog;
    }

    handle(win: Electron.BrowserWindow, event: Electron.IpcMainEvent, payload: TArgs): void {
        dialog.showMessageBox(win, {
            title: payload.title,
            message: payload.message,
            type: payload.type,
            buttons: payload.buttons
        }).then(result => {
            this.resolve(event, {
                selected_index: result.response
            });
        });
    }
}
