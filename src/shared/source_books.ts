export const SourceBooks = {
    players_handbook: 'Spieler Handbuch',
    dungeon_masters_guide: 'Dungeon Master\'s Guide',
    monster_manual: 'Monster Handbuch',
    sword_coast_adventurers_guide: 'Abenteurerhandbuch für die Schwertküste',
    volos_guide_to_monsters: 'Volos Almanach der Monster',
    xanathars_guide_to_everything: 'Xanathars Ratgeber für alles',
    the_tortle_package: 'Das Tortel Paket',
    mordekaiens_tome_of_foes: 'Mordekains foliant der Feinde',
    wayfinders_guide_to_eberron: 'Wayfinders Eberon Ratgeber',
    guildmasters_guide_to_ravnica: 'Gildenmeisters Ravnica Ratgeber',
    acquisitions_incorporated: 'Acquisitions Inc.',
    eberron_rising_from_the_last_war: 'Eberron: Aufstieg des letzten Kriegs',
    sage_advice_companion: 'Weiser Ratgeber',
    mordekaiens_fiendish_folio_volume_one: 'Mordekaiens Feindüberblick Vol. 1',
    explorers_guide_to_wildemount: 'Abenteurerhandbuch zu Wildemount',
    mythic_odysseys_of_theros: 'Mythische Odyssee von Theros',
    tashas_cauldron_of_everything: 'Tashas Kessel für alles',
    van_richtens_guide_to_ravenloft: 'Van Richtens Ratgeber zu Ravenloft',
    curse_of_strahd: 'Fluch des Strahds',
    hoard_of_the_dragon_queen: 'Hort der Drachenkönigin',
    lost_mines_of_phandelver: 'Verlorene Minen von Phandelver',
    out_of_the_abyss: 'Aus dem Abyss',
    princes_of_the_apocalypse: 'Fürsten der Apokalypse',
    the_rise_of_tiamat: 'Aufstieg der Tiamat',
    stormkings_thunder: 'Sturmkönigs Donner',
    tales_from_the_yawning_portal: 'Geschichten aus dem klaffenden Portal',
    tomb_of_the_annihalation: 'Grabmal der Vernichtung',
    waterdeep_dragon_heist: 'Waterdeep: Drachenraub',
    waterdeep_dungeon_of_the_made_mage: 'Waterdeep: Verlies des wahnsinnigen Magiers',
    dragon_of_icespire_peak: 'Dragon of Icespire Peak',
    ghosts_of_saltmarsh: 'Geister von Salzmarsch',
    baldurs_gate_descent_into_avernus: 'Baldurs Gate: Abstieg nach Avernus',
    dungeons_and_dragons_vs_rick_and_morty: 'Dungeons & Dragons vs. Rick and Morty',
    locathah_rising: 'Aufstieg der Locathah',
    frozen_sick: 'Gefrierkrank',
    icewind_dale_rime_of_the_frostmaiden: 'Icewinddale: Raureif der Frostmaid',
    candlekeep_mysteries: 'Gehemnisse von Candlekeep',
    infernal_machine_rebuild: 'Wiederaufbau der höllischen Maschiene',
    lost_laboratory_of_kwalish: 'Verlorenes Labor von Kwalisch',
    one_grung_above: 'Ein grung drüber',

    fizbans_treasury_of_dragons: 'Fizbans Schatzkammer der Drachen',
    strixhaven_a_curriculum_of_chaos: 'Strixhaven: Ein Kurikulum von Chaos',
    the_wild_beyond_the_witchlight: 'Das wilde hinter dem Hexenlicht',
};

export type SourceBook = keyof(typeof SourceBooks);

/**
 * 4 Filter
 */
export const SourceBooksSpell: SourceBook[] = [
    'players_handbook',
    'xanathars_guide_to_everything',
    'tashas_cauldron_of_everything',
    'acquisitions_incorporated',
    'fizbans_treasury_of_dragons',
    'strixhaven_a_curriculum_of_chaos',
];
