import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'

// Music / sound-effect volume and audio recovery.
//
// The game code calls melon.audio.play / fade with its own levels (BGM fades to
// 0.2, merge sounds at 0.9 ...). We scale those calls here, so the settings
// sliders work everywhere without touching every call site.

const MUSIC_BASE = 0.2; // the level Gameplay fades its BGM to

function isMusic(name) {
    name = String(name);
    return name.endsWith("_BGM") || name === "loading sfx";
}

function clamp01(v) {
    v = Number(v);
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1;
}

export const sound = {
    music: 1,
    sfx: 1,

    scale(name) {
        return isMusic(name) ? this.music : this.sfx;
    },

    setMusic(v) {
        this.music = clamp01(v);
        melon.storage.set("vol_music", this.music);
        this.applyMusic();
    },

    setSfx(v) {
        this.sfx = clamp01(v);
        melon.storage.set("vol_sfx", this.sfx);
    },

    // Push the new music level to whatever is playing right now.
    applyMusic() {
        const bgm = game.var.currentBGM;
        try {
            if (bgm?.playing && bgm.id !== null && !bgm.fadingOut) {
                rawSetVolume(bgm.name, MUSIC_BASE * this.music, bgm.id);
            }
            const home = me.game.world?.getChildByName?.("loadingAudio")?.[0];
            if (home?.audio_ID) {
                rawSetVolume("loading sfx", (home.audioVolume ?? 1) * this.music, home.audio_ID);
            }
        } catch (e) { /* nothing playing */ }
    },

    // Resume a suspended / interrupted AudioContext (iOS, tab switch, ads).
    recover() {
        try {
            const ctx = me.audio.getAudioContext?.();
            if (ctx && (ctx.state === "suspended" || ctx.state === "interrupted")) ctx.resume();
        } catch (e) { /* no audio */ }
    },

    duck(on) {
        try {
            const ctx = me.audio.getAudioContext?.();
            if (!ctx) return;
            if (on) ctx.suspend();
            else ctx.resume();
        } catch (e) { /* no audio */ }
    }
};

let rawSetVolume = (name, v, id) => melon.audio.setAudioVolume(name, v, id);

export function installSound() {
    sound.music = clamp01(melon.storage.get("vol_music", 1));
    sound.sfx = clamp01(melon.storage.get("vol_sfx", 1));

    const audio = melon.audio;
    const play = audio.play.bind(audio);
    const fade = audio.fade.bind(audio);
    const setAudioVolume = audio.setAudioVolume.bind(audio);
    rawSetVolume = setAudioVolume;

    audio.play = (name, options = {}) => {
        // Gameplay passes `true` (old loop flag); treat it as { loop: true }.
        if (typeof options !== "object" || options === null) options = { loop: options === true };
        const volume = options.volume ?? 1;
        return play(name, { ...options, volume: volume * sound.scale(name) });
    };

    audio.fade = (name, from, to, duration, id) => {
        const k = sound.scale(name);
        return fade(name, from * k, to * k, duration, id);
    };

    audio.setAudioVolume = (name, v, id) => setAudioVolume(name, v * sound.scale(name), id);

    // Recovery: every touch, and whenever the tab comes back.
    window.addEventListener("pointerdown", () => sound.recover(), { capture: true, passive: true });
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") sound.recover();
    });
    window.addEventListener("focus", () => sound.recover());
}

game.sound = sound;
