import {BrowserWindow, dialog} from 'electron';
import {autoUpdater} from 'electron-updater';

let re_ask = true;

class Updater {
    private constructor() {
    }

    static begin_update_checking(win: BrowserWindow): void {
        autoUpdater.on('error', (err) => {
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'error',
                message: 'Fehler: ' + err
            }).then();
        });

        autoUpdater.on('update-available', () => {
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'info',
                message: 'Update gefunden!',
                detail: 'Es wird jetzt heruntergeladen.',
                buttons: ['Ok']
            }).then();
        });

        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            re_ask = false;
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'info',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'Neue Version wurde heruntergeladen. Zum Installieren bitte neustarten.',
                buttons: ['Jetzt Neustarten', 'Später Neustarten']
            }).then(selected => {
                if (selected.response === 0) {
                    autoUpdater.quitAndInstall(false, true);
                }
            });
        });
        setInterval(() => {
            if (re_ask) {
                autoUpdater.checkForUpdates().then();
            }
        }, 60000);
        autoUpdater.checkForUpdates().then();
    }
}

export {Updater};
