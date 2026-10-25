import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'



// Put user code here //
// ============================================================
// CORE / APP CONFIG
// ============================================================

game.var.MIN_LOADING_TIME = 2700;
game.var.suikaScaleMultiplier = 0.80;

// Per-tier size factor on top of suikaScale (which only evens out image sizes).
// The art came with a flat curve (tier 11 only ~2.5x tier 1), so random drops
// merged all the way to the final object. A steeper curve (~4x) makes big objects
// claim real space. Tuned with scripts/balance.js.
game.var.suikaTierScale = [0.81, 0.80, 0.90, 0.91, 0.97, 0.94, 1.00, 1.08, 1.12, 1.14, 1.24];

game.var.CONFIG = {
    ASSET_MODE: "PRELOAD_ALL", // PRELOAD_ALL | PER_SCENE
    START_SCENE: "Main",
    DEFAULT_LEVEL: "KEBUN",
    FADE_TIME: 1000,

    INPUT_DEVICE: "AUTO", // AUTO | MOBILE | DESKTOP

    PRELOAD_ASSETS: [
        "LoadingAsset",
        "Level_Home",
        "image",
        "Level_Gameplay",
        "ResultUI",
        "SettingsUI",
        "Kebun",
        "Pasar",
        "Warung",
        "Pantai",
        "Hutan",
        "Desa",
        "Misteri",
    ],

    SCENES: {
        Main: {
            load: ["Level_Home"],
            unload: ["Level_Home"]
        },

        Maps: {
            load: ["image"],
            unload: ["image"]
        },

        Gameplay: {
            load: ["Level_Gameplay", "ResultUI", "$LEVEL"],
            unload: ["Level_Gameplay", "ResultUI", "$LEVEL"]
        }
    }
};


// ============================================================
// MAP / LEVEL DATA
// ============================================================

game.var.levelMap = {
    KEBUN: "Kebun",
    PASAR: "Pasar",
    WARUNG: "Warung",
    PANTAI: "Pantai",
    HUTAN: "Hutan",
    DESA: "Desa",
    MISTERI: "Misteri",
};

game.var.suikaLevels = {
    KEBUN: [
        "Cherry",
        "Strawberry",
        "Orange",
        "Apple",
        "Mango",
        "Pear",
        "Pineapple",
        "Coconut",
        "Melon",
        "Watermelon",
        "Durian"
    ],

    PASAR: [
        "Klepon",
        "OndeOnde",
        "KueLumpur",
        "DadarGulung",
        "KueCucur",
        "Getuk",
        "Serabi",
        "Lemper",
        "PutuAyu",
        "Martabak",
        "Tumpeng"
    ],

    WARUNG: [
        "Permen",
        "Telur",
        "Gorengan",
        "MieInstan",
        "EsKopi",
        "NasiBungkus",
        "Soto",
        "Bakso",
        "AyamGoreng",
        "NasiGoreng",
        "Gerobak"
    ],

    PANTAI: [
        "Kerang",
        "BintangLaut",
        "Kepiting",
        "IkanBadut",
        "IkanBuntal",
        "Gurita",
        "Penyu",
        "Pari",
        "LumbaLumba",
        "Hiu",
        "Paus"
    ],

    HUTAN: [
        "Kumbang",
        "Katak",
        "Tokek",
        "Tupai",
        "Rangkong",
        "Kancil",
        "Monyet",
        "Orangutan",
        "BlackPanther",
        "Harimau",
        "Gajah"
    ],

    DESA: [
        "SandalJepit",
        "Layangan",
        "Bola",
        "Ember",
        "Radio",
        "KipasAngin",
        "KursiPlastik",
        "Sepeda",
        "Motor",
        "GerobakDesa",
        "Angkot"
    ],

    MISTERI: [
        "KunangKunang",
        "Lilin",
        "Jimat",
        "Lentera",
        "BonekaMisterius",
        "TopengMisterius",
        "Tuyul",
        "Pocong",
        "Kuntilanak",
        "Genderuwo",
        "PohonBeringin"
    ]
};


// ============================================================
// MAP VISUAL DATA
// ============================================================

