import { dialog } from 'electron';
import { CHANGELOGS_URLS } from '@/shared/urls';

class Changelog {
    private constructor() {
    }

    public static show_latest(browser: Electron.BrowserWindow): void {

        fetch(CHANGELOGS_URLS.LATEST, )

        dialog.showMessageBox(browser, {
            title: 'Changelog x.x.x',
            message: 'Changelog data',
        }).then();
    }
}

export {Changelog};
