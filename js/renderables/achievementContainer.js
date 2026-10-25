import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //

//  End of user code  //

export default class achievementContainer extends me.Renderable{
	constructor(x, y, settings = {}){
		settings.width = settings.width || 540;
		settings.height = settings.height || 960;
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
        /*
         * =========================
         * PAGINATION
         * =========================
         */
        this.page = 0;

        this.perPage = 4;

        this.achievements = [];


        /*
         * =========================
         * BUTTON AREA
         * =========================
         */
        this.closeRect = {
            x: 446,
            y: 62,
            w: 48,
            h: 48
        };


        this.prevRect = {
            x: 120,
            y: 855,
            w: 90,
            h: 48
        };


        this.nextRect = {
            x: 330,
            y: 855,
            w: 90,
            h: 48
        };


        /*
         * =========================
         * TEXT
         * =========================
         */
        this.titleText =
            this.makeText(
                28,
                "#ffffff",
                "center"
            );


        this.summaryText =
            this.makeText(
                15,
                "#d7d7d7",
                "center"
            );


        this.itemTitleText =
            this.makeText(
                18,
                "#ffffff",
                "left"
            );


        this.descriptionText =
            this.makeText(
                13,
                "#cfcfcf",
                "left",
                350
            );


        this.statusUnlockedText =
            this.makeText(
                13,
                "#8cff9b",
                "right"
            );


        this.statusLockedText =
            this.makeText(
                13,
                "#9b9b9b",
                "right"
            );


        this.progressText =
            this.makeText(
                13,
                "#ffffff",
                "left"
            );


        this.rewardText =
            this.makeText(
                13,
                "#ffd86b",
                "right"
            );


        this.buttonText =
            this.makeText(
                20,
                "#ffffff",
                "center"
            );


        this.pageText =
            this.makeText(
                14,
                "#d7d7d7",
                "center"
            );


        this.emptyText =
            this.makeText(
                16,
                "#d7d7d7",
                "center"
            );


        /*
         * =========================
         * INPUT
         * =========================
         */
        this._pointerDownHandler =
            me.input.registerPointerEvent(

                "pointerdown",

                me.game.viewport,

                this.onPointerDown.bind(
                    this
                )
            );


        this.refresh();
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
     * TEXT FACTORY
     * =====================================================
     */
    makeText(
        size,
        color,
        align = "left",
        wrap = -1
    ) {

        return new me.Text(
            0,
            0,
            {

                font:
                    "Super Bouncer",

                size,

                fillStyle:
                    color,

                textAlign:
                    align,

                textBaseline:
                    "top",

                wordWrapWidth:
                    wrap,

                floating:
                    true,

                text:
                    ""
            }
        );
    }


    /*
     * =====================================================
     * REFRESH DATA
     * =====================================================
     */
    refresh() {

        this.achievements =
            game.achievement
                ?.getAll?.() ||
            [];


        const maxPage =
            Math.max(
                0,
                this.pageCount() - 1
            );


        this.page =
            Math.min(
                this.page,
                maxPage
            );
    }


    pageCount() {

        return Math.max(
            1,

            Math.ceil(
                this.achievements.length /
                this.perPage
            )
        );
    }


    pageItems() {

        const start =
            this.page *
            this.perPage;


        return this.achievements.slice(

            start,

            start +
            this.perPage
        );
    }


    /*
     * =====================================================
     * DEACTIVATE
     * =====================================================
     */
    onDeactivateEvent() {

        me.input.releasePointerEvent(

            "pointerdown",

            me.game.viewport,

            this._pointerDownHandler
        );
    }


    update() {

        return true;
    }


    /*
     * =====================================================
     * DRAW
     * =====================================================
     */
    draw(renderer) {

        const viewportWidth =
            me.game.viewport.width;

        const viewportHeight =
            me.game.viewport.height;

        const offsetY =
            this.getFlexOffsetY();


        /*
        * =========================
        * BACKDROP
        * =========================
        *
        * Jangan ikut translate.
        * Harus menutupi seluruh layar
        * termasuk jika tingginya 1200.
        */
        renderer.save();

        renderer.setGlobalAlpha(
            renderer.globalAlpha() *
            0.72
        );

        renderer.setColor(
            "#000000"
        );

        renderer.fillRect(
            0,
            0,
            viewportWidth,
            viewportHeight
        );

        renderer.restore();


        /*
        * =========================
        * CENTER DESIGN 540x960
        * =========================
        */
        renderer.save();

        renderer.translate(
            0,
            offsetY
        );


        /*
        * Semua code draw lama kamu
        * setelah ini tetap pakai
        * koordinat 540x960.
        */

        renderer.setColor(
            "#17191f"
        );

        renderer.fillRoundRect(
            26,
            38,
            488,
            884,
            22
        );


        /*
         * Header.
         */
        renderer.setColor(
            "#252832"
        );


        renderer.fillRoundRect(
            42,
            54,
            456,
            76,
            16
        );


        this.titleText.draw(
            renderer,
            "ACHIEVEMENTS",
            270,
            68
        );


        /*
         * =========================
         * COMPLETION
         * =========================
         */
        const total =
            this.achievements.length;


        const unlocked =
            this.achievements.filter(
                item =>
                    item.unlocked
            ).length;


        const percent =
            total > 0

                ? Math.round(
                    unlocked /
                    total *
                    100
                )

                : 0;


        this.summaryText.draw(

            renderer,

            `${unlocked} / ${total} UNLOCKED  -  ${percent}%`,

            270,

            105
        );


        /*
         * =========================
         * CLOSE BUTTON
         * =========================
         */
        renderer.setColor(
            "#b33a3a"
        );


        renderer.fillRoundRect(

            this.closeRect.x,
            this.closeRect.y,

            this.closeRect.w,
            this.closeRect.h,

            12
        );


        this.buttonText.draw(
            renderer,
            "X",
            470,
            73
        );


        /*
         * =========================
         * ACHIEVEMENT LIST
         * =========================
         */
        const items =
            this.pageItems();


        if (
            items.length === 0
        ) {

            this.emptyText.draw(

                renderer,

                "No achievements configured.",

                270,

                430
            );
        }


        items.forEach(
            (
                achievement,
                index
            ) => {

                this.drawAchievement(
                    renderer,
                    achievement,
                    index
                );
            }
        );


        /*
         * =========================
         * PAGINATION
         * =========================
         */
        this.drawPagination(
            renderer
        );
    }


    /*
     * =====================================================
     * DRAW ACHIEVEMENT CARD
     * =====================================================
     */
    drawAchievement(
        renderer,
        achievement,
        index
    ) {

        const x = 44;

        const y =
            152 +
            index * 166;

        const w = 452;
        const h = 146;


        /*
         * Card.
         */
        renderer.setColor(

            achievement.unlocked

                ? "#26352b"

                : "#20232b"
        );


        renderer.fillRoundRect(
            x,
            y,
            w,
            h,
            14
        );


        /*
         * =========================
         * TITLE
         * =========================
         */
        this.itemTitleText.draw(

            renderer,

            achievement.title ||
            achievement.id ||
            "Achievement",

            x + 18,

            y + 14
        );


        /*
         * =========================
         * STATUS
         * =========================
         */
        const statusText =

            achievement.unlocked

                ? this.statusUnlockedText

                : this.statusLockedText;


        statusText.draw(

            renderer,

            achievement.unlocked
                ? "UNLOCKED"
                : "LOCKED",

            x + w - 18,

            y + 17
        );


        /*
         * =========================
         * DESCRIPTION
         * =========================
         */
        this.descriptionText.draw(

            renderer,

            achievement.description ||
            "",

            x + 18,

            y + 46
        );


        /*
         * =========================
         * PROGRESS
         * =========================
         */
        const target =
            Math.max(

                1,

                Number(
                    achievement.target
                ) || 1
            );


        const progress =
            Math.min(

                target,

                Math.max(

                    0,

                    Number(
                        achievement.progress
                    ) || 0
                )
            );


        const ratio =

            achievement.unlocked

                ? 1

                : Math.min(
                    1,
                    progress /
                    target
                );


        this.progressText.draw(

            renderer,

            `${progress.toLocaleString(
                "id-ID"
            )} / ${target.toLocaleString(
                "id-ID"
            )}`,

            x + 18,

            y + 94
        );


        /*
         * =========================
         * REWARD
         * =========================
         */
        const reward =
            Math.max(

                0,

                Number(
                    achievement.rewardCoin
                ) || 0
            );


        this.rewardText.draw(

            renderer,

            reward > 0

                ? `+${reward.toLocaleString(
                    "id-ID"
                )} COIN`

                : "",

            x + w - 18,

            y + 94
        );


        /*
         * =========================
         * PROGRESS BAR
         * =========================
         */
        const barX =
            x + 18;

        const barY =
            y + 122;

        const barW =
            w - 36;

        const barH =
            10;


        /*
         * Background.
         */
        renderer.setColor(
            "#0e1015"
        );


        renderer.fillRoundRect(
            barX,
            barY,
            barW,
            barH,
            5
        );


        /*
         * Fill.
         */
        if (
            ratio > 0
        ) {

            renderer.setColor(

                achievement.unlocked

                    ? "#58c76c"

                    : "#d8a743"
            );


            renderer.fillRoundRect(

                barX,

                barY,

                Math.max(
                    barH,
                    barW * ratio
                ),

                barH,

                5
            );
        }
    }


    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */
    drawPagination(renderer) {

        const pages =
            this.pageCount();


        /*
         * Previous.
         */
        renderer.setColor(

            this.page > 0

                ? "#343844"

                : "#22242b"
        );


        renderer.fillRoundRect(

            this.prevRect.x,
            this.prevRect.y,

            this.prevRect.w,
            this.prevRect.h,

            12
        );


        /*
         * Next.
         */
        renderer.setColor(

            this.page <
            pages - 1

                ? "#343844"

                : "#22242b"
        );


        renderer.fillRoundRect(

            this.nextRect.x,
            this.nextRect.y,

            this.nextRect.w,
            this.nextRect.h,

            12
        );


        this.buttonText.draw(
            renderer,
            "<",
            165,
            865
        );


        this.buttonText.draw(
            renderer,
            ">",
            375,
            865
        );


        this.pageText.draw(

            renderer,

            `PAGE ${this.page + 1} / ${pages}`,

            270,

            873
        );
    }


    /*
     * =====================================================
     * INPUT
     * =====================================================
     */
    inside(
        x,
        y,
        rect
    ) {

        return (

            x >= rect.x &&

            x <=
            rect.x +
            rect.w &&

            y >= rect.y &&

            y <=
            rect.y +
            rect.h
        );
    }


    onPointerDown(event) {

        if (
            !game.var.activeModal
        ) {
            return false;
        }


        /*
        * Pointer pakai posisi aktual
        * pada viewport/device.
        */
        const x =
            event.gameScreenX ??
            event.gameX;


        const y =
            event.gameScreenY ??
            event.gameY;


        /*
        * Region asli dibuat berdasarkan
        * design resolution 540x960.
        *
        * Convert ke posisi aktual
        * flex-height.
        */
        const closeRect =
            this.getScreenRect(
                this.closeRect
            );


        const prevRect =
            this.getScreenRect(
                this.prevRect
            );


        const nextRect =
            this.getScreenRect(
                this.nextRect
            );


        /*
        * =========================
        * CLOSE
        * =========================
        */
        if (
            this.inside(
                x,
                y,
                closeRect
            )
        ) {

            melon.audio.play(
                "buttonClick"
            );


            game.util
                .closeAchievement(
                    this
                );


            return false;
        }


        /*
        * =========================
        * PREVIOUS
        * =========================
        */
        if (
            this.page > 0 &&

            this.inside(
                x,
                y,
                prevRect
            )
        ) {

            melon.audio.play(
                "buttonClick"
            );


            this.page--;


            return false;
        }


        /*
        * =========================
        * NEXT
        * =========================
        */
        if (
            this.page <
            this.pageCount() - 1 &&

            this.inside(
                x,
                y,
                nextRect
            )
        ) {

            melon.audio.play(
                "buttonClick"
            );


            this.page++;


            return false;
        }


        return false;
    }
    
    getFlexOffsetY() {

        const designHeight =
            game.application?.settings?.height ??
            960;


        return (
            me.game.viewport.height -
            designHeight
        ) / 2;
    }


    getScreenRect(rect) {

        const offsetY =
            this.getFlexOffsetY();


        return {
            x: rect.x,
            y: rect.y + offsetY,
            w: rect.w,
            h: rect.h
        };
    }
    //  End of user code  //
};

// Put user code here //

//  End of user code  //
