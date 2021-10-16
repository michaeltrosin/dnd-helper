import {DialogChannel} from '@/electron/channels/dialog_channel';
import {DisplayInformationChannel} from '@/electron/channels/display_information_channel';
import {MessageQueueChannel} from '@/electron/channels/message_queue_channel';
import {SettingsChannel} from '@/electron/channels/settings_channel';
import {Settings} from '@/electron/files/settings_file';
import {Filesystem} from '@/electron/filesystem';
import {Updater} from '@/electron/updater';

import {AbstractIpcChannel} from '@/shared/ipc';
import {app, BrowserWindow, ipcMain} from 'electron';
import isDev from 'electron-is-dev';
import { Changelog } from '@/electron/changelog';

let win: BrowserWindow;
let settings: Settings;

function registerIpcChannels(ipcChannels: AbstractIpcChannel<any>[]): void {
    ipcChannels.forEach(channel => {
        ipcMain.on(channel.name, (event, args) => {
            channel.handle(win, event, args);
        });
    });
}

app.on('ready', () => {
    Filesystem.initialize();
    settings = new Settings().load();

    create_window();
    // if (settings.get('show_changelog')){
    //     Changelog.show_latest(win);
    // }

    win.on('close', () => {
        settings
            .set('width', win.getSize()[0])
            .set('height', win.getSize()[1])
            .set('maximized', win.isMaximized())
            .save();
    });

    if (!isDev) {
        Updater.begin_update_checking(win, settings);
    }
});

app.on('window-all-closed', () => {
    app.quit();
});

function create_window(): void {
    win = new BrowserWindow({
        width: settings.get('width'),
        height: settings.get('height'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        minHeight: 800,
        minWidth: 600,
        title: `DnD-Helper v${app.getVersion()}`,
        icon: ''
    });
    win.removeMenu();
    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : `file://${__dirname}/index.html`,
    ).then();
    if (settings.get('maximized')) {
        win.maximize();
    }

    if (isDev) {
        win.webContents.openDevTools();
    }

    registerIpcChannels([
        new DialogChannel(),
        new MessageQueueChannel(),
        new DisplayInformationChannel(),
        new SettingsChannel(settings)
    ]);
}
