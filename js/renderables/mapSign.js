import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
let back = false;
//  End of user code  //

export default class mapSign extends me.UIBaseElement {
	constructor(x, y, settings = {}) {
		settings.width = settings.width || 122.612;
		settings.height = settings.height || 82.28;
		

        // Put user code here //
        
        //  End of user code  //

		super(x, y, settings.width, settings.height);
		// Keep legacy object.x/object.y UI code mapped to renderable position on newer melonJS.
		Object.defineProperties(this, {
			x: { get: () => this.pos.x, set: (value) => { this.pos.x = value; }, configurable: true },
			y: { get: () => this.pos.y, set: (value) => { this.pos.y = value; }, configurable: true }
		});


		/* Extract inspector values */
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };
		const flip = inspectors.flip || { x: false, y: false };

		/* Handle configuration data for the object */
		this.alpha = alpha;
		this.floating = true;
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
		this.anchorPoint.set(0, 0);
		this.isHoldable = false;
		this.isDraggable = false;
		// isEnable controls whether the GUI object receives input events
		this.isEnable = true;

		this._pointerDownHandler = me.input.registerPointerEvent("pointerdown", this, this.onClick.bind(this));

		/* Configure object body for collision behavior */
		this.isKinematic = false;
		this.var = {};

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
		/* built in function for adding container childs */
		const childerns = [{"type":"imagelayer","name":"sign","image":"ebd8e7c0-9e4c-11f1-adaf-79b4985bfd93","imageName":"sign","x":"61","y":"41","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.203,"y":0.242},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":604,"height":340,"regX":0,"regY":0,"renderLayer":"world","zAnchor":0},{"type":"text","name":"levelName","x":"61","y":39,"inspectors":{"alpha":1,"rotate":0,"scale":{"x":1,"y":1},"flip":{"x":false,"y":false},"z":0},"text":"KEBUN","size":18,"family":"Super Bouncer","color":"#b88347","bold":false,"italic":false,"lineHeight":"18","textAlign":"center","textBaseline":"middle","wordWrapWidth":122,"boxWidth":122,"boxHeight":84,"renderLayer":"world"}];
		this._addEditorChild(childerns, me, game);

        // Put user code here //
        this.level = settings.level;
        this._pointerEnterHandler = me.input.registerPointerEvent("pointerenter", this, this.enter.bind(this));
        this._pointerLeaveHandler = me.input.registerPointerEvent("pointerleave", this, this.leave.bind(this));
        this.zoom = false;
        this._pointerUpHandler = me.input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
        // this.floating = false;
        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
		super.onActivateEvent();
        // Put user code here //
        const levelName = this.levelName = this.getChildByName("levelName")[0];
        switch (this.level) {
            case 2:
                this.signName = "PASAR";
                levelName.setText(this.signName);
                break;
            case 3:
                this.signName = "WARUNG";
                levelName.setText(this.signName);
                break;
            case 4:
                this.signName = "PANTAI";
                levelName.setText(this.signName);
                break;
            case 5:
                this.signName = "HUTAN";
                levelName.setText(this.signName);
                break;
            case 6:
                this.signName = "DESA";
                levelName.setText(this.signName);
                break;
            case 7:
                this.signName = "MISTERI";
                levelName.setText(this.signName);
                break;
            default:
                this.signName = "KEBUN";
                break;
        }
        this.refreshStatus();
        //  End of user code  //
	}

	/* triggered when a Renderable is removed from the world.
	or when the scene containing it is no longer active in game */
	onDeactivateEvent() {
		super.onDeactivateEvent();
		me.input.releasePointerEvent("pointerdown", this, this._pointerDownHandler);
        // Put user code here //
        me.input.releasePointerEvent("pointerenter", this, this._pointerEnterHandler);
        me.input.releasePointerEvent("pointerleave", this, this._pointerLeaveHandler);
        me.input.releasePointerEvent("pointerup", this, this._pointerUpHandler);
        
        back = false;
        //  End of user code  //
	}

	/* The update function in MelonJS is called on every game frame to update an object's state.
	It is commonly used for handling movement, animations, physics, and game logic.
	Returning true from this function signals that the object needs to be re-rendered. */
	update (dt){
		var drawNextFrame = super.update(dt);
        // Put user code here //
        
        //  End of user code  //
		return drawNextFrame;
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

	onClick(pointer) {
		if (this.ancestor && this.ancestor instanceof me.UIBaseElement && this.ancestor?.isEnable === false) return false;

        // Put user code here //
        // Select on release, so dragging the map from a sign does not open it.
        this._downAt = { x: pointer.gameScreenX, y: pointer.gameScreenY };
        //  End of user code  //
		return false;
	}

    // Put user code here //
    onRelease(pointer) {
        const down = this._downAt;
        this._downAt = null;
        if (!down || back || game.util.isModalOpen()) return false;
        const moved = Math.hypot(pointer.gameScreenX - down.x, pointer.gameScreenY - down.y);
        if (moved > 14) return false;

        if (!game.meta.isUnlocked(this.signName)) {
            melon.audio.play("buttonClick");
            game.ui.showWorldLocked(this.signName, () => this.refreshStatus());
            return false;
        }

        back = true;
        melon.object.spawn("clickMap");
        game.util.goScene("Gameplay", { level: this.signName });
        return false;
    }

    // Name + a second line: best score, "Baru", or "Terkunci".
    refreshStatus() {
        const unlocked = game.meta.isUnlocked(this.signName);
        const best = game.meta.best(this.signName);

        if (!this.statusText) {
            this.statusText = new me.Text(61, 50, {
                font: "Super Bouncer",
                size: 13,
                fillStyle: "#6b4220",
                textAlign: "center",
                textBaseline: "middle",
                text: " "
            });
            this.addChild(this.statusText);
            this.levelName.pos.y -= 8;
        }

        this.statusText.setText(
            !unlocked ? "Terkunci" :
            best > 0 ? `Terbaik ${best.toLocaleString("id-ID")}` :
            "Baru"
        );

        this.levelName.alpha = unlocked ? 1 : 0.55;
        this.statusText.alpha = unlocked ? 1 : 0.8;
    }

    enter() {
        if (back) return;
        if (!this.zoom) {
            this.zoom = true;

            const factor = 1.12;

            this.pos.x -= this.width * (factor - 1) / 2;
            this.pos.y -= this.height * (factor - 1) / 2;

            this.scale(factor, factor);
        }
    }

    leave() {
        if (back) return;
        if (this.zoom) {
            this.zoom = false;

            const factor = 1.12;

            this.scale(1 / factor, 1 / factor);

            this.pos.x += this.width * (factor - 1) / 2;
            this.pos.y += this.height * (factor - 1) / 2;
        }
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
