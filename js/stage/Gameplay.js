import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'

// Put user code here //
import suikaObj from '../renderables/suikaObj.js';
import blower from '../renderables/blower.js';  
//  End of user code  //

export default class Gameplay extends me.Stage {

	/* Called by the state manager when reseting the object, this is typically where you will load a level, add renderables, etc.
	Read (https://melonjs.github.io/melonJS/classes/Stage.html#onResetEvent) for more details. */
	onResetEvent() {
        // Put user code here //
        clearInterval(game.var.scoreInterval);

        game.var.scoreInterval = null;
        game.var.displayScore = 0;
        game.var.scoreValue = 0;
        game.var.finalScore = 0;
        game.var.isGameOver = false;
        game.var.isDanger = false;
        game.var.comboCount = 0;
        game.var.comboLastAt = 0;
        game.var.dangerTime = 0;
        game.var.skillActive = null;
        game.var.bombHoverTarget = null;
        game.var.roundMaxLevel = 0;
        game.var.bestAtStart = melon.storage.get(
            `highscore_${String(game.var.currentLevel).toUpperCase()}`,
            0
        );
        this.revived = false;
        this.lockedAtStart = game.meta?.nextLockedWorld() ?? null;

        game.achievement?.onLevelStart(
            game.var.currentLevel
        );
        //  End of user code  //
		me.level.load("Gameplay");
		this.var = {};
		// Your Blockly Start Here //
		melon.camera.flash("#000000", 1000);
	
		// End of Your Blockly //

        // Put user code here //
        this.resetBlowerParticles();
        game.var.blowerParticles = {

            left:
                me.game.world
                    .getChildByName(
                        "suikaWhooshPushRight"
                    )[0] || null,

            right:
                me.game.world
                    .getChildByName(
                        "suikaWhooshPushLeft"
                    )[0] || null,

            bottom:
                me.game.world
                    .getChildByName(
                        "suikaWhooshPushUp"
                    )[0] || null
        };


        Object.values(
            game.var.blowerParticles
        ).forEach((particle) => {

            const system =
                particle?.runtime?.system;

            if (!system) return;

            system.clear();
            system.wantsEmission = false;
        });


        game.var.skillActive = null;

        this.startLevelBGM();
        //  End of user code  //
	}

	update(dt) {
        // Put user code here //
        
        //  End of user code  //
		super.update(dt);
        // Put user code here //
        this.checkDanger(dt);
        
        const comboConfig =
            game.var.suikaCombo || {};

        const comboWindow =
            comboConfig.continueWindow ??
            1500;


        if (
            game.var.comboCount > 0 &&
            me.timer.getTime() -
                game.var.comboLastAt >
                comboWindow
        ) {

            game.var.comboCount = 0;
        }
        //  End of user code  //
	}
	/* Called by the state manager before switching to another state.
	Read (https://melonjs.github.io/melonJS/classes/Stage.html#onDestroyEvent) for more details. */
	onDestroyEvent() {
        // Put user code here //
        clearInterval(game.var.scoreInterval);
        game.var.scoreInterval = null;
        game.var.scoreObj = null;
        game.var.highscoreObj = null;
        
        this.stopLevelBGM();
        //  End of user code  //
		melon.textures.unloadForLevel("Gameplay");
		super.onDestroyEvent();
	}

	// Your Blockly functions //

	// End of Blockly functions //
    // Put user code here //
    checkDanger(dt) {

        if (game.var.isGameOver) {
            return;
        }


        const dangerY =
            game.var.dangerY;


        const objects =
            me.game.world.getChildren();


        let hasDangerObject = false;


        for (const object of objects) {

            if (!(object instanceof suikaObj)) {
                continue;
            }

            if (!object.gameOverEligible) {
                continue;
            }


            const bounds =
                object.getBounds();


            const objectTop =
                bounds.top;


            if (objectTop <= dangerY) {

                hasDangerObject = true;

                break;
            }
        }


        if (hasDangerObject) {
            game.var.isDanger = true;

            game.var.dangerTime += dt;


            if (
                game.var.dangerTime >=
                game.var.dangerDuration
            ) {
                this.triggerGameOver();
            }

        } else {

            game.var.isDanger = false;
            game.var.dangerTime = 0;

        }
    }

    triggerGameOver() {

        if (game.var.isGameOver) {
            return;
        }

        game.var.isGameOver = true;
        game.var.isDanger = false;

        this.freezeObjects(true);

        me.game.world.getChildren()
            .filter(obj => obj instanceof blower)
            .forEach(obj => {
                obj.isHolding = false;
                obj.stopBlowerSound();
                obj.stopWindParticle();
                me.game.world.removeChild(obj);
            });

        game.var.blowerClosing = false;
        game.var.skillActive = null;
        game.var.bombHoverTarget = null;

        // One "keep playing" offer per round (rewarded ad), then the result.
        if (!this.revived && game.ui) {
            game.ui.showRevive({
                onRevive: () => this.revive(),
                onDecline: () => this.finishGameOver()
            });
            return;
        }

        this.finishGameOver();
    }

