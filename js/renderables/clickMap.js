import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
 
//  End of user code  //

export default class clickMap extends me.Renderable {
	constructor(x, y, settings = {}){
        // Put user code here //
        
        //  End of user code  //
		settings.width = settings.width || 48;
		settings.height = settings.height || 48;
		settings.anchorPoint = { x: 0.5, y: 0.5 };
		settings.audioName = settings.audioName || "buttonClick";
		settings.audioGroupName = settings.audioGroupName || "Master";
		settings.audioLoop = settings.audioLoop ?? false;
		settings.playOnStart = settings.playOnStart ?? true;
		settings.audioVolume = settings.audioVolume ?? 1;
		settings.audioPitch = settings.audioPitch ?? 1;
		settings.stereoPan = settings.stereoPan ?? 0;

		super(x, y, settings.width, settings.height);

		/* Inspectors Settings */
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		this.alpha = alpha;
		this._scaleX = 1;
		this._scaleY = 1;

		/* Audio Settings */
		this.floating = false;
		this.alwaysUpdate = false;
		this.updateWhenPaused = false;
		this.isPersistent = false;
		this.anchorPoint.set(0.5, 0.5);
		this.audio_name = settings.audioName;
		this.audioGroupName = settings.audioGroupName;
		this.audioLoop = settings.audioLoop === true || settings.audioLoop === "true" || settings.audioLoop === 1 || settings.audioLoop === "1";
		this.playOnStart = settings.playOnStart === true || settings.playOnStart === "true" || settings.playOnStart === 1 || settings.playOnStart === "1";
		this.audioVolume = Math.max(0, Math.min(settings.audioVolume, 1));
		this.audioPitch = Math.max(0.5, Math.min(settings.audioPitch, 4));
		this.stereoPan = Math.max(-1, Math.min(settings.stereoPan, 1));
		this.audio_ID = null;
		this.audioGroup = null;
		this.isAudioPlaying = false;
		this.isAudioMuted = false;
		this.isAudioPaused = false;


		if (this.playOnStart) this.playAudio();

		this.var = {};

        // Put user code here //
        
        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
        // Put user code here //
        
        //  End of user code  //
	}

	update(dt) {
		var drawNextFrame = super.update(dt);
        // Put user code here //
        
        //  End of user code  //
		return drawNextFrame;
	}

	playAudio() {
		if (!this.audio_name || this.isAudioPlaying || this.isAudioPaused) return;
		const onAudioEnd = this.audioLoop ? null : () => {
			this.audio_ID = null;
			this.isAudioPlaying = false;
			this.isAudioPaused = false;
		};
		this.audioGroup = this.resolveAudioGroup();
		this.audio_ID = me.audio.play(this.audio_name, this.audioLoop, onAudioEnd, this.getMixerVolume() * this.audioVolume * (game.sound?.scale(this.audio_name) ?? 1));
		this.isAudioPlaying = true;
		this.applyAudioSettings();
		if (this.isAudioMuted) this.muteAudio();
	}

	stopAudio() {
		if (!this.audio_name || (!this.isAudioPlaying && !this.isAudioPaused)) return;
		if (this.audioGroup) this.audioGroup.stop(this.audio_name, this.audio_ID);
		else me.audio.stop(this.audio_name, this.audio_ID);
		this.audio_ID = null;
		this.isAudioPlaying = false;
		this.isAudioPaused = false;
	}

	muteAudio() {
		this.isAudioMuted = true;
		if (!this.audio_name || !this.audio_ID) return;
		try {
			me.audio.mute(this.audio_name, this.audio_ID, true);
		} catch (error) {
			console.error(error.message);
		}
	}

	unmuteAudio() {
		this.isAudioMuted = false;
		if (!this.audio_name || !this.audio_ID) return;
		try {
			me.audio.unmute(this.audio_name, this.audio_ID);
			this.applyAudioSettings();
		} catch (error) {
			console.error(error.message);
		}
	}

	pauseAudio() {
		if (!this.audio_name || !this.audio_ID || !this.isAudioPlaying) return;
		try {
			me.audio.pause(this.audio_name, this.audio_ID);
			this.isAudioPlaying = false;
			this.isAudioPaused = true;
		} catch (error) {
			console.error(error.message);
		}
	}

	resumeAudio() {
		if (!this.audio_name || !this.audio_ID || !this.isAudioPaused) return;
		try {
			me.audio.resume(this.audio_name, this.audio_ID);
			this.isAudioPaused = false;
			this.isAudioPlaying = true;
			this.applyAudioSettings();
			if (this.isAudioMuted) this.muteAudio();
		} catch (error) {
			console.error(error.message);
		}
	}

	resolveAudioGroup() {
		const groups = me.game.audioGroup || {};
		if (this.audioGroupName && groups[this.audioGroupName]) return groups[this.audioGroupName];

		for (const groupName in groups) {
			const group = groups[groupName];
			if (Array.isArray(group.audioClips) && group.audioClips.includes(this.audio_name)) return group;
		}

		return me.game.audioMixer?.masterGroup || groups.Master || null;
	}

	getMixerVolume() {
		const group = this.audioGroup || this.resolveAudioGroup();
		return group ? group.actualVolume ?? group.volume ?? 1 : 1;
	}

	applyAudioSettings() {
		if (!this.audio_name) return;
		try {
			me.audio.rate(this.audio_name, this.audioPitch, this.audio_ID);
			me.audio.stereo(this.audio_name, this.stereoPan, this.audio_ID);
			me.audio.setAudioVolume(this.audio_name, this.getMixerVolume() * this.audioVolume * (game.sound?.scale(this.audio_name) ?? 1));
		} catch (error) {
			console.error(error.message);
		}
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

	onDeactivateEvent() {
		this.stopAudio();
        // Put user code here //
        
        //  End of user code  //
	}

    // Put user code here //
    
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
