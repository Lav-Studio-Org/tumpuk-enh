import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
let __suikaUidCounter = 0;
//  End of user code  //

export default class suikaObj extends me.Sprite {
	constructor(x, y, settings = {}) {
		settings.image = settings.image || game.textureMap.get('image')
		settings.imageLists = settings.imageLists || [];
		game.util.__populateAtlasIndices(settings.imageLists, settings);
		settings.anchorPoint = { x: 0.5, y: 0.5 };
		settings.overrideAnchor = false;

        // Put user code here //
        settings.inspectors = settings.inspectors || {};

        const currentLevel =
            String(game.var.currentLevel || "KEBUN").toUpperCase();

        const objectIndex =
            Math.max(0, (settings.objLevel ?? 1) - 1);

        const objectScale =
            game.util.getSuikaScale(currentLevel, objectIndex);

        settings.inspectors.scale = {
            x: objectScale,
            y: objectScale
        };
        //  End of user code  //

		super(x, y, Object.assign(settings));
		delete settings.image;


		/* Extract inspector values */
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };
		const flip = inspectors.flip || { x: false, y: false };

		/* Handle configuration data for the object */
		this.alpha = alpha;
		this.floating = false;
		this.alwaysUpdate = false;
		this.updateWhenPaused = false;
		this.isPersistent = false;

		/* Apply scaling */
		this.scale(scale.x, scale.y);
		this._scaleX = scale.x;
		this._scaleY = scale.y;

		/* Apply flipping on X and/or Y axis */
		this.flipX(flip.x);
		this.flipY(flip.y);

		this._pointerDownHandler = me.input.registerPointerEvent("pointerdown", this, this.onClick.bind(this));

		/* Configure object body for collision behavior */
		this.isKinematic = false;


		/* Collision Shapes */
		const sX = inspectors.scale?.x ?? 1;
		const sY = inspectors.scale?.y ?? 1;
		const bodyShapeOriginX = Number.isFinite(this.width) ? this.width * this.anchorPoint.x * (1 - sX) : 0;
		const bodyShapeOriginY = Number.isFinite(this.height) ? this.height * this.anchorPoint.y * (1 - sY) : 0;
		this.bodyDef = {
			type: "dynamic",
			shapes: [],
			collisionType: me.collision.types.ALL_OBJECT,
			collisionMask: me.collision.types.ALL_OBJECT,
			gravityScale: 0,
			restitution: 0,
			frictionAir: { x: 0, y: 0 },
			maxVelocity: { x: 490, y: 490 },
			isSensor: false,
			fixedRotation: false
		};
		melon.collision.prepareBody(this);
		this.var = {};

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
        // Put user code here //
        this._uid = __suikaUidCounter++;
		this._merging = false;

        this._comboChain =
            Number(settings.comboChain) || 0;

        this._comboExpireAt =
            Number(settings.comboExpireAt) || 0;
        
        this._mergeState = null;

        this._mergeVisualX = 1;
        this._mergeVisualY = 1;

        this._spawnPopTween = null;
        this._spawnPopScale = 1;

		this.objLevel = settings.objLevel ?? 1;
        this.scale(1/scale.x, 1/scale.y);
        this.isSkillHover = false;

