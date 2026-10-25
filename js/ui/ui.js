import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'
import { ICON_SPRITE, icon } from './icons.js'
import { meta, SKILLS, WORLD_ORDER, WORLD_NAMES, WORLD_UNLOCK } from './meta.js'
import { sound, installSound } from './sound.js'
import { Ads } from './ads.js'

// DOM layer drawn over the melonJS canvas: modals (result, revive, settings,
// achievements, power-up shop, locked world), HUD extras (next object,
// power-up stock, danger warning, tutorial) and toasts.
//
// Everything lives in a 540-unit-wide "stage" that is scaled to the canvas, so
// positions match the game's own design coordinates.

const DESIGN_W = 540;
const fmt = (n) => Math.round(n || 0).toLocaleString("id-ID");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let root, stage, hud, modalLayer, toastLayer;
const hudEls = {};
const openModals = [];

// ------------------------------------------------------------------ layout

function layout() {
    const canvas = document.querySelector("#screen canvas");
    if (!canvas || !root) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const k = r.width / DESIGN_W;
    root.style.left = r.left + "px";
    root.style.top = r.top + "px";
    root.style.width = r.width + "px";
    root.style.height = r.height + "px";
    stage.style.width = DESIGN_W + "px";
    stage.style.height = r.height / k + "px";
    stage.style.transform = `scale(${k})`;
}

function el(tag, cls, html) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
}

function click(sound = "buttonClick") {
    try { melon.audio.play(sound); } catch (e) { /* audio not ready */ }
}

// ------------------------------------------------------------------ toast

export function toast(text, opts = {}) {
    const t = el("div", "toast" + (opts.cls ? " " + opts.cls : ""), opts.html ?? esc(text));
    toastLayer.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
        t.classList.remove("show");
        setTimeout(() => t.remove(), 300);
    }, opts.ms ?? 2200);
}

// ------------------------------------------------------------------ modals

function pauseGame() {
    if (!melon.game.isPaused()) melon.game.pause();
}

function resumeGame() {
    if (melon.game.isPaused()) melon.game.resume();
}

/**
 * opts: { size: "big"|"small", title, html, closable, onClose, cls, keepPaused }
 * Returns the modal element; call closeModal(m) to remove it.
 */
function openModal(opts) {
    const m = el("div", "modal " + (opts.cls || ""));
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    if (opts.title) m.setAttribute("aria-label", opts.title);
    const size = opts.size || "big";
    m.innerHTML = `
        <div class="backdrop"></div>
        <div class="panel panel-${size}">
            ${opts.title ? `<div class="panel-title">${esc(opts.title)}</div>` : ""}
            ${opts.closable !== false ? `<button class="panel-close" aria-label="Tutup"></button>` : ""}
            <div class="panel-body">${opts.html || ""}</div>
        </div>`;
    m._opts = opts;
    modalLayer.appendChild(m);
    openModals.push(m);
    game.var.activeModal = true;
    pauseGame();
    requestAnimationFrame(() => m.classList.add("show"));
    const close = m.querySelector(".panel-close");
    if (close) close.addEventListener("click", () => { click(); closeModal(m); });
    return m;
}

function closeModal(m, silent = false) {
    if (!m || !m.isConnected) return;
    const i = openModals.indexOf(m);
    if (i >= 0) openModals.splice(i, 1);
    m.classList.remove("show");
    setTimeout(() => m.remove(), 220);
    if (openModals.length === 0) {
        game.var.activeModal = false;
        if (!m._opts.keepPaused) resumeGame();
    }
    if (!silent) m._opts.onClose?.();
}

function closeAllModals() {
    [...openModals].forEach((m) => closeModal(m, true));
}

function button(label, cls, attrs = "") {
    return `<button class="btn ${cls}" ${attrs}><span>${label}</span></button>`;
}

// ------------------------------------------------------------------ settings

