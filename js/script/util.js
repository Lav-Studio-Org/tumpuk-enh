import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'



// Put user code here //
game.util.addScore = function(amount) {
    game.var.scoreValue = (game.var.scoreValue || 0) + amount;
    game.var.displayScore ??= game.var.scoreValue - amount;

    if (game.var.scoreObj) {
        clearInterval(game.var.scoreInterval);

        game.var.scoreInterval = setInterval(() => {
            game.var.displayScore += Math.max(1, Math.ceil((game.var.scoreValue - game.var.displayScore) * 0.1));

            if (game.var.displayScore >= game.var.scoreValue) {
                game.var.displayScore = game.var.scoreValue;
                clearInterval(game.var.scoreInterval);
            }

            game.var.scoreObj.setText(game.var.displayScore.toLocaleString("en-US"));
        }, 16);
    }

    if (game.var.scoreValue > (game.var.highscoreValue || 0)) {
        game.var.highscoreValue = game.var.scoreValue;

        const level = String(game.var.currentLevel || "KEBUN").toUpperCase();
        melon.storage.set(`highscore_${level}`, game.var.highscoreValue);

        if (game.var.highscoreObj) game.var.highscoreObj.setText(game.var.highscoreValue.toLocaleString("en-US"));
    }

    game.achievement?.onScore(
        game.var.scoreValue
    );
};
game.var.audioReady = game.var.audioReady || {};
game.var.audioWaiters = game.var.audioWaiters || {};

// Load one lazy audio clip (once). callback(ok) runs when it is ready or failed.
game.util.ensureAudio = function(name, callback) {
    if (name in game.var.audioReady) {
        callback?.(game.var.audioReady[name]);
        return;
    }

    const waiters = game.var.audioWaiters[name];

    if (waiters) {
        if (callback) waiters.push(callback);
        return;
    }

    const resource = (game.var.lazyAudio || []).find(item => item.name === name);

    if (!resource) {
        callback?.(true);
        return;
    }

    game.var.audioWaiters[name] = callback ? [callback] : [];

    const done = (ok) => {
        game.var.audioReady[name] = ok;
        const list = game.var.audioWaiters[name] || [];
        delete game.var.audioWaiters[name];
        list.forEach(fn => fn(ok));
    };

    try {
        me.loader.load(resource, () => done(true), () => done(false));
    } catch (e) {
        done(false);
    }
};

// Background-load every lazy clip, one at a time, after start-up.
game.util.loadLazyAudio = function() {
    const queue = [...(game.var.lazyAudio || [])];

    const next = () => {
        const item = queue.shift();
        if (item) game.util.ensureAudio(item.name, () => setTimeout(next, 200));
    };

    setTimeout(next, 1500);
};
game.util.sceneAssets = function(scene, level = game.var.currentLevel, type = "load") {
    const config = game.var.CONFIG.SCENES[scene];
    if (!config) return [];

    return (config[type] || []).map(asset => {
        return asset === "$LEVEL" ? game.var.levelMap[level] : asset;
    }).filter(Boolean);
};
game.util.goScene = function(target, options = {}) {
    if (game.var.sceneChanging) return;
    game.var.sceneChanging = true;

    const config = game.var.CONFIG;
    const currentScene = melon.scene.current();
    const oldLevel = game.var.currentLevel;
    const unloadAssets = game.util.sceneAssets(currentScene, oldLevel, "unload");

    if (options.level) game.var.currentLevel = String(options.level).toUpperCase();

    const loadAssets = game.util.sceneAssets(target, game.var.currentLevel, "load");

    if (melon.game.isPaused()) melon.game.resume();

    const changeScene = () => {
        if (config.ASSET_MODE === "PER_SCENE") {
            game.var.loadingTarget = target;
            game.var.loadingAssets = loadAssets;
            game.var.unloadAssets = unloadAssets;
            melon.scene.goTo("LoadingGame");
        } else {
            melon.scene.goTo(target);
        }

        game.var.sceneChanging = false;
    };

    if (options.fade === false) {
        changeScene();
        return;
    }

    melon.camera.fade("#000000", config.FADE_TIME);
    melon.time.after(config.FADE_TIME, changeScene);
};
game.util.restartScene = function() {
    const fadeTime = game.var.CONFIG?.FADE_TIME || 500;

    if (melon.game.isPaused()) melon.game.resume();

    melon.camera.fade("#000000", fadeTime);

    melon.time.after(fadeTime, () => {
        melon.scene.restart();
    });
}; 
game.util.openSettings = function() {
    melon.object.spawn("settingContainer", {
        x:0,
        y:-150,
        z: 10000
    })
    if (!melon.game.isPaused()) melon.game.pause();
    game.var.activeModal = true;
}
game.util.closeSettings = function(container) {
    me.game.world.removeChild(container);

    if (melon.game.isPaused()) {
        melon.game.resume();
    }

    game.var.activeModal = false;

    if (melon.scene.current() === "Main") {
        game.var.homeEntrance?.();
    }
};
game.util.isModalOpen = function() {
    return game.var.activeModal;
}
game.util.homeExitAnimation = function(callback) {
    const data = game.var.homeAnimation;

    if (!data) {
        callback?.();
        return;
    }

    const hangTitle = me.game.world.getChildByName("hangTitle")[0];
    const homeUI = me.game.world.getChildByName("homeUI")[0];

    if (!hangTitle || !homeUI) {
        callback?.();
        return;
    }

    // PENTING:
    // Stop entrance kalau user sudah klik tombol
    // walaupun entrance belum selesai.
    game.var.homeTitleTween?.stop();
    game.var.homeUITween?.stop();

    let remaining = 2;

    const done = () => {
        remaining--;

        if (remaining > 0) return;

        callback?.();
    };

    game.var.homeTitleTween = new me.Tween(hangTitle.pos)
        .to(
            {
                x: data.hangHiddenX,
                y: data.hangHiddenY
            },
            {
                duration: 500,
                easing: me.Tween.Easing.Quadratic.In
            }
        )
        .onComplete(done)
        .start();

    game.var.homeUITween = new me.Tween(homeUI.pos)
        .to(
            {
                x: data.homeHiddenX,
                y: data.homeHiddenY
            },
            {
                duration: 600,
                easing: me.Tween.Easing.Quartic.In
            }
        )
        .onComplete(done)
        .start();
};
game.util.getSuikaScale = function(level, objectIndex = 0) {
    const scaleConfig = game.var.suikaScale?.[level];

    let scale = 1;

    if (Array.isArray(scaleConfig)) {
        scale = scaleConfig[objectIndex] ?? 1;
    }
    else if (typeof scaleConfig === "number") {
        scale = scaleConfig;
    }

    return scale * (game.var.suikaScaleMultiplier ?? 1);
};
game.util.openAchievement = function() {

    if (
        game.util.isModalOpen()
    ) {
        return;
    }

    const container =
        melon.object.spawn(
            "achievementContainer",
            {
                x: 0,
                y: 0,
                z: 10000
            }
        );


    game.var
        .achievementContainer =
        container;


    game.var.activeModal =
        true;


    if (
        !melon.game.isPaused()
    ) {

        melon.game.pause();
    }
};


