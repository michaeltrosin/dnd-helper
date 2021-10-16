import { dialog } from 'electron';

class Changelog {
    private constructor() {
    }

    public static show_latest(browser: Electron.BrowserWindow): void {
        dialog.showMessageBox(browser, {
            title: 'Changelog x.x.x',
            message: 'Changelog data',
        }).then();
    }
}

export {Changelog};
