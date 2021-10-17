import { app, dialog } from 'electron';
import { CHANGELOGS_URLS, DEFAULT_GET_OPTIONS } from '@/shared/urls';
import isDev from 'electron-is-dev';

class Changelog {
    private constructor() {
    }

    // TODO: Fetch cannot be found
    public static show_changelog(browser: Electron.BrowserWindow): void {
        fetch(CHANGELOGS_URLS.SEARCH_BY_VERSION.replace(':version', isDev ? 'dev' : app.getVersion()), DEFAULT_GET_OPTIONS)
            .then(res => res.json())
            .then(res => {
                dialog.showMessageBox(browser, {
                    title: 'Changelog version ' + res.version,
                    message: res.title,
                    detail: res.content
                }).then();
            }).catch(err => console.error(err));
    }
}

export { Changelog };