function openSettings() {
    if (openModals.length) return;
    const fromHome = melon.scene.current() === "Main";
    const m = openModal({
        title: "Pengaturan",
        size: "small",
        cls: "settings",
        html: `
            <label class="slider-row">
                <span class="slider-label">${icon("music")} Musik</span>
                <input type="range" min="0" max="100" step="5" value="${Math.round(sound.music * 100)}" data-k="music" aria-label="Volume musik">
            </label>
            <label class="slider-row">
                <span class="slider-label">${icon("sound")} Efek suara</span>
                <input type="range" min="0" max="100" step="5" value="${Math.round(sound.sfx * 100)}" data-k="sfx" aria-label="Volume efek suara">
            </label>
            <button class="link-btn" data-act="howto">${icon("tap")} Cara main</button>
            <div class="version">Tumpuk! v${game.VERSION || "1.0.0"}</div>`,
        onClose() {
            if (fromHome) game.var.homeEntrance?.();
        }
    });
    m.querySelectorAll("input[type=range]").forEach((input) => {
        const paint = () => input.style.setProperty("--v", input.value + "%");
        paint();
        input.addEventListener("input", () => {
            paint();
            if (input.dataset.k === "music") sound.setMusic(input.value / 100);
            else sound.setSfx(input.value / 100);
        });
        input.addEventListener("change", () => { if (input.dataset.k === "sfx") click(); });
    });
    m.querySelector('[data-act="howto"]').addEventListener("click", () => {
        click();
        closeModal(m, true);
        showHowTo(() => { if (fromHome) game.var.homeEntrance?.(); });
    });
}

function showHowTo(onClose) {
    openModal({
        title: "Cara main",
        size: "small",
        cls: "howto",
        onClose,
        html: `
            <ol class="howto-list">
                <li>${icon("tap")}<span>Geser untuk membidik, lepas untuk menjatuhkan.</span></li>
                <li>${icon("star")}<span>Dua benda yang sama bergabung jadi benda berikutnya.</span></li>
                <li>${icon("timer")}<span>Jangan biarkan tumpukan melewati garis merah terlalu lama.</span></li>
                <li>${icon("hammer")}<span>Kipas, Palu, dan Bom membantu saat toples penuh.</span></li>
            </ol>`
    });
}

// ------------------------------------------------------------------ achievements

function openAchievements() {
    if (openModals.length) return;
    const fromHome = melon.scene.current() === "Main";
    const list = game.achievement?.getAll?.() || [];
    const done = list.filter((a) => a.unlocked).length;
    const items = list
        .slice()
        .sort((a, b) => (a.unlocked === b.unlocked ? b.percent - a.percent : a.unlocked ? 1 : -1))
        .map((a) => `
            <li class="ach ${a.unlocked ? "done" : ""}">
                <div class="ach-icon">${icon(a.unlocked ? "check" : "trophy")}</div>
                <div class="ach-main">
                    <div class="ach-title">${esc(a.title)}</div>
                    <div class="ach-desc">${esc(a.description)}</div>
                    <div class="ach-bar"><i style="width:${Math.round(a.percent * 100)}%"></i></div>
                </div>
                <div class="ach-side">
                    <div class="ach-prog">${a.unlocked ? "Selesai" : `${fmt(Math.min(a.progress, a.target))}/${fmt(a.target)}`}</div>
                    <div class="ach-reward">${icon("coin")} ${fmt(a.rewardCoin)}</div>
                </div>
            </li>`)
        .join("");
    openModal({
        title: "Prestasi",
        size: "big",
        cls: "achievements",
        onClose() { if (fromHome) game.var.homeEntrance?.(); },
        html: `
            <div class="ach-summary">${done} dari ${list.length} terbuka</div>
            <ul class="ach-list">${items}</ul>`
    });
}

function showAchievementToast(a) {
    if (!a) return;
    click("playClick");
    toast("", {
        cls: "ach-toast",
        ms: 2600,
        html: `
            <div class="ach-icon">${icon("trophy")}</div>
            <div class="ach-main">
                <div class="ach-kicker">Prestasi terbuka</div>
                <div class="ach-title">${esc(a.title)}</div>
            </div>
            <div class="ach-reward">+${fmt(a.rewardCoin)} ${icon("coin")}</div>`
    });
}

// ------------------------------------------------------------------ power-ups

function refundSkill(id) {
    meta.addSkill(id, 1);
}

/**
 * Called by the power-up buttons. `activate` runs the original skill code.
 */
