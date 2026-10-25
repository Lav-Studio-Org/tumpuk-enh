import game from '../game.js'
import { sound } from './sound.js'
import { meta } from './meta.js'
import { icon } from './icons.js'

// Ad layer. Every ad goes through Ads, so the Android build only has to set
// window.TumpukNativeAds = { showRewarded(placement), showInterstitial(placement) }
// (both return Promise<boolean>).
//
// Placements (keep in sync with README):
//   rewarded:      revive, double_coins, power_blower, power_hammer, power_bomb
//   interstitial:  round_end (between rounds only, frequency-capped, off on the web)

export const POLICY = {
    firstInterstitialAfterGames: 3, // never in a new player's first 3 games
    gamesBetweenInterstitials: 2,   // at most every 2nd finished round
    minSecondsBetweenAds: 90,       // never within 90 s of any other ad, rewarded included
    webInterstitials: false         // the web build only shows rewarded (player-chosen) ads
};

const state = { lastAdAt: 0, sinceInterstitial: 0 };

function track(event, data) {
    game.track?.(event, data);
}

// Web stand-in: a fake full-screen ad so every flow can be tried on GitHub Pages.
function mockAd(kind, placement) {
    return new Promise((resolve) => {
        const secs = kind === "rewarded" ? 5 : 3;
        const el = document.createElement("div");
        el.className = "ad-mock";
        el.innerHTML = `
            <div class="ad-box" role="dialog" aria-label="Iklan contoh">
                <div class="ad-tag">IKLAN CONTOH</div>
                <div class="ad-title">${icon("video")} ${kind === "rewarded" ? "Iklan berhadiah" : "Iklan"}</div>
                <div class="ad-ring"><span>${secs}</span></div>
                <p class="ad-note">Di versi aplikasi, di sini tampil iklan asli.</p>
                <button class="ad-close" disabled>${kind === "rewarded" ? "Tunggu..." : "Lewati dalam " + secs}</button>
            </div>`;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add("show"));
        const btn = el.querySelector(".ad-close");
        const ring = el.querySelector(".ad-ring span");
        let left = secs;
        const iv = setInterval(() => {
            left--;
            ring.textContent = Math.max(0, left);
            if (left > 0) {
                if (kind !== "rewarded") btn.textContent = "Lewati dalam " + left;
                return;
            }
            clearInterval(iv);
            btn.disabled = false;
            btn.textContent = kind === "rewarded" ? "Ambil hadiah" : "Tutup";
        }, window.__tumpukFastAds ? 30 : 1000);
        btn.addEventListener("click", () => {
            el.classList.remove("show");
            setTimeout(() => el.remove(), 200);
            resolve(true);
        });
    });
}

function provider() {
    return window.TumpukNativeAds || {
        showRewarded: (p) => mockAd("rewarded", p),
        showInterstitial: (p) => mockAd("interstitial", p)
    };
}

async function run(kind, placement) {
    track("ad_request", { kind, placement });
    sound.duck(true);
    let ok = false;
    try {
        ok = kind === "rewarded"
            ? await provider().showRewarded(placement)
            : await provider().showInterstitial(placement);
    } catch (e) {
        ok = false;
    }
    sound.duck(false);
    sound.recover();
    state.lastAdAt = Date.now();
    track(ok ? "ad_complete" : "ad_failed", { kind, placement });
    if (!ok && kind === "rewarded") game.ui?.toast("Iklan belum tersedia, coba lagi sebentar lagi.");
    return ok;
}

export const Ads = {
    POLICY,
    // Promise<boolean>: give the reward only when this resolves true.
    rewarded: (placement) => run("rewarded", placement),

    roundFinished() {
        state.sinceInterstitial++;
    },

    canInterstitial() {
        if (!window.TumpukNativeAds && !POLICY.webInterstitials) return false;
        if (meta.flag("noAds")) return false;
        if (meta.gamesPlayed() < POLICY.firstInterstitialAfterGames) return false;
        if (state.sinceInterstitial < POLICY.gamesBetweenInterstitials) return false;
        if (Date.now() - state.lastAdAt < POLICY.minSecondsBetweenAds * 1000) return false;
        return true;
    },

    async maybeInterstitial(placement) {
        if (!this.canInterstitial()) return false;
        state.sinceInterstitial = 0;
        return run("interstitial", placement);
    }
};

game.Ads = Ads;