game.util.closeAchievement = function(container) {

    if (
        container?.ancestor
    ) {

        me.game.world.removeChild(
            container
        );
    }


    game.var
        .achievementContainer =
        null;


    game.var.activeModal =
        false;


    if (
        melon.game.isPaused()
    ) {

        melon.game.resume();
    }


    /*
     * Kalau dibuka dari home,
     * munculkan UI home lagi.
     */
    if (
        melon.scene.current() ===
        "Main"
    ) {

        game.var.homeEntrance?.();
    }
};
/*
 * =====================================================
 * ACHIEVEMENT POPUP
 * =====================================================
 */

game.var.achievementPopupQueue =
    game.var.achievementPopupQueue ||
    [];


game.var.achievementPopupActive =
    null;


/*
 * Dipanggil ketika achievement
 * baru saja unlock.
 */
game.util.showAchievementPopup = function(achievement) {

    if (
        !achievement
    ) {
        return;
    }


    /*
     * Masukkan ke queue.
     */
    game.var
        .achievementPopupQueue
        .push(
            achievement
        );


    game.util
        .processAchievementPopup();
};


/*
 * =====================================================
 * PROCESS QUEUE
 * =====================================================
 */
game.util.processAchievementPopup = function() {

    /*
     * Masih ada popup tampil.
     */
    if (
        game.var
            .achievementPopupActive
    ) {

        return;
    }


    const queue =
        game.var
            .achievementPopupQueue;


    if (
        queue.length === 0
    ) {

        return;
    }


    const achievement =
        queue.shift();


    const popup =
        melon.object.spawn(
            "achievementPopup",
            {
                x: 0,
                y: 0,

                z: 20000,

                achievement
            }
        );


    game.var
        .achievementPopupActive =
        popup;
};


/*
 * =====================================================
 * POPUP FINISHED
 * =====================================================
 */
game.util.finishAchievementPopup = function(popup) {

    if (
        game.var
            .achievementPopupActive ===
        popup
    ) {

        game.var
            .achievementPopupActive =
            null;
    }


    /*
     * Kalau ada achievement berikutnya,
     * tampilkan sesudah jeda pendek.
     */
    if (
        game.var
            .achievementPopupQueue
            .length > 0
    ) {

        melon.time.after(
            120,
            () => {

                game.util
                    .processAchievementPopup();
            }
        );
    }
};
//  End of user code  //


/* The code below will be executed when the script is imported into a component or another script. */
export default () => {
    // Put user code here //
    
    //  End of user code  //
}