game.var.suikaScale = {
    KEBUN: [
        0.536, // 0
        0.493, // 1
        0.541, // 2
        0.498, // 3
        0.513, // 4
        0.642, // 5
        0.691, // 6
        0.714, // 7
        0.779, // 8
        0.762, // 9
        0.503  // 10
    ],

    PASAR: [
        0.459,
        0.437,
        0.432,
        0.383,
        0.433,
        0.489,
        0.464,
        0.611,
        0.661,
        0.474,
        0.463
    ],

    WARUNG: [
        0.300,
        0.375,
        0.358,
        0.372,
        0.417,
        0.477,
        0.466,
        0.508,
        0.643,
        0.476,
        0.577
    ],

    PANTAI: [
        0.395,
        0.355,
        0.416,
        0.445,
        0.451,
        0.490,
        0.463,
        0.461,
        0.589,
        0.404,
        0.340
    ],

    HUTAN: [
        0.357,
        0.455,
        0.373,
        0.427,
        0.438,
        0.495,
        0.596,
        0.654,
        0.637,
        0.765,
        0.514
    ],

    DESA: [
        0.346,
        0.442,
        0.498,
        0.548,
        0.505,
        0.694,
        0.541,
        0.435,
        0.556,
        0.514,
        0.506
    ],

    MISTERI: [
        0.369,
        0.358,
        0.412,
        0.417,
        0.481,
        0.520,
        0.630,
        0.680,
        0.596,
        0.687,
        0.424
    ]
};

game.var.suikaTints = {
    KEBUN: [
        "#E94357",
        "#F04D5D",
        "#F59A32",
        "#E94B3C",
        "#FFC94D",
        "#A9D66E",
        "#F4C542",
        "#A8754F",
        "#A9D86E",
        "#55B967",
        "#D5B94C"
    ],

    PASAR: [
        "#65B96E",
        "#D9A95B",
        "#E5B45E",
        "#65B878",
        "#C97845",
        "#C99A69",
        "#8FCB73",
        "#78B86A",
        "#76C883",
        "#D89B55",
        "#E5B84D"
    ],

    WARUNG: [
        "#F25F5C", // Permen
        "#EFC9A4", // Telur
        "#E7A43B", // Gorengan
        "#F2B13F", // MieInstan
        "#A96F45", // EsKopi
        "#5A9F57", // NasiBungkus
        "#DDA84A", // Soto
        "#B89A7E", // Bakso
        "#D98A3B", // AyamGoreng
        "#C97A3D", // NasiGoreng
        "#B8753C"  // Gerobak
    ],

    PANTAI: [
        "#F3D5B5", // Kerang
        "#F36D5F", // BintangLaut
        "#E95E44", // Kepiting
        "#F28B35", // IkanBadut
        "#F3D55B", // IkanBuntal
        "#F07B8C", // Gurita
        "#76B85D", // Penyu
        "#4E8FCB", // Pari
        "#4FA8D8", // LumbaLumba
        "#58789B", // Hiu
        "#3F8AC4"  // Paus
    ],

    HUTAN: [
        "#70411F", // Kumbang
        "#76C94D", // Katak
        "#C99565", // Tokek
        "#B86E32", // Tupai
        "#D8902F", // Rangkong
        "#B87943", // Kancil
        "#9C6A45", // Monyet
        "#D4662D", // Orangutan
        "#343444", // BlackPanther
        "#E58A2E", // Harimau
        "#8E9298"  // Gajah
    ],

    DESA: [
        "#4E8BCB", // SandalJepit
        "#E86C52", // Layangan
        "#D9D9D9", // Bola
        "#347CC5", // Ember
        "#C85545", // Radio
        "#5DA1CF", // KipasAngin
        "#D94D43", // KursiPlastik
        "#3E86C2", // Sepeda
        "#D94D3E", // Motor
        "#A86F38", // GerobakDesa
        "#2E8CC9"  // Angkot
    ],

    MISTERI: [
        "#F1D94E", // KunangKunang
        "#F2C56B", // Lilin
        "#B98545", // Jimat
        "#D99A45", // Lentera
        "#A8795E", // BonekaMisterius
        "#D35E4E", // TopengMisterius
        "#9C8FAF", // Tuyul
        "#D8D8DF", // Pocong
        "#C7B8D4", // Kuntilanak
        "#5D4A4C", // Genderuwo
        "#5C7F45"  // PohonBeringin
    ]
};

