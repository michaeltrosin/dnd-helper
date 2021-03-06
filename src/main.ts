import { Changelog } from '@/electron/changelog';
import { DialogChannel } from '@/electron/channels/dialog_channel';
import { DisplayInformationChannel } from '@/electron/channels/display_information_channel';
import { MessageQueueChannel } from '@/electron/channels/message_queue_channel';
import { SettingsChannel } from '@/electron/channels/settings_channel';
import { Settings } from '@/electron/files/settings_file';
import { Filesystem } from '@/electron/filesystem';
import { Updater } from '@/electron/updater';
import { AbstractIpcChannel } from '@/shared/ipc';
import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';

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

    createWindow();
    if (settings.get('latest_changelog') !== app.getVersion()) {
        settings.set('show_changelog', true);
    }
    if (settings.get('show_changelog')) {
        Changelog.show_changelog(win);
        settings
            .set('show_changelog', false)
            .set('latest_changelog', app.getVersion())
            .save();
    }

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

function createWindow(): void {
    win = new BrowserWindow({
        width: settings.get('width'),
        height: settings.get('height'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        minHeight: 800,
        minWidth: 600,
        title: `DnD-Helper v${app.getVersion()}`,
        icon: '',
    });
    win.removeMenu();
    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : path.join('file://', __dirname, 'index.html'),
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
        new SettingsChannel(settings),
    ]);
}
