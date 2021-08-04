import {app, BrowserWindow} from 'electron';
import isDev from 'electron-is-dev';

import {register_messages} from "@/electron/messages";

let win: BrowserWindow;

const createWindow = (): void => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    win.removeMenu();
    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : `file://${__dirname}/index.html`,
    );

    register_messages(win);
}

app.on('ready', createWindow);