        this.gameOverEligible = false;
        this.spawnAge = 0;
        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
        // Put user code here //
        this._pointerEnterHandler = me.input.registerPointerEvent("pointerenter",this,this.onPointerEnter.bind(this));
        this._pointerLeaveHandler = me.input.registerPointerEvent("pointerleave",this,this.onPointerLeave.bind(this));
        //  End of user code  //
	}

	/* triggered when a Renderable is removed from the world.
	or when the scene containing it is no longer active in game */
	onDeactivateEvent() {
		me.input.releasePointerEvent("pointerdown", this, this._pointerDownHandler);
        // Put user code here //
        me.input.releasePointerEvent("pointerenter", this, this._pointerEnterHandler);
        me.input.releasePointerEvent("pointerleave", this, this._pointerLeaveHandler);
        //  End of user code  //
	}

	/* The update function in MelonJS is called on every game frame to update an object's state.
	It is commonly used for handling movement, animations, physics, and game logic.
	Returning true from this function signals that the object needs to be re-rendered. */
	update (dt){
		var drawNextFrame = super.update(dt);
		const bodyVelocity = this.body.getVelocity();
		drawNextFrame = drawNextFrame || bodyVelocity.x !== 0 || bodyVelocity.y !== 0;
        // Put user code here //
        // =========================
        // GAME OVER ELIGIBILITY
        // =========================

        this.spawnAge += dt;

        if (
            !this.gameOverEligible &&
            this.spawnAge >= 700
        ) {
            this.gameOverEligible = true;
        }

        if (this._mergeState) {
            this.updateMerge(dt);
        }
        //  End of user code  //
		return true;
	}

	onCollision(response, other, collisionInfo = response) {
		var isSolid = true;
        // Put user code here //
        
        //  End of user code  //
		return isSolid;
	}

	/* Draw this renderable (automatically called by melonJS). All draw operations for renderable are made 
	respectively to the position or transforms set or applied by the preDraw method. The main draw loop will first 
	call preDraw() to prepare the context for drawing the renderable, then draw() to draw the renderable, and 
	finally postDraw() to clear the context. If you override this method, be mindful about the drawing logic; for 
	example if you draw a shape from the draw method, you should make sure that your draw it at the 0, 0 
	coordinates. */
	draw(renderer, viewport) {
        // Put user code here //
        
        //  End of user code  //
		super.draw(renderer, viewport);
	}

	/* triggered when a collision between two objects begins. */
	onCollisionStart(response, other, collisionInfo = response) {
        // Put user code here //
        
        //  End of user code  //
	}

	/* is triggered when a collision between two objects ends. */
	onCollisionEnd(response, other, collisionInfo = response) {
        // Put user code here //
        
        //  End of user code  //
	}

	onClick(pointer) {
		if (this.ancestor && this.ancestor instanceof me.UIBaseElement && this.ancestor?.isEnable === false) return false;

        // Put user code here //
        if (
            game.var.skillActive !== "hammer" &&
            game.var.skillActive !== "bomb"
        ) {
            return true;
        }

        const baseX = this.pos.x - this.width * this.anchorPoint.x;
        const baseY = this.pos.y - this.height * this.anchorPoint.y;

        const localX = pointer.gameWorldX - baseX;
        const localY = pointer.gameWorldY - baseY;

        const hitCollision = this.bodyDef.shapes.some((shape) => {
            return shape.contains(localX, localY);
        });

        if (!hitCollision) {
            return true;
        }

        if (game.var.skillActive === "hammer") {
            game.var.skillActive = null;

            this.destroyBySkill();

            return false;
        }

        if (game.var.skillActive === "bomb") {
            this.explodeBomb();

            game.var.skillActive = null;
            game.var.bombHoverTarget = null;

            return false;
        }

        return true;
        //  End of user code  //
		return false;
	}

    // Put user code here //
    onPointerEnter() {
        if (game.var.skillActive === "bomb") {
            this.isSkillHover = true;
        }
    }

    onPointerLeave() {
        this.isSkillHover = false;
    }
    
    onCollisionStart(self, other, response, collisionInfo) {
		// Bukan object suika
		if (!(other instanceof suikaObj)) {
			return true;
		}

		// Level berbeda tidak merge
		if (other.objLevel !== this.objLevel) {
			return true;
		}

		// Salah satu sudah sedang merge
		if (this._merging || other._merging) {
			return false;
		}

		// Supaya merge cuma diproses satu object
		if (this._uid > other._uid) {
			return false;
		}

		this.mergeWith(other);

		return false;
	}

    getNextComboChain(other) {

        const now =
            me.timer.getTime();


        /*
        * Cek apakah chain milik object ini
        * masih hidup.
        */
        const thisChainValid =
            this._comboChain > 0 &&
            now <= this._comboExpireAt;


        /*
        * Cek chain object satunya.
        */
        const otherChainValid =
            other?._comboChain > 0 &&
            now <= other?._comboExpireAt;


        const thisChain =
            thisChainValid
                ? this._comboChain
                : 0;


        const otherChain =
            otherChainValid
                ? other._comboChain
                : 0;


        /*
        * Ambil chain tertinggi dari kedua parent.
        *
        * Contoh:
        *
        * normal + normal
        * 0 + 0
        * = chain 1
        *
        * hasil chain 1 + normal
        * 1 + 0
        * = chain 2
        *
        * hasil chain 4 + hasil chain 2
        * 4 + 2
        * = chain 5
        */
        return (
            Math.max(
                thisChain,
                otherChain
            ) + 1
        );
    }

    playComboSoundLegacy(chain) {

        const config =
            game.var.suikaCombo || {};


        const maxSound =
            config.maxSound ?? 14;


        const volume =
            config.volume ?? 0.9;


        /*
        * Chain boleh terus naik,
        * tetapi sound berhenti di combo (8).
        */
        const soundIndex =
            Math.min(
                Math.max(
                    chain,
                    1
                ),
                maxSound
            );


        const soundName =
            `combo (${soundIndex})`;


        melon.audio.play(
            soundName,
            {
                loop: false,
                volume: volume
            }
        );


        /*
        * Simpan global untuk UI nanti.
        *
        * Misalnya nanti:
        *
        * x2
        * CHAIN 3
        * COMBO x5
        */
        game.var.comboCount =
            chain;

        game.var.comboLastAt =
            me.timer.getTime();


    }

    playComboSoundleg() {

        const config =
            game.var.suikaCombo || {};


        const continueWindow =
            config.continueWindow ?? 1500;

        const maxSound =
            config.maxSound ?? 14;

        const volume =
            config.volume ?? 0.9;


        const now =
            me.timer.getTime();


        /*
        * =========================
        * GLOBAL COMBO
        * =========================
        *
        * Kalau merge terakhir masih
        * dalam combo window:
        *
        *   combo + 1
        *
        * Kalau sudah terlalu lama:
        *
        *   kembali ke combo 1
        */
        if (
            game.var.comboLastAt > 0 &&
            now - game.var.comboLastAt
                <= continueWindow
        ) {

            game.var.comboCount++;

        } else {

            game.var.comboCount = 1;
        }


        /*
        * Update waktu merge terakhir.
        */
        game.var.comboLastAt =
            now;


        /*
        * Combo boleh terus:
        *
        * 8
        * 9
        * 10
        * 11
        *
        * tapi karena sound cuma tersedia
        * sampai combo (8),
        *
        * chain >= 8 tetap pakai combo (8).
        */
        const soundIndex =
            Math.min(
                game.var.comboCount,
                maxSound
            );


        const soundName =
            `combo (${soundIndex})`;


        melon.audio.play(
            soundName,
            {
                loop: false,
                volume: volume
            }
        );




        return game.var.comboCount;
    }

    playComboSound() {

        const config =
            game.var.suikaCombo || {};


        const continueWindow =
            config.continueWindow ?? 1500;

        const baseSoundCount =
            config.baseSoundCount ?? 8;

        const volume =
            config.volume ?? 0.9;


        const now =
            me.timer.getTime();


        /*
        * =========================
        * GLOBAL COMBO
        * =========================
        */
        if (
            game.var.comboLastAt > 0 &&
            now - game.var.comboLastAt <=
                continueWindow
        ) {

            game.var.comboCount++;

        } else {

            game.var.comboCount = 1;
        }


        game.var.comboLastAt =
            now;


        const combo =
            game.var.comboCount;


        /*
        * =========================
        * SOUND + PITCH
        * =========================
        */

        let soundName;
        let pitchRate = 1;


        /*
        * Combo 1 - 8:
        *
        * File asli sudah:
        *
        * 1 = Do
        * 2 = Re
        * 3 = Mi
        * 4 = Fa
        * 5 = Sol
        * 6 = La
        * 7 = Si
        * 8 = Do
        */
        if (
            combo <=
            baseSoundCount
        ) {

            soundName =
                `combo (${combo})`;

            pitchRate = 1;

        } else {

            /*
            * =========================
            * COMBO 9+
            * =========================
            *
            * Selalu gunakan combo (8)
            * sebagai nada DO dasar.
            *
            *
            * Combo 9  = Re
            * Combo 10 = Mi
            * Combo 11 = Fa
            * Combo 12 = Sol
            * Combo 13 = La
            * Combo 14 = Si
            * Combo 15 = Do
            *
            * kemudian ulang:
            *
            * Combo 16 = Re
            * Combo 17 = Mi
            * ...
            */

            soundName =
                `combo (${baseSoundCount})`;


            /*
            * Tangga nada mayor.
            *
            * Dihitung relatif dari DO
            * milik combo (8).
            *
            * Re  = +2 semitone
            * Mi  = +4
            * Fa  = +5
            * Sol = +7
            * La  = +9
            * Si  = +11
            * Do  = +12
            */
            const scaleSemitones = [
                2,   // Re
                4,   // Mi
                5,   // Fa
                7,   // Sol
                9,   // La
                11,  // Si
                12   // Do
            ];


            /*
            * Combo 9 harus index 0.
            *
            * 9  -> 0 -> Re
            * 10 -> 1 -> Mi
            * ...
            * 15 -> 6 -> Do
            *
            * 16 -> 0 -> Re
            */
            const scaleIndex =
                (
                    combo -
                    (
                        baseSoundCount + 1
                    )
                ) %
                scaleSemitones.length;


            const semitones =
                scaleSemitones[
                    scaleIndex
                ];


            /*
            * Konversi semitone
            * menjadi playback rate.
            *
            * 2^(semitone / 12)
            */
            pitchRate =
                Math.pow(
                    2,
                    semitones / 12
                );
        }


        /*
        * =========================
        * PLAY SOUND
        * =========================
        */

        const audioId =
            melon.audio.play(
                soundName,
                {
                    loop: false,
                    volume: volume
                }
            );


        /*
        * Combo 9+ baru perlu
        * playback-rate modification.
        *
        * Combo 1-8 tetap sound asli.
        */
        if (
            combo >
            baseSoundCount &&
            typeof me.audio.rate ===
                "function"
        ) {

            me.audio.rate(
                soundName,
                pitchRate,
                audioId
            );
        }


        /*
        * =========================
        * DEBUG
        * =========================
        */

        const noteNames = [
            "Re",
            "Mi",
            "Fa",
            "Sol",
            "La",
            "Si",
            "Do"
        ];


        let noteName;


        if (
            combo <=
            baseSoundCount
        ) {

            const originalNotes = [
                "Do",
                "Re",
                "Mi",
                "Fa",
                "Sol",
                "La",
                "Si",
                "Do"
            ];


            noteName =
                originalNotes[
                    combo - 1
                ];

        } else {

            const noteIndex =
                (
                    combo -
                    (
                        baseSoundCount + 1
                    )
                ) %
                noteNames.length;


            noteName =
                noteNames[
                    noteIndex
                ];
        }




        return combo;
    }

    playComboSound() {

    const config =
        game.var.suikaCombo || {};


    const continueWindow =
        config.continueWindow ?? 1500;

    const baseSoundCount =
        config.baseSoundCount ?? 8;

    const volume =
        config.volume ?? 0.9;

    const maxRate =
        config.maxRate ?? 4.0;


    const now =
        me.timer.getTime();


    /*
     * =========================
     * GLOBAL COMBO
     * =========================
     */
    if (
        game.var.comboLastAt > 0 &&
        now - game.var.comboLastAt <=
            continueWindow
    ) {

        game.var.comboCount++;

    } else {

        game.var.comboCount = 1;
    }


    game.var.comboLastAt =
        now;


    const combo =
        game.var.comboCount;


    /*
     * =========================
     * SOUND + PITCH
     * =========================
     */

    let soundName;
    let pitchRate = 1;
    let noteName = "";


    /*
     * Combo 1 - 8
     * pakai file masing-masing.
     */
    if (
        combo <=
        baseSoundCount
    ) {

        soundName =
            `combo (${combo})`;


        const originalNotes = [
            "Do",
            "Re",
            "Mi",
            "Fa",
            "Sol",
            "La",
            "Si",
            "Do"
        ];


        noteName =
            originalNotes[
                combo - 1
            ];


        pitchRate = 1;

    } else {

        /*
         * Combo 9+ menggunakan combo (8)
         * sebagai DO dasar.
         */
        soundName =
            `combo (${baseSoundCount})`;


        /*
         * Tangga nada mayor:
         *
         * Do = 0
         * Re = 2
         * Mi = 4
         * Fa = 5
         * Sol = 7
         * La = 9
         * Si = 11
         *
         * Lalu octave berikutnya
         * ditambah 12 semitone.
         */
        const majorScale = [
            0,
            2,
            4,
            5,
            7,
            9,
            11
        ];


        const noteNames = [
            "Do",
            "Re",
            "Mi",
            "Fa",
            "Sol",
            "La",
            "Si"
        ];


        /*
         * Combo 8 = Do awal.
         *
         * Combo 9:
         * step = 1 → Re
         *
         * Combo 15:
         * step = 7 → Do octave berikutnya
         */
        const step =
            combo -
            baseSoundCount;


        /*
         * Posisi dalam tangga nada.
         */
        const degree =
            step % 7;


        /*
         * Octave ke berapa.
         */
        const octave =
            Math.floor(
                step / 7
            );


        /*
         * Hitung semitone.
         */
        const semitones =
            majorScale[
                degree
            ] +
            octave * 12;


        /*
         * Konversi semitone → rate.
         */
        pitchRate =
            Math.pow(
                2,
                semitones / 12
            );


        /*
         * Jangan lewat maxRate config.
         */
        pitchRate =
            Math.min(
                pitchRate,
                maxRate
            );


        noteName =
            noteNames[
                degree
            ];
    }


    /*
     * =========================
     * PLAY
     * =========================
     */

    const audioId =
        melon.audio.play(
            soundName,
            {
                loop: false,
                volume: volume
            }
        );


    /*
     * Combo 9+ baru diubah pitch.
     */
    if (
        combo >
        baseSoundCount &&
        typeof me.audio.rate ===
            "function"
    ) {

        me.audio.rate(
            soundName,
            pitchRate,
            audioId
        );
    }




    return combo;
}

    mergeWith(other) {

        this._merging = true;
        other._merging = true;

        // const comboChain =
        //     this.getNextComboChain(other);

        /*
        * Kalau salah satu sedang spawn-pop,
        * normalkan scale dulu.
        */
        this.cancelSpawnPop();
        other.cancelSpawnPop();


        this._mergeVisualX = 1;
        this._mergeVisualY = 1;

        other._mergeVisualX = 1;
        other._mergeVisualY = 1;


        /*
        * this = anchor / object yang "menelan".
        */
        const targetX =
            this.pos.x;

        const targetY =
            this.pos.y;


        this.gameOverEligible = false;
        other.gameOverEligible = false;


        this.prepareForMerge(true);
        other.prepareForMerge(false);


        /*
        * Arah swirl dibuat deterministik.
        *
        * Jadi tidak random/random flicker.
        */
        const swirlDirection =
            (
                (
                    this._uid +
                    other._uid
                ) % 2 === 0
            )
                ? 1
                : -1;


        this._mergeState = {
            other,

            targetX,
            targetY,

            elapsed: 0,

            phase: "delay",
            delayElapsed: 0,

            compressElapsed: 0,

            swirlDirection,
            
            // comboChain
        };
    }

    prepareForMerge(isAnchor = false) {
        const body = this.body;

        if (!body) {
            return;
        }

        // Hilangkan sisa momentum.
        body.setVelocity?.(0, 0);
        body.setAngularVelocity?.(0);

        // Selama proses merge jangan dipengaruhi gravity.
        body.setGravityScale?.(0);

        // Jangan bertabrakan lagi selama sedang disedot.
        body.setSensor?.(true);
        body.setCollisionMask?.(0);

        /*
        * Object-object kamu banyak yang menggunakan compound body.
        * Jadi collision setiap part juga harus dimatikan.
        */
        if (Array.isArray(body.parts)) {

            for (const part of body.parts) {

                part.isSensor = true;

                if (part.collisionFilter) {
                    part.collisionFilter.mask = 0;
                }
            }
        }

        /*
        * Object yang menjadi pusat absorb harus benar-benar diam.
        */
        if (isAnchor) {
            body.setStatic?.(true);
        }
    }


    updateMerge(dt) {

        const state =
            this._mergeState;


        if (!state) {
            return;
        }


        const other =
            state.other;


        if (
            !other ||
            !other.body
        ) {

            this._mergeState = null;

            return;
        }


        const config =
            game.var.suikaMerge || {};


        const duration =
            config.duration ?? 165;

        const pullStrength =
            config.pullStrength ?? 0.30;

        const maxSpeed =
            config.maxSpeed ?? 23;

        const finishDistance =
            config.finishDistance ?? 7;

        const swirlStrength =
            config.swirlStrength ?? 3.5;

        const compressDuration =
            config.compressDuration ?? 42;

        const absorbedScale =
            config.absorbedScale ?? 0.64;

        const absorbedAlpha =
            config.absorbedAlpha ?? 0.55;

        const anchorPulse =
            config.anchorPulse ?? 0.09;

        const mergeDelay =
            config.mergeDelay ?? 0;

        /*
        * ===============================
        * PHASE 0
        *
        * THINK / HOLD
        * ===============================
        */
        if (
            state.phase === "delay"
        ) {

            state.delayElapsed += dt;

            /*
            * Kedua object benar-benar berhenti dulu.
            */
            this.body?.setVelocity?.(
                0,
                0
            );

            other.body?.setVelocity?.(
                0,
                0
            );


            /*
            * Micro pulse supaya bukan terlihat lag.
            */
            const progress =
                Math.min(
                    1,
                    state.delayElapsed /
                    Math.max(
                        mergeDelay,
                        1
                    )
                );


            const pulse =
                Math.sin(
                    progress *
                    Math.PI
                ) * 0.025;


            this.setMergeVisualScale(
                1 + pulse,
                1 - pulse
            );


            other.setMergeVisualScale(
                1 - pulse,
                1 + pulse
            );


            if (
                state.delayElapsed >=
                mergeDelay
            ) {

                /*
                * Normalize dulu sebelum pull.
                */
                this.setMergeVisualScale(
                    1,
                    1
                );

                other.setMergeVisualScale(
                    1,
                    1
                );


                state.phase =
                    "pull";

                state.elapsed =
                    0;
            }


            return;
        }

        /*
        * ===============================
        * PHASE 1
        *
        * VACUUM / PULL
        * ===============================
        */
        if (
            state.phase === "pull"
        ) {

            state.elapsed += dt;


            const progress =
                Math.min(
                    1,
                    state.elapsed /
                    duration
                );


            /*
            * Smoothstep.
            *
            * Lebih organic daripada linear.
            */
            const eased =
                progress *
                progress *
                (
                    3 -
                    2 * progress
                );


            const dx =
                state.targetX -
                other.pos.x;

            const dy =
                state.targetY -
                other.pos.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            /*
            * Normalized direction.
            */
            let nx = 0;
            let ny = 0;


            if (
                distance > 0.001
            ) {

                nx =
                    dx /
                    distance;

                ny =
                    dy /
                    distance;
            }


            /*
            * Arah perpendicular.
            *
            * Membuat object sedikit melengkung
            * sebelum masuk ke anchor.
            */
            const perpendicularX =
                -ny;

            const perpendicularY =
                nx;


            /*
            * Swirl kuat di tengah animasi,
            * hilang saat mendekati pusat.
            */
            const swirlCurve =
                Math.sin(
                    progress *
                    Math.PI
                );


            const swirl =
                swirlCurve *
                swirlStrength *
                state.swirlDirection *
                (
                    1 -
                    eased * 0.65
                );


            /*
            * Tarikan makin kuat
            * menuju akhir.
            */
            const strength =
                pullStrength +
                eased *
                0.20;


            let vx =
                dx *
                strength;

            let vy =
                dy *
                strength;


            /*
            * Tambahkan curve / orbit kecil.
            */
            vx +=
                perpendicularX *
                swirl;

            vy +=
                perpendicularY *
                swirl;


            /*
            * Batasi speed.
            */
            const speed =
                Math.hypot(
                    vx,
                    vy
                );


            if (
                speed >
                maxSpeed &&
                speed > 0
            ) {

                const multiplier =
                    maxSpeed /
                    speed;


                vx *= multiplier;
                vy *= multiplier;
            }


            other.body.setVelocity?.(
                vx,
                vy
            );


            /*
            * Rotasi makin cepat saat
            * menuju pusat.
            */
            other.body.setAngularVelocity?.(
                (
                    0.08 +
                    eased *
                    0.34
                ) *
                state.swirlDirection
            );


            /*
            * Object yang diserap perlahan
            * mengecil.
            */
            const suckScale =
                1 -
                (
                    1 -
                    absorbedScale
                ) *
                eased;


            /*
            * Ada sedikit squash selama
            * proses vacuum.
            */
            const wobble =
                Math.sin(
                    progress *
                    Math.PI *
                    2
                ) *
                0.035 *
                (
                    1 -
                    progress
                );


            other.setMergeVisualScale(
                suckScale *
                (
                    1 +
                    wobble
                ),

                suckScale *
                (
                    1 -
                    wobble
                )
            );


            /*
            * Fade sedikit,
            * tapi jangan sampai hilang.
            */
            other.alpha =
                1 -
                (
                    1 -
                    absorbedAlpha
                ) *
                eased;



            /*
            * Anchor ikut "bernapas".
            */
            const pulse =
                Math.sin(
                    progress *
                    Math.PI
                ) *
                anchorPulse;


            this.setMergeVisualScale(
                1 + pulse,

                1 - pulse * 0.65
            );



            /*
            * Masuk fase gulp.
            */
            if (
                distance <=
                    finishDistance ||

                progress >= 1
            ) {

                state.phase =
                    "compress";

                state.compressElapsed =
                    0;


                other.body.setVelocity?.(
                    0,
                    0
                );


                other.body.setAngularVelocity?.(
                    0
                );
            }


            return;
        }



        /*
        * ===============================
        * PHASE 2
        *
        * GULP / COMPRESS
        * ===============================
        */
        if (
            state.phase ===
            "compress"
        ) {

            state.compressElapsed +=
                dt;


            const progress =
                Math.min(
                    1,

                    state.compressElapsed /
                    compressDuration
                );


            /*
            * Ease-in.
            */
            const eased =
                progress *
                progress;


            /*
            * Masih tarik object terakhir
            * sedikit menuju pusat.
            */
            const dx =
                state.targetX -
                other.pos.x;

            const dy =
                state.targetY -
                other.pos.y;


            other.body.setVelocity?.(
                dx * 0.55,
                dy * 0.55
            );


            /*
            * Object yang diserap
            * benar-benar collapse.
            */
            const finalScale =
                absorbedScale +
                (
                    0.06 -
                    absorbedScale
                ) *
                eased;


            other.setMergeVisualScale(
                finalScale,
                finalScale
            );


            other.alpha =
                absorbedAlpha *
                (
                    1 -
                    progress
                );



            /*
            * "GULP"
            *
            * Anchor membesar sebentar,
            * kemudian kembali normal.
            */
            const gulp =
                Math.sin(
                    progress *
                    Math.PI
                );


            this.setMergeVisualScale(
                1 +
                gulp * 0.16,

                1 -
                gulp * 0.10
            );


            /*
            * Selesai.
            */
            if (
                progress >= 1
            ) {

                this.finishMerge(
                    other,
                    state.targetX,
                    state.targetY,
                    // state.comboChain ?? 1
                );
            }
        }
    }

    finishMerge(other, spawnX, spawnY, comboChain = 1) {

        /*
        * Matikan controller terlebih dahulu.
        * Mencegah finish dipanggil dua kali.
        */
        this._mergeState = null;


        const currentLevel =
            String(
                game.var.currentLevel ||
                "KEBUN"
            ).toUpperCase();


        const objectList =
            game.var.suikaLevels[
                currentLevel
            ];


        if (!objectList) {

            console.error(
                "Suika level config tidak ditemukan:",
                currentLevel
            );

            return;
        }


        const currentIndex =
            this.objLevel - 1;

        const nextIndex =
            currentIndex + 1;

        const nextObject =
            objectList[nextIndex];


        const score =
            5 *
            Math.pow(
                2,
                currentIndex
            );


        /*
        * BARU sekarang dua object lama dihilangkan.
        */
        melon.object.destroy(this);
        melon.object.destroy(other);

        const comboCount =
            this.playComboSound();

        game.achievement?.onMerge({

            level:
                currentLevel,

            /*
            * nextIndex itu array index.
            *
            * objLevel game kamu 1 - 11,
            * jadi +1.
            */
            createdObjLevel:
                nextObject
                    ? nextIndex + 1
                    : 0,

            comboCount
        });
        
        if (comboCount >= 2) {
            melon.object.spawn(
                "comboParticle",
                {
                    x:
                        spawnX +
                        (
                            Math.random() *
                            18 -
                            9
                        ),

                    y:
                        spawnY -
                        30,

                    z:
                        9999,

                    settings: {

                        count:
                            comboCount,

                        lifetime:
                            850,

                        floatDistance:
                            72
                    }
                }
            );
        }

        /*
        * Spawn evolusi tepat di titik object anchor.
        */
        if (nextObject) {

            const tints =
                game.var.suikaTints[
                    currentLevel
                ];

            const particleTint =
                tints?.[nextIndex] ??
                "#FFFFFF";

            // this.playComboSound(
            //     comboChain
            // );

            const comboConfig =
                game.var.suikaCombo || {};


            const comboWindow =
                comboConfig.continueWindow ??
                1500;

            /*
            * Hasil evolusi membawa chain
            * dari merge yang baru selesai.
            */
            const evolvedObject =
                melon.object.spawn(
                    nextObject,
                    {
                        x: spawnX,
                        y: spawnY,

                        // comboChain:
                        //     comboChain,

                        // comboExpireAt:
                        //     me.timer.getTime() +
                        //     comboWindow
                    }
                );


            if (
                evolvedObject &&
                typeof evolvedObject.playSpawnPop ===
                    "function"
            ) {

                evolvedObject.playSpawnPop();
            }

            melon.object.spawn(
                "exp",
                {
                    x: spawnX,
                    y: spawnY,

                    tint:
                        particleTint,

                    inspectors: {
                        scale: {
                            x: 3,
                            y: 3
                        }
                    }
                }
            );

        } else {

            this.playComboSound(
                // comboChain
            );

            /*
            * Object level terakhir.
            */
            melon.object.spawn(
                "exp",
                {
                    x: spawnX,
                    y: spawnY,

                    tint:
                        "#FFD700",

                    inspectors: {
                        scale: {
                            x: 3,
                            y: 3
                        }
                    }
                }
            );
        }

        if (!game.var.isGameOver) {
            game.util.addScore(score);
        }
    }

    setMergeVisualScale(x, y) {

        const previousX =
            this._mergeVisualX || 1;

        const previousY =
            this._mergeVisualY || 1;


        const ratioX =
            x / previousX;

        const ratioY =
            y / previousY;


        this.scale(
            ratioX,
            ratioY
        );


        this._mergeVisualX = x;
        this._mergeVisualY = y;
    }

    resetMergeVisualScale() {

        const previousX =
            this._mergeVisualX || 1;

        const previousY =
            this._mergeVisualY || 1;


        this.scale(
            1 / previousX,
            1 / previousY
        );


        this._mergeVisualX = 1;
        this._mergeVisualY = 1;
    }

    playSpawnPop() {

        this.cancelSpawnPop();


        const config =
            game.var.suikaMerge || {};


        const startScale =
            config.popStartScale ?? 0.70;

        const duration =
            config.popDuration ?? 230;


        const tweenState = {
            value: startScale
        };


        this._spawnPopScale =
            startScale;


        /*
        * Mulai lebih kecil.
        */
        this.scale(
            startScale,
            startScale
        );


        this._spawnPopTween =
            new me.Tween(tweenState)
                .to(
                    {
                        value: 1
                    },
                    {
                        duration,

                        /*
                        * Back.Out otomatis:
                        *
                        * kecil
                        *   ↓
                        * membesar
                        *   ↓
                        * overshoot sedikit
                        *   ↓
                        * settle ke 1
                        */
                        easing:
                            me.Tween.Easing.Back.Out,

                        autoStart: true
                    }
                )
                .onUpdate(() => {

                    if (!this.ancestor) {
                        return;
                    }


                    const previous =
                        this._spawnPopScale || 1;


                    const ratio =
                        tweenState.value /
                        previous;


                    this.scale(
                        ratio,
                        ratio
                    );


                    this._spawnPopScale =
                        tweenState.value;
                })
                .onComplete(() => {

                    /*
                    * Pastikan akhirnya tepat scale 1.
                    */
                    if (this.ancestor) {

                        const previous =
                            this._spawnPopScale || 1;

                        this.scale(
                            1 / previous,
                            1 / previous
                        );
                    }


                    this._spawnPopScale = 1;
                    this._spawnPopTween = null;
                });
    }

    cancelSpawnPop() {

        if (this._spawnPopTween) {

            this._spawnPopTween.stop();

            this._spawnPopTween = null;
        }


        if (
            this._spawnPopScale &&
            this._spawnPopScale !== 1
        ) {

            const inverse =
                1 /
                this._spawnPopScale;


            this.scale(
                inverse,
                inverse
            );
        }


        this._spawnPopScale = 1;
    }

    explodeBomb() {
        const radius = 180;

        const centerX = this.pos.x;
        const centerY = this.pos.y;

        const objects = [
            ...me.game.world.getChildren()
        ];

        for (const object of objects) {

            if (!(object instanceof suikaObj)) {
                continue;
            }

            const dx =
                object.pos.x - centerX;

            const dy =
                object.pos.y - centerY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (distance <= radius) {
                object.destroyBySkill();
            }
        }
    }

    destroyBySkill() {
        const currentLevel =
            String(game.var.currentLevel || "KEBUN").toUpperCase();

        const tints =
            game.var.suikaTints[currentLevel];

        const index = this.objLevel - 1;

        const tint =
            tints?.[index] ?? "#FFFFFF";

        // score object ini = score saat object sebelumnya merge menjadi object ini
        const score =
            this.objLevel <= 1
                ? 0
                : 5 * Math.pow(2, this.objLevel - 2);

        const x = this.pos.x;
        const y = this.pos.y;

        // Sound effect sama seperti merge
        // melon.audio.play(currentLevel, {
        //     loop: false,
        //     volume: 1
        // });

        this.playComboSound();

        // Effect ledakan
        melon.object.spawn(
            "exp",
            {
                x: x,
                y: y,
                tint: tint,
                inspectors: {
                    scale: {
                        x: 3,
                        y: 3
                    }
                }
            }
        );

        if (!game.var.isGameOver) game.util.addScore(score);

        melon.object.destroy(this);
    }

    draw(renderer) {
        super.draw(renderer);

        if (
            game.var.skillActive !== "bomb" ||
            game.var.bombHoverTarget !== this
        ) {
            return;
        }

        const radius = 180;

        renderer.save();

        renderer.setColor("rgba(255, 0, 0, 0.15)");

        renderer.fillEllipse(
            this.pos.x + this.width/2,
            this.pos.y + this.height/2,
            radius*2,
            radius*2
        );

        renderer.setColor("#ff0000");

        renderer.strokeEllipse(
            this.pos.x + this.width/2,
            this.pos.y + this.height/2,
            radius*2,
            radius*2
        );

        renderer.restore();
    }

    getComboScaleRate(combo) {

        /*
        * Combo 1 - 8 sudah punya
        * file Do Re Mi Fa Sol La Si Do.
        */
        if (combo <= 8) {
            return 1;
        }


        /*
        * Tangga nada mayor dari Do:
        *
        * Do Re Mi Fa Sol La Si
        *
        * dalam semitone:
        * 0  2  4  5  7  9  11
        */
        const majorScale = [
            0,
            2,
            4,
            5,
            7,
            9,
            11
        ];


        /*
        * Combo 8 adalah Do awal.
        *
        * combo 9:
        * step = 1
        *
        * combo 15:
        * step = 7
        */
        const step =
            combo - 8;


        const octave =
            Math.floor(
                step / 7
            );


        const degree =
            step % 7;


        const semitones =
            octave * 12 +
            majorScale[degree];


        /*
        * Konversi semitone ke playback rate.
        */
        return Math.pow(
            2,
            semitones / 12
        );
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
