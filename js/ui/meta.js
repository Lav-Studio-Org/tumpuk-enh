import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'

// Player progression and economy: coins, power-up stock, world unlocks.
// Everything persists through melon.storage (localStorage).

export const WORLD_ORDER = ["KEBUN", "PASAR", "WARUNG", "PANTAI", "HUTAN", "DESA", "MISTERI"];

export const WORLD_NAMES = {
    KEBUN: "Kebun",
    PASAR: "Pasar",
    WARUNG: "Warung",
    PANTAI: "Pantai",
    HUTAN: "Hutan",
    DESA: "Desa",
    MISTERI: "Misteri"
};

// Best score needed in the previous world to open this one, or the coin price
// to open it right away. Tuned with scripts/balance.js (bot score distribution):
// the first target sits near a casual player's 2nd-3rd game.
export const WORLD_UNLOCK = {
    PASAR: { score: 4000, coins: 300 },
    WARUNG: { score: 5000, coins: 400 },
    PANTAI: { score: 6000, coins: 500 },
    HUTAN: { score: 7000, coins: 600 },
    DESA: { score: 8000, coins: 700 },
    MISTERI: { score: 9000, coins: 800 }
};

export const SKILLS = {
    blower: {
        name: "Kipas",
        price: 60,
        art: "ui/skill-blower.webp",
        desc: "Tahan kipas 10 detik untuk menggoyang isi toples."
    },
    hammer: {
        name: "Palu",
        price: 40,
        art: "ui/skill-hammer.webp",
        desc: "Ketuk satu benda untuk menghancurkannya."
    },
    bomb: {
        name: "Bom",
        price: 80,
        art: "ui/skill-bomb.webp",
        desc: "Ketuk satu benda, semua di sekitarnya ikut meledak."
    }
};

// New players start with a few of each so they can learn what they do.
const STARTER_STOCK = 2;

function num(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

export const meta = {
    coins() {
        game.var.coinValue = num(game.var.coinValue ?? melon.storage.get("coinValue", 0));
        return game.var.coinValue;
    },

    addCoins(amount) {
        game.var.coinValue = this.coins() + Math.max(0, Math.floor(amount));
        melon.storage.set("coinValue", game.var.coinValue);
        game.var.coinObj?.setText?.(game.var.coinValue.toLocaleString("id-ID"));
        return game.var.coinValue;
    },

    spendCoins(amount) {
        if (this.coins() < amount) return false;
        game.var.coinValue -= amount;
        melon.storage.set("coinValue", game.var.coinValue);
        game.var.coinObj?.setText?.(game.var.coinValue.toLocaleString("id-ID"));
        return true;
    },

    skillCount(id) {
        return num(melon.storage.get(`skill_${id}`, STARTER_STOCK), STARTER_STOCK);
    },

    setSkillCount(id, count) {
        melon.storage.set(`skill_${id}`, Math.max(0, count));
    },

    addSkill(id, n = 1) {
        this.setSkillCount(id, this.skillCount(id) + n);
    },

    useSkill(id) {
        const count = this.skillCount(id);
        if (count <= 0) return false;
        this.setSkillCount(id, count - 1);
        return true;
    },

    best(level) {
        return num(melon.storage.get(`highscore_${String(level).toUpperCase()}`, 0));
    },

    isUnlocked(level) {
        level = String(level).toUpperCase();
        if (level === WORLD_ORDER[0]) return true;
        if (melon.storage.get(`world_${level}`, false)) return true;

        const rule = WORLD_UNLOCK[level];
        const prev = WORLD_ORDER[WORLD_ORDER.indexOf(level) - 1];
        if (rule && prev && this.isUnlocked(prev) && this.best(prev) >= rule.score) {
            melon.storage.set(`world_${level}`, true);
            return true;
        }
        return false;
    },

    unlockWithCoins(level) {
        const rule = WORLD_UNLOCK[level];
        if (!rule || !this.spendCoins(rule.coins)) return false;
        melon.storage.set(`world_${level}`, true);
        return true;
    },

    // The previous world must be open before a world can be bought.
    previousWorld(level) {
        return WORLD_ORDER[WORLD_ORDER.indexOf(level) - 1] || null;
    },

    // First locked world, used for "next goal" messages.
    nextLockedWorld() {
        return WORLD_ORDER.find(level => !this.isUnlocked(level)) || null;
    },

    flag(name) {
        return !!melon.storage.get(`flag_${name}`, false);
    },

    setFlag(name, value = true) {
        melon.storage.set(`flag_${name}`, value);
    },

    gamesPlayed() {
        return num(melon.storage.get("gamesPlayedTotal", 0));
    },

    countGame() {
        melon.storage.set("gamesPlayedTotal", this.gamesPlayed() + 1);
    }
};

game.meta = meta;