game.var.suikaPreviewImages = {

    KEBUN: {
        Cherry: "cherry",
        Strawberry: "strawberry",
        Orange: "orange",
        Apple: "apple",
        Mango: "mango",
        Pear: "pear",
        Pineapple: "pineapple",
        Coconut: "coconut",
        Melon: "melon",
        Watermelon: "watermelon",
        Durian: "durian"
    },

    PASAR: {
        Klepon: "klepon",
        OndeOnde: "onde-onde",
        KueLumpur: "Kue Lumpur",
        DadarGulung: "Dadar Gulung",
        KueCucur: "Kue Cucur",
        Getuk: "Getuk",
        Serabi: "Serabi",
        Lemper: "Lemper",
        PutuAyu: "Putu Ayu",
        Martabak: "Martabak Manis",
        Tumpeng: "Tumpeng"
    },

    WARUNG: {
        Permen: "permen",
        Telur: "telur",
        Gorengan: "gorengan",
        MieInstan: "mie",
        EsKopi: "kopi",
        NasiBungkus: "nasi bungkus",
        Soto: "soto",
        Bakso: "bakso",
        AyamGoreng: "ayam goreng",
        NasiGoreng: "Nasi Goreng",
        Gerobak: "gerobakMie"
    },

    PANTAI: {
        Kerang: "Kerang",
        BintangLaut: "Bintang Laut",
        Kepiting: "Kepiting",
        IkanBadut: "Ikan Badut",
        IkanBuntal: "Ikan Buntal",
        Gurita: "Gurita",
        Penyu: "Penyu",
        Pari: "Pari",
        LumbaLumba: "Lumba-lumba",
        Hiu: "Hiu",
        Paus: "Paus"
    },

    HUTAN: {
        Kumbang: "Kumbang",
        Katak: "Katak",
        Tokek: "Tokek",
        Tupai: "Tupai",
        Rangkong: "Rangkong",
        Kancil: "kancil",
        Monyet: "monyet",
        Orangutan: "orangutan",
        BlackPanther: "panther",
        Harimau: "Harimau",
        Gajah: "gajah"
    },

    DESA: {
        SandalJepit: "Sandal Jepit",
        Layangan: "Layangan",
        Bola: "bola",
        Ember: "ember",
        Radio: "radio",
        KipasAngin: "Kipas Angin",
        KursiPlastik: "kursi",
        Sepeda: "sepeda",
        Motor: "motor",
        GerobakDesa: "gerobak2",
        Angkot: "angkot"
    },

    MISTERI: {
        KunangKunang: "Kunang-kunang",
        Lilin: "Lilin",
        Jimat: "Jimat",
        Lentera: "Lentera Tua",
        BonekaMisterius: "Boneka Misterius",
        TopengMisterius: "Topeng Misterius",
        Tuyul: "Tuyul",
        Pocong: "pocong",
        Kuntilanak: "kunti",
        Genderuwo: "Genderuwo",
        PohonBeringin: "Pohon Beringin"
    }

};

game.var.blowerTints = {
    KEBUN: "#B4F0A3",
    PASAR: "#FFD18A",
    WARUNG: "#F3B17D",
    PANTAI: "#8DDBF2",
    HUTAN: "#A0D497",
    DESA: "#9DD2F0",
    MISTERI: "#86BFD0"
};


// ============================================================
// GAMEPLAY CONFIG
// ============================================================

game.var.spawnTime = 100;
game.var.evoMaxWidth = 30;
game.var.evoMaxHeight = 30;

game.var.suikaMerge = {
    // diam dulu setelah collision
    mergeDelay: 0,

    // baru mulai disedot
    duration: 210,

    pullStrength: 0.24,
    maxSpeed: 18,
    finishDistance: 7,

    swirlStrength: 2.8,

    // tahan sedikit sebelum evolve
    compressDuration: 65,

    absorbedScale: 0.64,
    absorbedAlpha: 0.55,

    anchorPulse: 0.075,

    // evolusi agak lembut
    popStartScale: 0.72,
    popDuration: 260
};

game.var.suikaCombo = {
    continueWindow: 1500,
    baseSoundCount: 8,
    volume: 0.9,

    maxRate: 2.0
};


// ============================================================
// GAMEPLAY RUNTIME STATE
// ============================================================

// Disiapkan untuk UI nanti
game.var.comboCount = 0;
game.var.comboLastAt = 0;


// ============================================================
// AUDIO STATE
// ============================================================

game.var.blowerSound = {
    id: null,
    playing: false,
    fadingOut: false,
    fadeDuration: 1000
};

game.var.currentBGM = {
    name: null,
    id: null,
    playing: false,
    fadingOut: false,
    fadeDuration: 800
};


