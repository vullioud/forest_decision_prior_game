// Species Data - Full species list from landscape

const SpeciesData = {
    // Full species list
    allSpecies: [
        "abal", "abam", "abba", "abgr", "abla", "abpr", "absa", "acca", "acja", "acma",
        "acmo", "acne", "acpa", "acpe", "acpl", "acps", "acru", "acsi", "acsa", "acuk",
        "algl", "alhi", "alin", "alma", "alru", "alvi", "beal", "beer", "weer", "bele",
        "bene", "bepa", "bepe", "bepl", "bepo", "bepu", "cano", "cabe", "caca", "caco",
        "carcor", "cagl", "caov", "casa", "chch", "coco", "conu", "coav", "fagr", "fasy",
        "fram", "frex", "frla", "frma", "frni", "frpe", "juai", "kase", "lade", "laka",
        "lala", "laly", "laoc", "lasi", "maak", "mahy", "mapr", "moau", "osvi", "pham",
        "piab_bor", "piab", "pien", "pigl_alaska", "pigl_pasture_ne_america",
        "pigl_ne_america", "pigl", "pije", "pima_alaska", "pima_ne_america", "piru",
        "pisi", "pial", "piba", "pice", "pico_high", "pico", "pimo", "pimu", "pini",
        "pipo", "pipu", "pire", "pist", "pisy_bor", "pisy", "poba", "pogr", "poni",
        "posi", "potr", "potr_alaska", "potr_ne_america", "potr_yellowstone", "poptri",
        "prem", "prpe", "prsa", "prse", "prss", "psme_gla", "psme_men", "psme", "qual",
        "qubi", "quco", "qude", "quma", "qumo", "qumont", "qupe", "qupu", "quro",
        "quru", "quru_b", "quve", "rops", "saba", "saca", "soal", "soar", "soau",
        "soco", "tabr", "tacu", "thoc", "thpl", "tiam", "tico", "tija", "tima", "tipl",
        "tsca", "tshe", "tsme", "ulam", "ulgl", "ulja", "ulla", "ulru"
    ],

    // Common groupings for quick selection
    groups: {
        broadleaved: ["acca", "acps", "acru", "algl", "beal", "bepe", "bepu", "cabe", "fasy", "fram", "frex", "qual", "qupe", "quro", "quru", "tilcor", "ulgl"],
        conifers: ["abba", "piab", "pisy", "lade", "pigl", "pice", "pima", "pire", "psme", "thpl", "tsca"],
        mixed: ["abba", "fasy", "piab", "acps", "frex", "quru", "bepe", "pisy"],
        pines: ["piab", "pisy", "pigl", "pice", "pico", "pimo", "pini", "pipo", "pire", "pist"],
        oaks: ["qual", "quco", "quma", "qumont", "qupe", "quro", "quru", "quru_b", "quve"],
        spruces: ["piab", "piab_bor", "pien", "pigl", "pigl_alaska", "pigl_ne_america", "pigl_pasture_ne_america"],
        firs: ["abba", "abgr", "abla", "abpr", "absa", "abam", "abal"],
        no_profile: [] // Empty = all species
    },

    // Get species array from profile name
    getSpeciesForProfile(profileName) {
        if (profileName === 'no_profile') {
            return this.allSpecies;
        }
        return this.groups[profileName] || this.allSpecies;
    },

    // Format species code to readable name (if needed)
    formatSpeciesName(code) {
        // For now, just return the code
        // Could add a mapping table if needed
        return code.toUpperCase();
    }
};
