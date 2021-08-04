import {BrowserWindow, dialog, ipcMain, MessageBoxOptions} from 'electron';
import {Messages} from "@/shared/ipc_messages";

export function register_messages(win: BrowserWindow) {
    ipcMain.handle(Messages.CONFIRM_DIALOG, (event, args: MessageBoxOptions) => {
        return dialog.showMessageBoxSync(win, args);
    });
}