// ============================================================
// ACHIEVEMENTS
// Depends on game.var.suikaLevels, so keep this after level data.
// ============================================================

// Display names (Bahasa Indonesia) for every object key used in suikaLevels.
// Keys without an entry are split on capitals ("KueLumpur" -> "Kue Lumpur").
game.var.objectNames = {
    Cherry: "Ceri",
    Strawberry: "Stroberi",
    Orange: "Jeruk",
    Apple: "Apel",
    Mango: "Mangga",
    Pear: "Pir",
    Pineapple: "Nanas",
    Coconut: "Kelapa",
    Watermelon: "Semangka",
    OndeOnde: "Onde-onde",
    Martabak: "Martabak Manis",
    MieInstan: "Mie Instan",
    Gerobak: "Gerobak Mie",
    LumbaLumba: "Lumba-lumba",
    BlackPanther: "Macan Kumbang",
    GerobakDesa: "Gerobak",
    KunangKunang: "Kunang-kunang",
    Lentera: "Lentera Tua"
};

game.var.objectName = function(key) {
    return game.var.objectNames[key] ||
        String(key).replace(/([a-z])([A-Z])/g, "$1 $2");
};

game.var.worldNames = {
    KEBUN: "Kebun",
    PASAR: "Pasar",
    WARUNG: "Warung",
    PANTAI: "Pantai",
    HUTAN: "Hutan",
    DESA: "Desa",
    MISTERI: "Misteri"
};

game.var.ACHIEVEMENTS = [
    {
        id: "first_merge",
        title: "Gabungan Pertama",
        description: "Gabungkan dua benda yang sama.",
        type: "mergeCount",
        target: 1,
        rewardCoin: 10
    },

    {
        id: "merge_100",
        title: "Tukang Tumpuk",
        description: "Gabungkan 100 kali.",
        type: "mergeCount",
        target: 100,
        rewardCoin: 50
    },

    {
        id: "combo_5",
        title: "Combo Mantap",
        description: "Capai combo x5.",
        type: "combo",
        target: 5,
        rewardCoin: 25
    },

    {
        id: "combo_10",
        title: "Raja Combo",
        description: "Capai combo x10.",
        type: "combo",
        target: 10,
        rewardCoin: 50
    },

    {
        id: "combo_20",
        title: "Combo Gila",
        description: "Capai combo x20.",
        type: "combo",
        target: 20,
        rewardCoin: 100
    },

    {
        id: "score_10000",
        title: "Mulai Serius",
        description: "Dapat 10.000 skor dalam satu permainan.",
        type: "score",
        target: 10000,
        rewardCoin: 50
    },

    {
        id: "score_50000",
        title: "Skor Raksasa",
        description: "Dapat 50.000 skor dalam satu permainan.",
        type: "score",
        target: 50000,
        rewardCoin: 150
    },

    {
        id: "first_final_object",
        title: "Evolusi Lengkap",
        description: "Buat benda terakhir di dunia mana pun.",
        type: "objectLevel",
        target: 11,
        rewardCoin: 100
    },

    {
        id: "play_all_maps",
        title: "Penjelajah",
        description: "Main di semua dunia.",
        type: "mapsPlayed",
        target: Object.keys(game.var.suikaLevels).length,
        rewardCoin: 100
    },

    /*
     * Otomatis bikin achievement
     * untuk final object setiap map.
     */
    ...Object.keys(game.var.suikaLevels).map(level => {
        const objects = game.var.suikaLevels[level];
        const finalObject = objects[objects.length - 1];

        return {
            id: `final_${level.toLowerCase()}`,
            title: `Juara ${game.var.worldNames[level] || level}`,
            description: `Buat ${game.var.objectName(finalObject)}.`,
            type: "objectLevel",
            level,
            target: objects.length,
            rewardCoin: 100
        };
    }),

    {
        id: "master_all_maps",
        title: "Juara Nusantara",
        description: "Buat benda terakhir di semua dunia.",
        type: "finalMaps",
        objectLevel: 11,
        target: Object.keys(game.var.suikaLevels).length,
        rewardCoin: 500
    },

    {
        id: "games_10",
        title: "Pantang Menyerah",
        description: "Selesaikan 10 permainan.",
        type: "gamesPlayed",
        target: 10,
        rewardCoin: 50
    }
];
//  End of user code  //


/* The code below will be executed when the script is imported into a component or another script. */
export default () => {
    // Put user code here //
    
    //  End of user code  //
}
