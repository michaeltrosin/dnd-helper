import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { Settings } from '@/electron/files/settings_file';

let reAsk = true;

class Updater {
    private constructor() {
        //
    }

    static begin_update_checking(win: BrowserWindow, settings: Settings): void {
        autoUpdater.on('error', (err) => {
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'error',
                message: 'Fehler: ' + err,
            }).then();
        });

        autoUpdater.on('update-available', () => {
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'info',
                message: 'Update gefunden!',
                detail: 'Es wird jetzt heruntergeladen.',
                buttons: ['Ok'],
            }).then();
        });

        autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            reAsk = false;
            dialog.showMessageBox(win, {
                title: 'Update',
                type: 'info',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: 'Neue Version wurde heruntergeladen. Zum Installieren bitte das Programm neustarten.',
                buttons: ['Jetzt Neustarten', 'Später Neustarten'],
            }).then(selected => {
                settings.set('show_changelog', true).save();

                if (selected.response === 0) {
                    autoUpdater.quitAndInstall(false, true);
                }
            });
        });
        autoUpdater.checkForUpdates().then();
    }
}

export { Updater };
