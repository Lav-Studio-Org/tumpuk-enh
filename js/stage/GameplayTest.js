import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'

// Put user code here //
import suikaObj from '../renderables/suikaObj.js';   
//  End of user code  //

export default class GameplayTest extends me.Stage {

	/* Called by the state manager when reseting the object, this is typically where you will load a level, add renderables, etc.
	Read (https://melonjs.github.io/melonJS/classes/Stage.html#onResetEvent) for more details. */
	onResetEvent() {
        // Put user code here //
        game.var.scoreValue = 0;
        game.var.finalScore = 0;
        game.var.isGameOver = false;
        game.var.isDanger = false;
        game.var.dangerTime = 0;

        game.var.skillActive = null;
        game.var.bombHoverTarget = null;
        //  End of user code  //
		me.level.load("GameplayTest");
		this.var = {};
		// Your Blockly Start Here //
		melon.camera.flash("#000000", 1000);
	
		// End of Your Blockly //

        // Put user code here //
        game.var.skillActive = null;
        //  End of user code  //
	}

	update(dt) {
        // Put user code here //
        
        //  End of user code  //
		super.update(dt);
        // Put user code here //
        this.checkDanger(dt);
        //  End of user code  //
	}
	/* Called by the state manager before switching to another state.
	Read (https://melonjs.github.io/melonJS/classes/Stage.html#onDestroyEvent) for more details. */
	onDestroyEvent() {
        // Put user code here //
        
        //  End of user code  //
		melon.textures.unloadForLevel("GameplayTest");
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

        game.var.finalScore =
            game.var.scoreValue;


        melon.object.spawn("modar", {
            x: melon.game.width()/2,
            y: melon.game.height()/2,
            z: 9999,
            inspectors: {
                scale: {
                    x: 1.146,
                    y: 1.146
                }
            }
        })

        game.var.skillActive = null;
        game.var.bombHoverTarget = null;
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
