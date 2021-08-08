import {autoUpdater} from 'electron-updater';
import {BrowserWindow, dialog} from 'electron';

let re_ask = true;

export const updater = {
    begin_update_checking(win: BrowserWindow): void {
        autoUpdater.on('error', (err) => {
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'error',
                message: 'Fehler: ' + err
            }).then(() => {
            });
        });

        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'info',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'Neue Version wurde heruntergeladen. Zum Installieren bitte neustarten.',
                buttons: ['Jetzt Neustarten', 'Später Neustarten']
            }).then(selected => {
                if (selected.response === 0) {
                    autoUpdater.quitAndInstall(false, true);
                } else {
                    re_ask = false;
                }
            });
        });
        setInterval(() => {
            if (re_ask) {
                autoUpdater.checkForUpdates();
            }
        }, 60000);
        autoUpdater.checkForUpdates();
    }
};
