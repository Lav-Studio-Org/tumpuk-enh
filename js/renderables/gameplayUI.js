import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
 
//  End of user code  //

export default class gameplayUI extends me.UIBaseElement {
	constructor(x, y, settings = {}) {
		settings.width = settings.width || 540;
		settings.height = settings.height || 960;
		

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

		this.var = {};

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
		/* built in function for adding container childs */
		const childerns = [{"type":"imagelayer","name":"scoreBar","image":"ab6cea53-9f83-11f1-8a49-e551180646a0","imageName":"scoreBar","x":"277","y":"47","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.206,"y":0.206},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":1198,"height":362,"regX":0,"regY":0,"renderLayer":"world"},{"type":"imagelayer","name":"highscoreBG","image":"ab6cea52-9f83-11f1-8a49-e551180646a0","imageName":"highscore","x":56,"y":"122","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.15,"y":0.15},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":615,"height":423,"regX":0,"regY":0,"renderLayer":"world"},{"type":"objectgroup","name":"achievementButton","objectName":"achievementButton","x":494,"y":127,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.206,"y":0.206},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"ab6cea50-9f83-11f1-8a49-e551180646a0"}},{"type":"objectgroup","name":"settingButton","objectName":"settingButton","x":492,"y":47,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.206,"y":0.206},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"ab6cea51-9f83-11f1-8a49-e551180646a0"}},{"type":"objectgroup","name":"backButton","objectName":"backButton","x":53,"y":47,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.206,"y":0.206},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"f8c4e9f3-9f84-11f1-8a49-e551180646a0"}},{"type":"text","name":"score","x":277,"y":50,"inspectors":{"alpha":1,"rotate":0,"scale":{"x":1,"y":1},"flip":{"x":false,"y":false},"z":0},"text":"0","size":32,"family":"Super Bouncer","color":"#ffffff","bold":false,"italic":false,"lineHeight":"32","textAlign":"center","textBaseline":"middle","wordWrapWidth":167,"boxWidth":167,"boxHeight":35,"renderLayer":"world"},{"type":"text","name":"highscore","x":55,"y":132,"inspectors":{"alpha":1,"rotate":0,"scale":{"x":1,"y":1},"flip":{"x":false,"y":false},"z":0},"text":"0","size":14,"family":"Super Bouncer","color":"#ffffff","bold":false,"italic":false,"lineHeight":"14","textAlign":"center","textBaseline":"middle","wordWrapWidth":167,"boxWidth":167,"boxHeight":35,"renderLayer":"world"},{"type":"objectgroup","name":"blow","objectName":"blow","x":496,"y":197,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.126,"y":0.126},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"f8c4e9f2-9f84-11f1-8a49-e551180646a0"}},{"type":"objectgroup","name":"bomb","objectName":"bomb","x":496,"y":317,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.126,"y":0.126},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"f8c4e9f0-9f84-11f1-8a49-e551180646a0"}},{"type":"objectgroup","name":"hammer","objectName":"hammer","x":496,"y":257,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.126,"y":0.126},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"f8c4e9f1-9f84-11f1-8a49-e551180646a0"}}];
		this._addEditorChild(childerns, me, game);

        // Put user code here //
        game.var.scoreObj = this.getChildByName("score")[0];
        game.var.highscoreObj = this.getChildByName("highscore")[0];
        const currentLevel =
            String(game.var.currentLevel || "KEBUN").toUpperCase();

        const highscoreKey =
            `highscore_${currentLevel}`;

        game.var.highscoreValue =
            melon.storage.get(
                highscoreKey,
                0
            );

        game.var.highscoreObj.setText(
            game.var.highscoreValue.toLocaleString("en-US")
        );

        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
		super.onActivateEvent();
        // Put user code here //
        
        //  End of user code  //
	}

	/* triggered when a Renderable is removed from the world.
	or when the scene containing it is no longer active in game */
	onDeactivateEvent() {
		super.onDeactivateEvent();
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

    // Put user code here //
    
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
