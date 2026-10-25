import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
 
//  End of user code  //

export default class achievementPopup extends me.Renderable{
	constructor(x, y, settings = {}){
		settings.width = settings.width || 325;
		settings.height = settings.height || 82;
		settings.anchorPoint = {
			x: 0,
			y: 0
		};

        // Put user code here //
        
        //  End of user code  //

		super(x, y, settings.width, settings.height);


		/* Extract inspector values */
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };
		const flip = inspectors.flip || { x: false, y: false };
		const rotation = inspectors.rotate || 0;

		/* Handle configuration data for the object */
		this.alpha = alpha;
		this.floating = true;
		this.alwaysUpdate = true;
		this.updateWhenPaused = true;
		this.isPersistent = false;

		/* Apply rotation */
		this.rotate(rotation);
		this._rotation = rotation;

		/* Apply scaling */
		this.scale(scale.x, scale.y);
		this._scaleX = scale.x;
		this._scaleY = scale.y;

		/* Apply flipping on X and/or Y axis */
		this.flipX(flip.x);
		this.flipY(flip.y);
		this.anchorPoint.set(settings.anchorPoint.x, settings.anchorPoint.y);

		this.var = {};
		this.color = "#ffffff"
		this.roundLevel = 10
		this.shapeType = "empty"

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
        // Put user code here //
        this.pos.z =
            settings.z ??
            20000;


        /*
         * =========================
         * ACHIEVEMENT DATA
         * =========================
         */
        this.var.data =
            settings.achievement ||
            {};


        /*
         * =========================
         * ANIMATION
         * =========================
         */
        this.var.elapsed = 0;

        this.var.enterDuration = 300;

        this.var.holdDuration = 2200;

        this.var.exitDuration = 350;


        this.var.totalDuration =
            this.var.enterDuration +
            this.var.holdDuration +
            this.var.exitDuration;


        this.var.finished = false;


        /*
         * posisi awal
         */
        this.var.slideDistance =
            80;


        this.alpha = 0;


        /*
         * =========================
         * TEXT
         * =========================
         */

        this.unlockText =
            new me.Text(
                0,
                0,
                {
                    font:
                        "Super Bouncer",

                    size:
                        9,

                    fillStyle:
                        "#A55A20",

                    textAlign:
                        "left",

                    textBaseline:
                        "top",

                    bold:
                        true,

                    text:
                        ""
                }
            );


        this.titleText =
            new me.Text(
                0,
                0,
                {
                    font:
                        "Super Bouncer",

                    size:
                        17,

                    fillStyle:
                        "#60371F",

                    textAlign:
                        "left",

                    textBaseline:
                        "top",

                    bold:
                        true,

                    text:
                        ""
                }
            );


        this.descriptionText =
            new me.Text(
                0,
                0,
                {
                    font:
                        "Super Bouncer",

                    size:
                        9,

                    fillStyle:
                        "#7A5A42",

                    textAlign:
                        "left",

                    textBaseline:
                        "top",

                    wordWrapWidth:
                        165,

                    text:
                        ""
                }
            );


        this.rewardText =
            new me.Text(
                0,
                0,
                {
                    font:
                        "Super Bouncer",

                    size:
                        10,

                    fillStyle:
                        "#FFFFFF",

                    textAlign:
                        "center",

                    textBaseline:
                        "top",

                    bold:
                        true,

                    text:
                        ""
                }
            );


        this.iconText =
            new me.Text(
                0,
                0,
                {
                    font:
                        "Super Bouncer",

                    size:
                        26,

                    fillStyle:
                        "#FFE166",

                    textAlign:
                        "center",

                    textBaseline:
                        "middle",

                    text:
                        "★"
                }
            );

        
        /*
         * Set posisi pertama.
         */
        this.updatePosition(
            0
        );
        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
        // Put user code here //
        