    freezeObjects(frozen) {
        me.game.world.getChildren()
            .filter(obj => obj instanceof suikaObj)
            .forEach(obj => {
                obj.body?.setVelocity?.(0, 0);
                obj.body?.setStatic?.(frozen);
            });
    }

    // Clear the top of the jar and continue the same round.
    revive() {
        this.revived = true;

        const clearLine = game.var.dangerY + 170;

        me.game.world.getChildren()
            .filter(obj => obj instanceof suikaObj)
            .forEach(obj => {
                if (obj.getBounds().top < clearLine) {
                    melon.object.spawn("exp", {
                        x: obj.pos.x,
                        y: obj.pos.y,
                        tint: "#FFFFFF",
                        inspectors: { scale: { x: 3, y: 3 } }
                    });
                    melon.object.destroy(obj);
                }
            });

        this.freezeObjects(false);

        game.var.dangerTime = 0;
        game.var.isDanger = false;
        game.var.isGameOver = false;
    }

    finishGameOver() {

        game.var.finalScore =
            game.var.scoreValue;

        const level =
            String(game.var.currentLevel).toUpperCase();

        game.achievement?.onGameOver({
            score:
                game.var.finalScore
        });

        game.meta.countGame();

        // =========================
        // RESULT CALCULATION
        // =========================

        const rewardCoin =
            Math.floor(
                Math.sqrt(game.var.finalScore) * 0.5
            );

        game.var.rewardCoin = rewardCoin;

        game.meta.addCoins(rewardCoin);

        // Worlds open from the best score of the previous one.
        const unlocked =
            this.lockedAtStart && game.meta.isUnlocked(this.lockedAtStart)
                ? this.lockedAtStart
                : null;

        const objects =
            game.var.suikaLevels[level] || [];

        game.ui.showResult({
            level,
            score: game.var.finalScore,
            bestBefore: game.var.bestAtStart || 0,
            coins: rewardCoin,
            biggest: objects[(game.var.roundMaxLevel || 0) - 1] || null,
            unlocked
        });
    }

    startLevelBGM() {
        const bgmName =
            `${String(game.var.currentLevel).toUpperCase()}_BGM`;

        // World BGMs load lazily; start once this one is ready,
        // but only if the player is still in this world.
        if (!game.var.audioReady[bgmName]) {
            game.util.ensureAudio(bgmName, (ok) => {
                if (
                    ok &&
                    melon.scene.current() === "Gameplay" &&
                    `${String(game.var.currentLevel).toUpperCase()}_BGM` === bgmName
                ) {
                    this.startLevelBGM();
                }
            });
            return;
        }

        const bgm = game.var.currentBGM;

        // Kalau ada BGM lama
        if (
            bgm.playing &&
            bgm.id !== null
        ) {
            melon.audio.stop(
                bgm.name,
                bgm.id
            );
        }

        bgm.name = bgmName;

        // Mulai dari volume 0
        bgm.id =
            melon.audio.play(
                bgmName,
                { loop: true, volume: 0 }
            );

        bgm.playing = true;
        bgm.fadingOut = false;

        // Fade in
        melon.audio.fade(
            bgmName,
            0,
            0.2,
            bgm.fadeDuration,
            bgm.id
        );
    }
    
    stopLevelBGM() {
        const bgm = game.var.currentBGM;

        if (
            !bgm ||
            !bgm.playing ||
            bgm.id === null
        ) {
            return;
        }

        if (bgm.fadingOut) {
            return;
        }

        bgm.fadingOut = true;

        const id = bgm.id;
        const name = bgm.name;
        const duration = bgm.fadeDuration;

        // Fade out
        melon.audio.fade(
            name,
            0.2,
            0,
            duration,
            id
        );

        // Stop setelah fade selesai
        melon.time.after(
            duration,
            () => {
                // Pastikan masih instance yang sama
                if (
                    bgm.id !== id ||
                    !bgm.fadingOut
                ) {
                    return;
                }

                melon.audio.stop(
                    name,
                    id
                );

                bgm.id = null;
                bgm.name = null;
                bgm.playing = false;
                bgm.fadingOut = false;
            }
        );
    }
    
    resetBlowerParticles() {

        const names = [
            "suikaWhooshPushRight",
            "suikaWhooshPushLeft",
            "suikaWhooshPushUp"
        ];

        game.var.blowerParticles = {};


        for (const name of names) {

            const particle =
                me.game.world.getChildByName(name)[0];

            if (!particle) continue;


            const system =
                particle.runtime?.system;

            if (!system) continue;


            // PENTING:
            // baru masuk level / restart = particle harus benar-benar idle
            system.stop("clear");


            if (name === "suikaWhooshPushRight") {
                game.var.blowerParticles.left = particle;
            }

            else if (name === "suikaWhooshPushLeft") {
                game.var.blowerParticles.right = particle;
            }

            else if (name === "suikaWhooshPushUp") {
                game.var.blowerParticles.bottom = particle;
            }
        }
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