function trySkill(id, activate) {
    if (game.var.skillActive || game.var.isGameOver || openModals.length) return;
    if (meta.useSkill(id)) {
        game.var.skillPending = id;
        activate();
        game.var.skillPending = null;
        if (game.var.skillActive !== id) refundSkill(id); // activation refused
        return;
    }
    showSkillShop(id, () => {
        // Bought / earned: use it right away.
        meta.useSkill(id);
        activate();
        if (game.var.skillActive !== id) refundSkill(id);
    });
}

function showSkillShop(id, onGranted) {
    const s = SKILLS[id];
    const coins = meta.coins();
    const canBuy = coins >= s.price;
    const m = openModal({
        title: s.name,
        size: "small",
        cls: "shop",
        html: `
            <img class="shop-art" src="${s.art}" alt="">
            <p class="shop-desc">${esc(s.desc)}</p>
            <p class="shop-stock">Stok habis &middot; koinmu ${icon("coin")} <b>${fmt(coins)}</b></p>
            <div class="btn-col">
                ${button(`${icon("coin")} Beli 1 &middot; ${s.price}`, "btn-orange", `data-act="buy" ${canBuy ? "" : "disabled"}`)}
                ${button(`${icon("video")} Gratis 1`, "btn-green", 'data-act="ad"')}
            </div>
`
    });
    m.querySelector('[data-act="buy"]').addEventListener("click", () => {
        if (!meta.spendCoins(s.price)) return;
        click("playClick");
        meta.addSkill(id, 1);
        closeModal(m, true);
        onGranted();
    });
    m.querySelector('[data-act="ad"]').addEventListener("click", async () => {
        click();
        const ok = await Ads.rewarded(`power_${id}`);
        if (!ok) return;
        meta.addSkill(id, 1);
        closeModal(m, true);
        onGranted();
    });
}

// ------------------------------------------------------------------ revive

/**
 * Offered once per round when the stack stays over the line.
 */
function showRevive({ onRevive, onDecline }) {
    let left = 6;
    let finished = false;
    const m = openModal({
        title: "Hampir!",
        size: "big",
        cls: "revive",
        closable: false,
        keepPaused: true,
        html: `
            <p class="revive-text">Toplesnya penuh. Bersihkan bagian atas dan lanjut main?</p>
            <div class="revive-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/></svg><span>${left}</span></div>
            <div class="btn-col">
                ${button(`${icon("video")} Lanjut main`, "btn-green", 'data-act="ad"')}
                <button class="link-btn" data-act="no">Lihat hasil</button>
            </div>`
    });
    const num = m.querySelector(".revive-ring span");
    m.querySelector(".revive-ring").style.setProperty("--dur", left + "s");
    const iv = setInterval(() => {
        if (m._adOpen) return;
        left--;
        num.textContent = Math.max(0, left);
        if (left <= 0) decline();
    }, 1000);
    const end = () => { finished = true; clearInterval(iv); closeModal(m, true); };
    const decline = () => {
        if (finished) return;
        end();
        onDecline();
    };
    m.querySelector('[data-act="no"]').addEventListener("click", () => { click(); decline(); });
    m.querySelector('[data-act="ad"]').addEventListener("click", async () => {
        if (finished) return;
        click();
        m._adOpen = true;
        m.classList.add("paused");
        const ok = await Ads.rewarded("revive");
        m._adOpen = false;
        if (finished) return;
        if (ok) {
            end();
            resumeGame();
            onRevive();
        } else {
            decline();
        }
    });
}

// ------------------------------------------------------------------ result

