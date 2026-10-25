import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'



// Put user code here //
game.var.scoreValue = 0;
game.var.scoreObj = null;
game.var.currentLevel = game.var.CONFIG.DEFAULT_LEVEL;

game.var.isGameOver = false;
game.var.isDanger = false;

game.var.dangerTime = 0;
game.var.dangerDuration = 3500;

game.var.dangerY = 300;

game.var.loadingTarget = null;
game.var.loadingAssets = [];
game.var.unloadAssets = [];
game.var.sceneChanging = false;

//  End of user code  //


/* The code below will be executed when the script is imported into a component or another script. */
export default () => {
    // Put user code here //
    
    //  End of user code  //
}