        //  End of user code  //
	}

	/* triggered when a Renderable is removed from the world.
	or when the scene containing it is no longer active in game */
	onDeactivateEvent() {
        // Put user code here //
        
        //  End of user code  //
	}

	/* The update function in MelonJS is called on every game frame to update an object's state.
	It is commonly used for handling movement, animations, physics, and game logic.
	Returning true from this function signals that the object needs to be re-rendered. */
	update (dt){
		var drawNextFrame = super.update(dt);
        // Put user code here //
        
        //  End of user code  //
		return true;
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
		renderer.setColor(this.color);
		switch (this.shapeType) {
			case "rect":
				renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
				break;

			case "roundrect":
				renderer.fillRoundRect(this.pos.x, this.pos.y, this.width, this.height, this.roundLevel);
				break;

			case "ellipse":
				let radius = Math.min(this.width, this.height) / 2;
				let centerX = this.pos.x + this.width / 2;
				let centerY = this.pos.y + this.height / 2;
				renderer.fillArc(centerX, centerY, radius, 0, Math.PI * 2, false);
				break;

			case "empty":
				break;

			default:
				console.warn(`Unknown shapeType: ${this.shapeType}`);
				renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
				break;
		}
	}

    // Put user code here //
    /*
     * =====================================================
     * FLEX HEIGHT OFFSET
     * =====================================================
     */
    getFlexOffsetY() {

        /*
         * Kalau helper yang kemarin
         * sudah kamu buat.
         */
        if (
            game.util
                .getFlexOffsetY
        ) {

            return game.util
                .getFlexOffsetY();
        }


        /*
         * fallback
         */
        const designHeight =
            960;


        return (
            me.game.viewport.height -
            designHeight
        ) / 2;
    }


    /*
     * =====================================================
     * TARGET POSITION
     * =====================================================
     */
    getTargetY() {

        return (
            this.getFlexOffsetY() +
            180
        );
    }


    /*
     * =====================================================
     * UPDATE POSITION
     * =====================================================
     */
    updatePosition(slideOffset = 0) {

        this.pos.x =
            (
                me.game.viewport.width -
                this.width
            ) / 2
            - 90
            + slideOffset;


        this.pos.y =
            this.getTargetY();
    }


    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */
    update(dt) {

        this.var.elapsed +=
            dt;


        const elapsed =
            this.var.elapsed;


        const enter =
            this.var.enterDuration;


        const holdEnd =
            enter +
            this.var.holdDuration;


        const total =
            this.var.totalDuration;


        /*
         * =========================
         * ENTER
         * =========================
         */
        if (
            elapsed < enter
        ) {

            const p =
                Math.min(
                    1,
                    elapsed /
                    enter
                );


            /*
             * cubic ease out
             */
            const eased =
                1 -
                Math.pow(
                    1 - p,
                    3
                );


            const slide =
                -this.var.slideDistance *
                (
                    1 -
                    eased
                );


            this.alpha =
                eased;


            this.updatePosition(
                slide
            );
        }


        /*
         * =========================
         * HOLD
         * =========================
         */
        else if (
            elapsed < holdEnd
        ) {

            this.alpha = 1;


            this.updatePosition(
                0
            );
        }


        /*
         * =========================
         * EXIT
         * =========================
         */
        else {

            const exitElapsed =
                elapsed -
                holdEnd;


            const exitDuration =
                this.var.exitDuration;


            const p =
                Math.min(
                    1,
                    exitElapsed /
                    exitDuration
                );


            /*
             * Naik sedikit sambil fade.
             */
            const eased =
                p * p;


            this.alpha =
                1 -
                eased;


            this.updatePosition(
                -30 *
                eased
            );
        }


        /*
         * =========================
         * FINISH
         * =========================
         */
        if (
            elapsed >= total
        ) {

            this.finish();

            return false;
        }


        return true;
    }

    /*
     * =====================================================
     * DRAW
     * =====================================================
     */