function showResult(d) {
    closeAllModals();
    const level = String(d.level || "KEBUN").toUpperCase();
    const isRecord = d.score > 0 && d.score > d.bestBefore;
    let coinsShown = d.coins;
    let doubled = false;

    // "What next" line: world just opened, or how far the next one is.
    let goal = "";
    if (d.unlocked) {
        goal = `<div class="goal good">${icon("map")} ${WORLD_NAMES[d.unlocked]} sekarang terbuka!</div>`;
    } else {
        const next = WORLD_ORDER[WORLD_ORDER.indexOf(level) + 1];
        if (next && !meta.isUnlocked(next)) {
            const need = WORLD_UNLOCK[next].score;
            const best = meta.best(level);
            goal = `<div class="goal">${icon("lock")} ${WORLD_NAMES[next]} terbuka di skor ${fmt(need)} &middot; kurang ${fmt(need - best)}</div>`;
        }
    }

    const biggest = d.biggest
        ? `<div class="biggest"><img src="ui/obj/${level.toLowerCase()}/${d.biggest}.webp" alt=""><span>Terbesar: <b>${esc(game.var.objectName(d.biggest))}</b></span></div>`
        : "";

    const m = openModal({
        title: isRecord ? "Rekor baru!" : "Game Over",
        size: "big",
        cls: "result" + (isRecord ? " record" : ""),
        closable: false,
        keepPaused: true,
        html: `
            ${isRecord ? `<div class="ribbon"><span>${icon("crown")} Rekor baru!</span></div>` : ""}
            <div class="score-label">Skor</div>
            <div class="score-big" data-score>0</div>
            <div class="best">${icon("crown")} Terbaik ${fmt(Math.max(d.score, d.bestBefore))}</div>
            ${biggest}
            <div class="coin-box">
                <div class="coin-earned">${icon("coin")} +<b data-coins>${fmt(coinsShown)}</b> koin</div>
                ${d.coins > 0 ? button(`${icon("video")} 2x koin`, "btn-green small", 'data-act="double"') : ""}
            </div>
            ${goal}
            <div class="btn-col">
                ${button(`${icon("restart")} Main lagi`, "btn-orange", 'data-act="again"')}
                <button class="link-btn" data-act="map">${icon("map")} Peta</button>
            </div>`
    });

    // count-up
    const scoreEl = m.querySelector("[data-score]");
    const t0 = performance.now();
    const dur = Math.min(1200, 300 + d.score / 10);
    const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        scoreEl.textContent = fmt(d.score * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    if (isRecord) setTimeout(() => click("playClick"), 400);

    const dbl = m.querySelector('[data-act="double"]');
    if (dbl) dbl.addEventListener("click", async () => {
        if (doubled) return;
        click();
        const ok = await Ads.rewarded("double_coins");
        if (!ok) return;
        doubled = true;
        meta.addCoins(d.coins);
        coinsShown = d.coins * 2;
        m.querySelector("[data-coins]").textContent = fmt(coinsShown);
        dbl.disabled = true;
        dbl.querySelector("span").innerHTML = `${icon("check")} Didapat`;
    });

    const leave = async (fn) => {
        Ads.roundFinished();
        await Ads.maybeInterstitial("round_end");
        closeModal(m, true);
        resumeGame();
        fn();
    };
    m.querySelector('[data-act="again"]').addEventListener("click", () => { click("playClick"); leave(() => game.util.restartScene()); });
    m.querySelector('[data-act="map"]').addEventListener("click", () => { click(); leave(() => game.util.goScene("Maps")); });
}

// ------------------------------------------------------------------ locked world

function showWorldLocked(level, onOpen) {
    const rule = WORLD_UNLOCK[level];
    const prev = meta.previousWorld(level);
    const prevOpen = meta.isUnlocked(prev);
    const best = meta.best(prev);
    const coins = meta.coins();
    const canBuy = prevOpen && coins >= rule.coins;
    const pct = Math.min(100, Math.round((best / rule.score) * 100));
    // Latest open world before this one: where the player should go next.
    const playable = [...WORLD_ORDER.slice(0, WORLD_ORDER.indexOf(level))].reverse().find((w) => meta.isUnlocked(w)) || WORLD_ORDER[0];
    const m = openModal({
        title: WORLD_NAMES[level],
        size: "small",
        cls: "locked",
        html: `
            <div class="world-thumb"><img src="ui/world/${level.toLowerCase()}.webp" alt=""><div class="lock-badge">${icon("lock")}</div></div>
            ${prevOpen
                ? `<p class="locked-text">Capai skor <b>${fmt(rule.score)}</b> di ${WORLD_NAMES[prev]} untuk membuka ${WORLD_NAMES[level]}.</p>
                   <div class="progress"><i style="width:${pct}%"></i><span>${fmt(best)} / ${fmt(rule.score)}</span></div>`
                : `<p class="locked-text">Buka ${WORLD_NAMES[prev]} dulu. Dunia terbuka berurutan, mulai dari ${WORLD_NAMES[WORLD_ORDER[0]]}.</p>`}
            <div class="btn-col">
                ${prevOpen ? button(`${icon("coin")} Buka sekarang &middot; ${fmt(rule.coins)}`, "btn-orange", `data-act="buy" ${canBuy ? "" : "disabled"}`) : ""}
                <button class="link-btn" data-act="play">${icon("play")} Main di ${WORLD_NAMES[playable]}</button>
            </div>
            ${prevOpen && !canBuy ? `<p class="shop-hint">Kamu punya ${fmt(coins)} koin.</p>` : ""}`
    });
    const buy = m.querySelector('[data-act="buy"]');
    if (buy) buy.addEventListener("click", () => {
        if (!meta.unlockWithCoins(level)) return;
        click("playClick");
        closeModal(m, true);
        toast(`${WORLD_NAMES[level]} terbuka!`);
        onOpen?.();
    });
    m.querySelector('[data-act="play"]').addEventListener("click", () => {
        click();
        closeModal(m, true);
        game.util.goScene("Gameplay", { level: playable });
    });
}

// ------------------------------------------------------------------ HUD

function buildHud() {
    hud.innerHTML = `
        <div class="next" aria-hidden="true">
            <div class="next-label">Berikutnya</div>
            <div class="next-frame"><img alt=""></div>
        </div>
        <div class="skill-badge" data-skill="blower" style="top:${199 + 12}px"></div>
        <div class="skill-badge" data-skill="hammer" style="top:${259 + 12}px"></div>
        <div class="skill-badge" data-skill="bomb" style="top:${319 + 12}px"></div>
        <div class="skill-banner" role="status">
            <span class="skill-banner-text"></span>
            <button class="skill-cancel">Batal</button>
        </div>
        <div class="danger" role="status" aria-live="assertive"><span class="danger-text">Awas!</span><b></b></div>
        <div class="tutorial">
            <div class="tut-hand">${icon("tap")}</div>
            <div class="tut-card">Geser untuk membidik, lepas untuk menjatuhkan.<br>Gabungkan dua yang sama!</div>
        </div>
        <button class="map-home" aria-label="Menu"></button>`;
    hudEls.next = hud.querySelector(".next");
    hudEls.nextImg = hud.querySelector(".next img");
    hudEls.badges = [...hud.querySelectorAll(".skill-badge")];
    hudEls.banner = hud.querySelector(".skill-banner");
    hudEls.bannerText = hud.querySelector(".skill-banner-text");
    hudEls.danger = hud.querySelector(".danger");
    hudEls.dangerNum = hud.querySelector(".danger b");
    hudEls.tutorial = hud.querySelector(".tutorial");
    hudEls.mapHome = hud.querySelector(".map-home");

    hud.querySelector(".skill-cancel").addEventListener("click", (e) => {
        e.stopPropagation();
        const id = game.var.skillActive;
        if (id !== "hammer" && id !== "bomb") return;
        click();
        game.var.skillActive = null;
        game.var.bombHoverTarget = null;
        refundSkill(id);
    });
    hudEls.mapHome.addEventListener("click", () => {
        if (openModals.length) return;
        click();
        game.util.goScene("Main");
    });
}

let lastNextSrc = "";
let lastBadgeKey = "";

function updateHud() {
    const scene = melon.scene.current();
    const inGame = scene === "Gameplay";
    hud.dataset.scene = scene || "";

    if (inGame) {
        const level = String(game.var.currentLevel || "KEBUN").toUpperCase();
        const spawner = me.game.world.getChildByName?.("suikaSpawner")?.[0];
        const next = spawner?.nextObject;
        const src = next ? `ui/obj/${level.toLowerCase()}/${next}.webp` : "";
        if (src !== lastNextSrc) {
            lastNextSrc = src;
            hudEls.nextImg.src = src;
            hudEls.next.classList.toggle("bump", !!src);
            setTimeout(() => hudEls.next.classList.remove("bump"), 250);
        }

        const key = Object.keys(SKILLS).map((id) => meta.skillCount(id)).join(",") + meta.coins();
        if (key !== lastBadgeKey) {
            lastBadgeKey = key;
            hudEls.badges.forEach((b) => {
                const id = b.dataset.skill;
                const n = meta.skillCount(id);
                b.classList.toggle("empty", n <= 0);
                b.innerHTML = n > 0 ? `${n}` : "+";
            });
        }

        const active = game.var.skillActive;
        let text = "";
        if (active === "hammer") text = "Ketuk benda yang mau dipukul";
        else if (active === "bomb") text = "Ketuk benda yang mau diledakkan";
        else if (active === "blower") {
            const left = Math.max(0, Math.ceil(((game.var.blowerEndTime || 0) - me.timer.getTime()) / 1000));
            text = `Tahan kipas untuk menggoyang &middot; ${left}`;
        }
        hudEls.banner.classList.toggle("show", !!text && !game.var.isGameOver);
        hudEls.banner.classList.toggle("no-cancel", active === "blower");
        if (text) hudEls.bannerText.innerHTML = text;

        const danger = game.var.isDanger && !game.var.isGameOver && game.var.dangerTime > 600;
        hudEls.danger.classList.toggle("show", danger);
        if (danger) {
            hudEls.dangerNum.textContent = Math.max(1, Math.ceil((game.var.dangerDuration - game.var.dangerTime) / 1000));
        }
    } else {
        lastNextSrc = "";
    }

    const tut = inGame && !meta.flag("tutorial") && !game.var.isGameOver;
    hudEls.tutorial.classList.toggle("show", tut);
}

function loop() {
    try { updateHud(); } catch (e) { /* scene switching */ }
    requestAnimationFrame(loop);
}

// Called by the spawner on every drop.
function onDrop() {
    if (!meta.flag("tutorial")) meta.setFlag("tutorial");
}

// ------------------------------------------------------------------ init

export function initUI() {
    installSound();

    document.body.insertAdjacentHTML("afterbegin", ICON_SPRITE);
    root = el("div", "", "");
    root.id = "ui";
    stage = el("div", "stage");
    hud = el("div", "hud");
    modalLayer = el("div", "modals");
    toastLayer = el("div", "toasts");
    toastLayer.setAttribute("aria-live", "polite");
    stage.append(hud, modalLayer, toastLayer);
    root.appendChild(stage);
    document.body.appendChild(root);
    buildHud();

    layout();
    window.addEventListener("resize", () => setTimeout(layout, 50));
    window.addEventListener("orientationchange", () => setTimeout(layout, 200));
    const canvas = document.querySelector("#screen canvas");
    if (canvas && window.ResizeObserver) new ResizeObserver(layout).observe(canvas);
    requestAnimationFrame(loop);

    // Replace the canvas modals with the DOM versions.
    game.util.openSettings = openSettings;
    game.util.openAchievement = openAchievements;
    game.util.showAchievementPopup = showAchievementToast;
    game.util.isModalOpen = () => openModals.length > 0 || !!game.var.activeModal;

    // Track the biggest object made this round for the result screen.
    const onMerge = game.achievement?.onMerge?.bind(game.achievement);
    if (onMerge) {
        game.achievement.onMerge = (args = {}) => {
            const lvl = args.createdObjLevel || 0;
            if (lvl > (game.var.roundMaxLevel || 0)) game.var.roundMaxLevel = lvl;
            return onMerge(args);
        };
    }

    // Test hook for scripts/smoke.js.
    window.__tumpuk = { game, meta, ui, Ads, sound, me, melon };

    // Hardware / browser back closes the top modal first.
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && openModals.length) {
            const top = openModals[openModals.length - 1];
            if (top._opts.closable !== false) closeModal(top);
        }
    });
}

export const ui = {
    toast,
    trySkill,
    showRevive,
    showResult,
    showWorldLocked,
    openSettings,
    openAchievements,
    onDrop,
    layout,
    isOpen: () => openModals.length > 0
};

game.ui = ui;
