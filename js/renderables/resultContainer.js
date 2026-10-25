import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
 
//  End of user code  //

export default class resultContainer extends me.UIBaseElement {
	constructor(x, y, settings = {}) {
		settings.width = settings.width || 540;
		settings.height = settings.height || 1200;
		

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
		this.updateWhenPaused = true;
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
		const childerns = [{"type":"objectgroup","name":"hangBlack","objectName":"hangBlack","x":270,"y":600,"renderLayer":"world","properties":[],"inspectors":{"alpha":0.4,"rotate":0,"scale":{"x":6,"y":13.028},"flip":{"x":false,"y":false},"z":0},"modification":{}},{"type":"imagelayer","name":"result BG","image":"5a3a3880-a5d8-11f1-ae24-67e8a4e50618","imageName":"result BG","x":270,"y":480,"properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.572,"y":0.572},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":602,"height":864,"regX":0,"regY":0,"renderLayer":"world"},{"type":"imagelayer","name":"result coin","image":"5a3a5f93-a5d8-11f1-ae24-67e8a4e50618","imageName":"result coin","x":"270","y":"603","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.432,"y":0.432},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":499,"height":179,"regX":0,"regY":0,"renderLayer":"world"},{"type":"imagelayer","name":"result HS","image":"5a3a5f91-a5d8-11f1-ae24-67e8a4e50618","imageName":"result HS","x":"270","y":"435","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.432,"y":0.432},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":520,"height":191,"regX":0,"regY":0,"renderLayer":"world"},{"type":"imagelayer","name":"result star","image":"5a3a5f92-a5d8-11f1-ae24-67e8a4e50618","imageName":"result star","x":"270","y":"524","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.432,"y":0.432},"flip":{"x":false,"y":false},"z":null},"pivotX":0,"pivotY":0,"width":486,"height":190,"regX":0,"regY":0,"renderLayer":"world"},{"type":"text","name":"highscoreResult","x":289,"y":446,"inspectors":{"alpha":1,"rotate":0,"scale":{"x":1,"y":1},"flip":{"x":false,"y":false},"z":0},"text":"0","size":18,"family":"Super Bouncer","color":"#000000","bold":false,"italic":false,"lineHeight":"18","textAlign":"center","textBaseline":"middle","wordWrapWidth":129,"boxWidth":129,"boxHeight":32,"renderLayer":"world"},{"type":"text","name":"scoreResult","x":"289","y":"525","inspectors":{"alpha":1,"rotate":0,"scale":{"x":1,"y":1},"flip":{"x":false,"y":false},"z":0},"text":"0","size":18,"family":"Super Bouncer","color":"#000000","bold":false,"italic":false,"lineHeight":"18","textAlign":"center","textBaseline":"middle","wordWrapWidth":129,"boxWidth":129,"boxHeight":32,"renderLayer":"world"},{"type":"text","name":"coinResult","x":"289","y":"603","inspectors":{"alpha":1,"rotate":0,"scale":{"x":1,"y":1},"flip":{"x":false,"y":false},"z":0},"text":"0","size":18,"family":"Super Bouncer","color":"#000000","bold":false,"italic":false,"lineHeight":"18","textAlign":"center","textBaseline":"middle","wordWrapWidth":129,"boxWidth":129,"boxHeight":32,"renderLayer":"world"},{"type":"objectgroup","name":"restartBtn","objectName":"restartBtn","x":211,"y":785,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.484,"y":0.484},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"91f4e220-a5d8-11f1-ae24-67e8a4e50618"}},{"type":"objectgroup","name":"homeBtn","objectName":"homeBtn","x":331,"y":784,"renderLayer":"world","properties":[],"inspectors":{"alpha":1,"rotate":0,"scale":{"x":0.492,"y":0.492},"flip":{"x":false,"y":false},"z":0},"modification":{"image":"a0ef6ac0-a5d8-11f1-ae24-67e8a4e50618"}}];
		this._addEditorChild(childerns, me, game);

        // Put user code here //
        this.enablePausedUI(this);
        game.var.highscoreResult = this.getChildByName("highscoreResult")[0];
        game.var.scoreResult = this.getChildByName("scoreResult")[0];
        game.var.coinResult = this.getChildByName("coinResult")[0];
        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
		super.onActivateEvent();
        // Put user code here //
        game.var.highscoreResult.setText(game.var.highscoreValue.toLocaleString("id-ID"));
        game.var.scoreResult.setText(game.var.finalScore.toLocaleString("id-ID"));
        game.var.coinResult.setText(game.var.rewardCoin.toLocaleString("id-ID"));
        // melon.game.pause();
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
    enablePausedUI(object) {
        object.updateWhenPaused = true;
        object.inViewport = true;
        object.getChildren?.().forEach(this.enablePausedUI);
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