draw(renderer) {

    const data =
        this.var.data;

    const alpha =
        Math.max(
            0,
            Math.min(
                1,
                this.alpha
            )
        );

    const reward =
        Math.max(
            0,
            Number(
                data.rewardCoin
            ) || 0
        );


    /*
     * Semua isi popup setelah ini
     * relatif terhadap this.pos.
     */
    renderer.save();

    renderer.translate(
        this.pos.x,
        this.pos.y
    );


    renderer.setGlobalAlpha(
        renderer.globalAlpha() *
        alpha
    );


    /*
     * =========================
     * SHADOW
     * =========================
     */
    renderer.save();

    renderer.setGlobalAlpha(
        renderer.globalAlpha() *
        0.28
    );

    renderer.setColor(
        "#000000"
    );

    renderer.fillRoundRect(
        4,
        6,
        this.width,
        this.height,
        16
    );

    renderer.restore();


    /*
     * =========================
     * GOLD OUTER BORDER
     * =========================
     */
    renderer.setColor(
        "#C77924"
    );

    renderer.fillRoundRect(
        0,
        0,
        this.width,
        this.height,
        16
    );


    /*
     * =========================
     * SECOND BORDER
     * =========================
     */
    renderer.setColor(
        "#F2B94B"
    );

    renderer.fillRoundRect(
        3,
        3,
        this.width - 6,
        this.height - 6,
        14
    );


    /*
     * =========================
     * MAIN PANEL
     * =========================
     */
    renderer.setColor(
        "#FFF1C8"
    );

    renderer.fillRoundRect(
        6,
        6,
        this.width - 12,
        this.height - 12,
        12
    );


    /*
     * =========================
     * ICON
     * =========================
     */
    renderer.setColor(
        "#985326"
    );

    renderer.fillRoundRect(
        13,
        15,
        52,
        52,
        12
    );


    renderer.setColor(
        "#B86E2A"
    );

    renderer.fillRoundRect(
        17,
        19,
        44,
        44,
        10
    );


    this.iconText.draw(
        renderer,
        "★",
        39,
        41
    );


    /*
     * =========================
     * HEADER
     * =========================
     */
    this.unlockText.draw(
        renderer,
        "ACHIEVEMENT UNLOCKED!",
        76,
        9
    );


    /*
     * =========================
     * TITLE
     * =========================
     */
    this.titleText.draw(
        renderer,
        data.title ||
        "Achievement",
        76,
        26
    );


    /*
     * =========================
     * DESCRIPTION
     * =========================
     */
    this.descriptionText.draw(
        renderer,
        data.description ||
        "",
        76,
        53
    );


    /*
     * =========================
     * REWARD
     * =========================
     */
    if (
        reward > 0
    ) {

        const badgeWidth = 72;
        const badgeHeight = 20;

        const badgeX =
            this.width -
            badgeWidth -
            11;

        const badgeY =
            this.height -
            badgeHeight -
            9;


        renderer.save();

        renderer.setGlobalAlpha(
            renderer.globalAlpha() *
            0.2
        );

        renderer.setColor(
            "#000000"
        );

        renderer.fillRoundRect(
            badgeX + 1,
            badgeY + 2,
            badgeWidth,
            badgeHeight,
            9
        );

        renderer.restore();


        renderer.setColor(
            "#C97720"
        );

        renderer.fillRoundRect(
            badgeX,
            badgeY,
            badgeWidth,
            badgeHeight,
            9
        );


        renderer.setColor(
            "#E49B35"
        );

        renderer.fillRoundRect(
            badgeX + 2,
            badgeY + 2,
            badgeWidth - 4,
            5,
            4
        );


        this.rewardText.draw(
            renderer,

            `+${reward.toLocaleString(
                "id-ID"
            )}`,

            badgeX +
            badgeWidth / 2,

            badgeY + 3
        );
    }


    /*
     * Restore translation + alpha.
     */
    renderer.restore();
}

    /*
     * =====================================================
     * FINISH
     * =====================================================
     */
    finish() {

        if (
            this.var.finished
        ) {
            return;
        }


        this.var.finished =
            true;


        /*
         * Beritahu queue manager
         * bahwa popup selesai.
         */
        game.util
            .finishAchievementPopup
            ?.(
                this
            );


        if (
            this.ancestor
        ) {

            me.game.world.removeChild(
                this
            );
        }
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
