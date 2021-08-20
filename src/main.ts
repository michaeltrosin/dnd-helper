import {app, BrowserWindow, ipcMain} from 'electron';
import isDev from 'electron-is-dev';

import {AbstractIpcChannel} from '@/shared/ipc';
import {DialogChannel} from '@/electron/channels/dialog_channel';
import {MessageQueueChannel} from '@/electron/channels/message_queue_channel';
import {DisplayInformationChannel} from '@/electron/channels/display_information_channel';
import {Files} from '@/electron/filesystem';
import {updater} from '@/electron/updater';
import {Logger} from '@/electron/logger';

let win: BrowserWindow;
let messages: MessageQueueChannel;

const createWindow = (): void => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        minHeight: 800,
        minWidth: 600,
        title: `DnD-Helper v${app.getVersion()}`
    });
    win.removeMenu();
    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : `file://${__dirname}/index.html`,
    );

    if (isDev) {
        win.webContents.openDevTools();
    }

    registerIpcChannels([
        new DialogChannel(),
        messages = new MessageQueueChannel(),
        new DisplayInformationChannel()
    ]);
};

function registerIpcChannels(ipcChannels: AbstractIpcChannel<any>[]): void {
    ipcChannels.forEach(channel => {
        ipcMain.on(channel.name, (event, args) => {
            channel.handle(win, event, args);
        });
    });
}

app.on('ready', () => {
    console.log('Initializing files', Files.Appdata);
    Files.initialize();
    Logger.initialize();

    createWindow();

    if (!isDev) {
        updater.begin_update_checking(win);
    }
});

app.on('window-all-closed', () => {
    app.quit();
});
