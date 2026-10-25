import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
 
//  End of user code  //

export default class sfxSlider extends me.Slider {
	constructor(x, y, settings = {}){
        // Put user code here //
 
        //  End of user code  //
		let _settings = {
			width: 200,
			height: 20,
			minValue: 0,
			maxValue: 1,
			value: 1,
			direction: "LeftToRight",
			wholeNumbers: false,
			backgroundColor: "#858585",
			fillColor: "#ff9829",
			backgroundAlpha: 1,
			fillAlpha: 1,
			shape: "RoundRect",
			radius: 10,
			radialStartAngle: undefined,
			radialClockwise: undefined,
		};

		 let backgroundLoc;
		Object.keys(game.imageLocation).forEach(key => {
			if (key === "slider bg") {
				backgroundLoc = game.imageLocation[key];
			}
		});
		const backgroundAtlas = game.textureMap.get(backgroundLoc);
		const backgroundRegion = backgroundAtlas?.getRegion("slider bg");
		const backgroundSource = backgroundRegion ? {
			getRegion: (name) => backgroundAtlas.getRegion(name),
			getTexture: (region) => backgroundAtlas.getTexture(region || backgroundRegion),
		} : backgroundAtlas;
		_settings.backgroundImage = {
			region: "slider bg",
			texture: backgroundLoc,
			image: backgroundSource,
		};

		 let fillLoc;
		Object.keys(game.imageLocation).forEach(key => {
			if (key === "slider value") {
				fillLoc = game.imageLocation[key];
			}
		});
		const fillAtlas = game.textureMap.get(fillLoc);
		const fillRegion = fillAtlas?.getRegion("slider value");
		const fillSource = fillRegion ? {
			getRegion: (name) => fillAtlas.getRegion(name),
			getTexture: (region) => fillAtlas.getTexture(region || fillRegion),
		} : fillAtlas;
		_settings.fillImage = {
			region: "slider value",
			texture: fillLoc,
			image: fillSource,
		};

		let knobLoc;
		Object.keys(game.imageLocation).forEach(key => {
			if (key === "slider knob") {
				knobLoc = game.imageLocation[key];
			}
		});
		const image = game.textureMap.get(knobLoc).getRegion("slider knob")

		_settings.knob = {
			width: image.width,
			height: image.height,
			alpha: 1,
			region: "slider knob",
			texture: 'knobLoc',
			image: game.textureMap.get(knobLoc),
			scaleX: 0.3,
			scaleY: 0.3,
		};
		const config = Object.assign({}, _settings);

		super(x, y, Object.assign(config));

		/* Inspectors Settings */
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };
		const flip = inspectors.flip || { x: false, y: false };
		const rotate = inspectors.rotate || 0;
		this.rotate(rotate);
		this.alpha = alpha;
		this.scale(scale.x, scale.y);
		this._scaleX = scale.x;
		this._scaleY = scale.y;
		this.flipX(flip.x);
		this.flipY(flip.y);

		/* Configuration Settings */
		this.floating = false;

		this.var = {};

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
        // Put user code here //

        //  End of user code  //
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

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
		super.onActivateEvent();
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

	/* triggered when a Renderable is removed from the world.
	or when the scene containing it is no longer active in game */
	onDeactivateEvent() {
		super.onDeactivateEvent();
        // Put user code here //
        
        //  End of user code  //
	}

    // Put user code here //
    
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
