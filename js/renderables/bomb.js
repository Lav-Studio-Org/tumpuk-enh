import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
import suikaObj from './suikaObj.js'
//  End of user code  //

export default class bomb extends me.Sprite {
	constructor(x, y, settings = {}) {
		settings.texture = "Level_Gameplay";
		settings.image = game.textureMap.get(settings.texture);
		settings.imageLists = settings.imageLists || ["bomb"];
		game.util.__populateAtlasIndices( settings.imageLists , settings);
		settings.animationMotions = settings.animationMotions || [
			{
				 animationName: "bomb",
				 frames: [{ name: "bomb", delay: 100 }],
			},
		];
		settings.animationDefault = settings.animationDefault || settings.animationMotions[0].animationName;
		settings.anchorPoint = { x: 0.5, y: 0.5 };
		settings.overrideAnchor = false;

        // Put user code here //
        
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

		/* Register all defined animations from the object settings */
		for (let motion of settings.animationMotions) {
			this.addAnimation(motion.animationName, motion.frames);
		}

		/* Set the default animation to be played when the object is created */
		this.setCurrentAnimation(settings.animationDefault);

		this._pointerDownHandler = me.input.registerPointerEvent("pointerdown", this, this.onClick.bind(this));

		/* Configure object body for collision behavior */
		this.isKinematic = false;
		this.var = {};

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
        // Put user code here //
        this._pointerMoveHandler = me.input.registerPointerEvent(
            "pointermove",
            me.game.viewport,
            this.onPointerMove.bind(this)
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
		me.input.releasePointerEvent("pointerdown", this, this._pointerDownHandler);
        // Put user code here //
        me.input.releasePointerEvent(
            "pointermove",
            me.game.viewport,
            this._pointerMoveHandler
        );
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
	}

	onClick(pointer) {
		if (this.ancestor && this.ancestor instanceof me.UIBaseElement && this.ancestor?.isEnable === false) return false;

        // Put user code here //
        if (game.var.skillActive) {
            return false;
        }

        if (game.var.isGameOver) {
            return false;
        }

        game.ui.trySkill("bomb", () => {
            game.var.skillActive = "bomb";
        });
        //  End of user code  //
		return false;
	}

    // Put user code here //
    onPointerMove(pointer) {
        if (game.var.skillActive !== "bomb") {
            game.var.bombHoverTarget = null;
            return;
        }

        game.var.bombHoverTarget = null;

        for (const object of me.game.world.getChildren()) {
            if (!(object instanceof suikaObj)) continue;
            
            const baseX = object.pos.x - object.width * object.anchorPoint.x;
            const baseY = object.pos.y - object.height * object.anchorPoint.y;

            const localX = pointer.gameWorldX - baseX;
            const localY = pointer.gameWorldY - baseY;

            const hit = object.bodyDef.shapes.some(
                shape => shape.contains(localX, localY)
            );

            if (hit) {
                game.var.bombHoverTarget = object;
                break;
            }
        }
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
