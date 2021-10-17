const BASE_URL = 'https://dnd.ra6.io';

const SPELLS_BASE = `${BASE_URL}/spells`;
const SPELL_URLS = {
    ADD: `${SPELLS_BASE}/add`,
    EDIT: `${SPELLS_BASE}/edit/:id`,
    GET_ALL: `${SPELLS_BASE}/get_all`,
    GET_BY_NAME: `${SPELLS_BASE}/search/:name`
};

const CHANGELOGS_BASE = `${BASE_URL}/changelogs`;
const CHANGELOGS_URLS = {
    SEARCH_BY_VERSION: `${CHANGELOGS_BASE}/search/:version`
};

const DEFAULT_GET_OPTIONS = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
};

const DEFAULT_POST_OPTIONS = (body: string): any => {
    return {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
    };
};

export {
    DEFAULT_GET_OPTIONS,
    DEFAULT_POST_OPTIONS,

    SPELL_URLS,
    CHANGELOGS_URLS
};
