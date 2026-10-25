import * as me from './dist/melon-runtime.module.js'

import melon, { configureMelonJs20Runtime } from './dist/melon-runtime.module.js'

import { MatterAdapter } from './dist/physics/matter-adapter.js'
import game from './js/game.js'

export let application = null;

const { Application } = me;

import Gameplay from './js/stage/Gameplay.js'
import GameplayTest from './js/stage/GameplayTest.js'
import LoadingGame from './js/stage/LoadingGame.js'
import Main from './js/stage/Main.js'
import Maps from './js/stage/Maps.js'
import testFruit from './js/stage/testFruit.js'
import clickMap from './js/renderables/clickMap.js'
import loadingAudio from './js/renderables/loadingAudio.js'
import achievementButton from './js/renderables/achievementButton.js'
import backButton from './js/renderables/backButton.js'
import blow from './js/renderables/blow.js'
import bomb from './js/renderables/bomb.js'
import hammer from './js/renderables/hammer.js'
import settingButton from './js/renderables/settingButton.js'
import blower from './js/renderables/blower.js'
import blower2 from './js/renderables/blower2.js'
import backButton2 from './js/renderables/backButton2.js'
import dangerLine from './js/renderables/dangerLine.js'
import evolutionBar from './js/renderables/evolutionBar.js'
import gameContainer from './js/renderables/gameContainer.js'
import gameContainerFront from './js/renderables/gameContainerFront.js'
import gameplayBG from './js/renderables/gameplayBG.js'
import gameplayUI from './js/renderables/gameplayUI.js'
import objectPreview from './js/renderables/objectPreview.js'
import resultContainer from './js/renderables/resultContainer.js'
import suikaObj from './js/renderables/suikaObj.js'
import suikaSpawner from './js/renderables/suikaSpawner.js'
import hang from './js/renderables/hang.js'
import hangBlack from './js/renderables/hangBlack.js'
import hangTitle from './js/renderables/hangTitle.js'
import homeUI from './js/renderables/homeUI.js'
import playButton from './js/renderables/playButton.js'
import LoadingBar from './js/renderables/LoadingBar.js'
import mapFloat from './js/renderables/mapFloat.js'
import mapSign from './js/renderables/mapSign.js'
import homeBtn from './js/renderables/homeBtn.js'
import restartBtn from './js/renderables/restartBtn.js'
import closeSettings from './js/renderables/closeSettings.js'
import musicSlider from './js/renderables/musicSlider.js'
import settingContainer from './js/renderables/settingContainer.js'
import sfxSlider from './js/renderables/sfxSlider.js'
import suikaWhooshPushLeft from './js/renderables/suikaWhooshPushLeft.js'
import suikaWhooshPushRight from './js/renderables/suikaWhooshPushRight.js'
import suikaWhooshPushUp from './js/renderables/suikaWhooshPushUp.js'
import achievementContainer from './js/renderables/achievementContainer.js'
import achievementPopup from './js/renderables/achievementPopup.js'
import coinBar from './js/renderables/coinBar.js'
import combine from './js/renderables/combine.js'
import comboParticle from './js/renderables/comboParticle.js'
import exp from './js/renderables/exp.js'
import modar from './js/renderables/modar.js'
import Angkot from './js/renderables/Angkot.js'
import Bola from './js/renderables/Bola.js'
import Ember from './js/renderables/Ember.js'
import GerobakDesa from './js/renderables/GerobakDesa.js'
import KipasAngin from './js/renderables/KipasAngin.js'
import KursiPlastik from './js/renderables/KursiPlastik.js'
import Layangan from './js/renderables/Layangan.js'
import Motor from './js/renderables/Motor.js'
import Radio from './js/renderables/Radio.js'
import SandalJepit from './js/renderables/SandalJepit.js'
import Sepeda from './js/renderables/Sepeda.js'
import BlackPanther from './js/renderables/BlackPanther.js'
import Gajah from './js/renderables/Gajah.js'
import Harimau from './js/renderables/Harimau.js'
import Kancil from './js/renderables/Kancil.js'
import Katak from './js/renderables/Katak.js'
import Kumbang from './js/renderables/Kumbang.js'
import Monyet from './js/renderables/Monyet.js'
import Orangutan from './js/renderables/Orangutan.js'
import Rangkong from './js/renderables/Rangkong.js'
import Tokek from './js/renderables/Tokek.js'
import Tupai from './js/renderables/Tupai.js'
import Apple from './js/renderables/Apple.js'
import Cherry from './js/renderables/Cherry.js'
import Coconut from './js/renderables/Coconut.js'
import Durian from './js/renderables/Durian.js'
import Mango from './js/renderables/Mango.js'
import Melon from './js/renderables/Melon.js'
import Orange from './js/renderables/Orange.js'
import Pear from './js/renderables/Pear.js'
import Pineapple from './js/renderables/Pineapple.js'
import Strawberry from './js/renderables/Strawberry.js'
import Watermelon from './js/renderables/Watermelon.js'
import BonekaMisterius from './js/renderables/BonekaMisterius.js'
import Genderuwo from './js/renderables/Genderuwo.js'
import Jimat from './js/renderables/Jimat.js'
import KunangKunang from './js/renderables/KunangKunang.js'
import Kuntilanak from './js/renderables/Kuntilanak.js'
import Lentera from './js/renderables/Lentera.js'
import Lilin from './js/renderables/Lilin.js'
import Pocong from './js/renderables/Pocong.js'
import PohonBeringin from './js/renderables/PohonBeringin.js'
import TopengMisterius from './js/renderables/TopengMisterius.js'
import Tuyul from './js/renderables/Tuyul.js'
import BintangLaut from './js/renderables/BintangLaut.js'
import Gurita from './js/renderables/Gurita.js'
import Hiu from './js/renderables/Hiu.js'
import IkanBadut from './js/renderables/IkanBadut.js'
import IkanBuntal from './js/renderables/IkanBuntal.js'
import Kepiting from './js/renderables/Kepiting.js'
import Kerang from './js/renderables/Kerang.js'
import LumbaLumba from './js/renderables/LumbaLumba.js'
import Pari from './js/renderables/Pari.js'
import Paus from './js/renderables/Paus.js'
import Penyu from './js/renderables/Penyu.js'
import DadarGulung from './js/renderables/DadarGulung.js'
import Getuk from './js/renderables/Getuk.js'
import Klepon from './js/renderables/Klepon.js'
import KueCucur from './js/renderables/KueCucur.js'
import KueLumpur from './js/renderables/KueLumpur.js'
import Lemper from './js/renderables/Lemper.js'
import Martabak from './js/renderables/Martabak.js'
import OndeOnde from './js/renderables/OndeOnde.js'
import PutuAyu from './js/renderables/PutuAyu.js'
import Serabi from './js/renderables/Serabi.js'
import Tumpeng from './js/renderables/Tumpeng.js'
import AyamGoreng from './js/renderables/AyamGoreng.js'
import Bakso from './js/renderables/Bakso.js'
import EsKopi from './js/renderables/EsKopi.js'
import Gerobak from './js/renderables/Gerobak.js'
import Gorengan from './js/renderables/Gorengan.js'
import MieInstan from './js/renderables/MieInstan.js'
import NasiBungkus from './js/renderables/NasiBungkus.js'
import NasiGoreng from './js/renderables/NasiGoreng.js'
import Permen from './js/renderables/Permen.js'
import Soto from './js/renderables/Soto.js'
import Telur from './js/renderables/Telur.js'
import * as assetManager from './js/script/assetManager.js'
import * as config from './js/script/config.js'
import * as gameData from './js/script/gameData.js'
import * as util from './js/script/util.js'
import * as achievement from './js/script/achievement.js'


import { initUI } from './js/ui/ui.js'
import DataManifest, { TextureManifest, LevelTextureSettings, InitiallyLoadedTextures } from './manifest.js'

/**
 *
 * Initialize the application
 */
export default async function onload() {
	// WebGL2 when the device has it, Canvas otherwise (AUTO would try WebGPU first,
	// and a hard WEBGL request leaves WebGL1-only phones on a black screen).
	const hasWebGL2 = (() => {
		try { return !!document.createElement("canvas").getContext("webgl2"); } catch (e) { return false; }
	})();
	const app = new Application(540, 960, {
		parent: "screen",
		renderer: hasWebGL2 ? me.video.WEBGL : me.video.CANVAS, scale: "auto",
		scaleMethod: "flex-height",
		antiAlias: true,
		subPixel: true,
		transparent: false,
		powerPreference: "default",
		physic: new MatterAdapter({"gravity":{"x":0,"y":1.5},"subSteps":1,"matterEngineOptions":{"timing":{"timeScale":1},"positionIterations":6,"velocityIterations":4,"constraintIterations":2,"enableSleeping":false}})
	});
	await app.init();
	application = app;
	game.application = app;
	game.VERSION = "1.0.0";

	configureMelonJs20Runtime({ application, gameData: game });

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// allow cross-origin for image/texture loading
	me.loader.setOptions({ crossOrigin: "anonymous", withCredentials: true });


	// set and load all resources.
	// World BGMs are marked `lazy`: they load in the background after start-up
	// (see game.util.ensureAudio) so the first screen does not wait for them.
	game.var.lazyAudio = DataManifest.filter(resource => resource.lazy);
	const selectedManifest = DataManifest.filter(resource => !resource.lazy).map(resource => {
		if (!resource.shaderVariants) return resource;
		const language = application.renderer.shaderLanguage;
		const src = resource.shaderVariants[language];
		if (src) return { name: resource.name, type: 'shader', src };
		console.warn('Shader ' + resource.name + ' has no source for ' + language + '; effect disabled.');
		return { name: resource.name, type: 'shader', data: language === 'wgsl' ? { glsl: '' } : { wgsl: '' } };
	});
	// Boot screen progress (the canvas loader is hidden behind #boot).
	me.event.on(me.event.LOADER_PROGRESS, (progress) => {
		const bar = document.querySelector("#boot .boot-bar i");
		if (bar) bar.style.width = Math.round(progress * 100) + "%";
	});
	me.loader.preload(selectedManifest, async function() {
		me.state.Gameplay = "Gameplay";
		me.state.set(me.state.Gameplay, new Gameplay());
		me.state.GameplayTest = "GameplayTest";
		me.state.set(me.state.GameplayTest, new GameplayTest());
		me.state.LoadingGame = "LoadingGame";
		me.state.set(me.state.LoadingGame, new LoadingGame());
		me.state.Main = "Main";
		me.state.set(me.state.Main, new Main());
		me.state.Maps = "Maps";
		me.state.set(me.state.Maps, new Maps());
		me.state.testFruit = "testFruit";
		me.state.set(me.state.testFruit, new testFruit());

		me.pool.register('clickMap', clickMap);
		me.pool.register('loadingAudio', loadingAudio);
		me.pool.register('achievementButton', achievementButton);
		me.pool.register('backButton', backButton);
		me.pool.register('blow', blow);
		me.pool.register('bomb', bomb);
		me.pool.register('hammer', hammer);
		me.pool.register('settingButton', settingButton);
		me.pool.register('Angkot', Angkot);
		me.pool.register('Bola', Bola);
		me.pool.register('Ember', Ember);
		me.pool.register('GerobakDesa', GerobakDesa);
		me.pool.register('KipasAngin', KipasAngin);
		me.pool.register('KursiPlastik', KursiPlastik);
		me.pool.register('Layangan', Layangan);
		me.pool.register('Motor', Motor);
		me.pool.register('Radio', Radio);
		me.pool.register('SandalJepit', SandalJepit);
		me.pool.register('Sepeda', Sepeda);
		me.pool.register('BlackPanther', BlackPanther);
		me.pool.register('Gajah', Gajah);
		me.pool.register('Harimau', Harimau);
		me.pool.register('Kancil', Kancil);
		me.pool.register('Katak', Katak);
		me.pool.register('Kumbang', Kumbang);
		me.pool.register('Monyet', Monyet);
		me.pool.register('Orangutan', Orangutan);
		me.pool.register('Rangkong', Rangkong);
		me.pool.register('Tokek', Tokek);
		me.pool.register('Tupai', Tupai);
		me.pool.register('Apple', Apple);
		me.pool.register('Cherry', Cherry);
		me.pool.register('Coconut', Coconut);
		me.pool.register('Durian', Durian);
		me.pool.register('Mango', Mango);
		me.pool.register('Melon', Melon);
		me.pool.register('Orange', Orange);
		me.pool.register('Pear', Pear);
		me.pool.register('Pineapple', Pineapple);
		me.pool.register('Strawberry', Strawberry);
		me.pool.register('Watermelon', Watermelon);
		me.pool.register('BonekaMisterius', BonekaMisterius);
		me.pool.register('Genderuwo', Genderuwo);
		me.pool.register('Jimat', Jimat);
		me.pool.register('KunangKunang', KunangKunang);
		me.pool.register('Kuntilanak', Kuntilanak);
		me.pool.register('Lentera', Lentera);
		me.pool.register('Lilin', Lilin);
		me.pool.register('Pocong', Pocong);
		me.pool.register('PohonBeringin', PohonBeringin);
		me.pool.register('TopengMisterius', TopengMisterius);
		me.pool.register('Tuyul', Tuyul);
		me.pool.register('BintangLaut', BintangLaut);
		me.pool.register('Gurita', Gurita);
		me.pool.register('Hiu', Hiu);
		me.pool.register('IkanBadut', IkanBadut);
		me.pool.register('IkanBuntal', IkanBuntal);
		me.pool.register('Kepiting', Kepiting);
		me.pool.register('Kerang', Kerang);
		me.pool.register('LumbaLumba', LumbaLumba);
		me.pool.register('Pari', Pari);
		me.pool.register('Paus', Paus);
		me.pool.register('Penyu', Penyu);
		me.pool.register('DadarGulung', DadarGulung);
		me.pool.register('Getuk', Getuk);
		me.pool.register('Klepon', Klepon);
		me.pool.register('KueCucur', KueCucur);
		me.pool.register('KueLumpur', KueLumpur);
		me.pool.register('Lemper', Lemper);
		me.pool.register('Martabak', Martabak);
		me.pool.register('OndeOnde', OndeOnde);
		me.pool.register('PutuAyu', PutuAyu);
		me.pool.register('Serabi', Serabi);
		me.pool.register('Tumpeng', Tumpeng);
		me.pool.register('blower', blower);
		me.pool.register('blower2', blower2);
		me.pool.register('AyamGoreng', AyamGoreng);
		me.pool.register('Bakso', Bakso);
		me.pool.register('EsKopi', EsKopi);
		me.pool.register('Gerobak', Gerobak);
		me.pool.register('Gorengan', Gorengan);
		me.pool.register('MieInstan', MieInstan);
		me.pool.register('NasiBungkus', NasiBungkus);
		me.pool.register('NasiGoreng', NasiGoreng);
		me.pool.register('Permen', Permen);
		me.pool.register('Soto', Soto);
		me.pool.register('Telur', Telur);
		me.pool.register('backButton2', backButton2);
		me.pool.register('dangerLine', dangerLine);
		me.pool.register('evolutionBar', evolutionBar);
		me.pool.register('gameContainer', gameContainer);
		me.pool.register('gameContainerFront', gameContainerFront);
		me.pool.register('gameplayBG', gameplayBG);
		me.pool.register('gameplayUI', gameplayUI);
		me.pool.register('objectPreview', objectPreview);
		me.pool.register('resultContainer', resultContainer);
		me.pool.register('suikaObj', suikaObj);
		me.pool.register('suikaSpawner', suikaSpawner);
		me.pool.register('hang', hang);
		me.pool.register('hangBlack', hangBlack);
		me.pool.register('hangTitle', hangTitle);
		me.pool.register('homeUI', homeUI);
		me.pool.register('playButton', playButton);
		me.pool.register('LoadingBar', LoadingBar);
		me.pool.register('mapFloat', mapFloat);
		me.pool.register('mapSign', mapSign);
		me.pool.register('homeBtn', homeBtn);
		me.pool.register('restartBtn', restartBtn);
		me.pool.register('closeSettings', closeSettings);
		me.pool.register('musicSlider', musicSlider);
		me.pool.register('settingContainer', settingContainer);
		me.pool.register('sfxSlider', sfxSlider);
		me.pool.register('suikaWhooshPushLeft', suikaWhooshPushLeft);
		me.pool.register('suikaWhooshPushRight', suikaWhooshPushRight);
		me.pool.register('suikaWhooshPushUp', suikaWhooshPushUp);
		me.pool.register('achievementContainer', achievementContainer);
		me.pool.register('achievementPopup', achievementPopup);
		me.pool.register('coinBar', coinBar);
		me.pool.register('combine', combine);
		me.pool.register('comboParticle', comboParticle);
		me.pool.register('exp', exp);
		me.pool.register('modar', modar);

		// Assami's Experiment Save Script on Game
		game.scriptHandlers["assetManager"] = assetManager
		game.scriptHandlers["config"] = config
		game.scriptHandlers["gameData"] = gameData
		game.scriptHandlers["util"] = util
		game.scriptHandlers["achievement"] = achievement

		// Assami's Experiment Using MelonJS Texture Atlas Class
		game.textureMap = new Map();
		game.installTextureGroup = function(group) {
			const json = (TextureManifest[group] || []).filter(resource => resource.type === "json").map(resource => me.loader.getJSON(resource.name));
			if (json.length) {
				const atlas = new me.TextureAtlas(json, undefined, false);
				atlas.__melonTextureGroup = group;
				atlas.sources.forEach(source => { source.__melonTextureGroup = group; });
				game.textureMap.set(group, atlas);
			}
		};
		game.refreshCombinedTexture = function() {
			const json = [...game.textureMap.keys()].flatMap(group => (TextureManifest[group] || []).filter(resource => resource.type === "json").map(resource => me.loader.getJSON(resource.name))).filter(Boolean);
			game.texture = json.length ? new me.TextureAtlas(json, undefined, false) : null;
		};
		InitiallyLoadedTextures.forEach(game.installTextureGroup);
		game.refreshCombinedTexture();

		game.imageLocation = {
			"angkot": "Desa",
			"bola": "Desa",
			"desa": "Desa",
			"ember": "Desa",
			"gerobak2": "Desa",
			"Kipas Angin": "Desa",
			"kursi": "Desa",
			"Layangan": "Desa",
			"motor": "Desa",
			"radio": "Desa",
			"Sandal Jepit": "Desa",
			"sepeda": "Desa",
			"gajah": "Hutan",
			"Harimau": "Hutan",
			"Hutan": "Hutan",
			"kancil": "Hutan",
			"Katak": "Hutan",
			"Kumbang": "Hutan",
			"monyet": "Hutan",
			"orangutan": "Hutan",
			"panther": "Hutan",
			"Rangkong": "Hutan",
			"Tokek": "Hutan",
			"Tupai": "Hutan",
			"apple": "Kebun",
			"cherry": "Kebun",
			"coconut": "Kebun",
			"durian": "Kebun",
			"Kebun": "Kebun",
			"mango": "Kebun",
			"melon": "Kebun",
			"orange": "Kebun",
			"pear": "Kebun",
			"pineapple": "Kebun",
			"strawberry": "Kebun",
			"watermelon": "Kebun",
			"achievement": "Level Gameplay",
			"backBtn": "Level Gameplay",
			"blow": "Level Gameplay",
			"blower": "Level Gameplay",
			"bomb": "Level Gameplay",
			"coinBG": "Level Gameplay",
			"evoBar": "Level Gameplay",
			"explosive": "Level Gameplay",
			"hammer": "Level Gameplay",
			"highscore": "Level Gameplay",
			"scoreBar": "Level Gameplay",
			"settings": "Level Gameplay",
			"suikaContainer": "Level Gameplay",
			"suikaContainerFront": "Level Gameplay",
			"Floor Tiles2": "Level Home",
			"hangTitle": "Level Home",
			"homeBG": "Level Home",
			"menuBG": "Level Home",
			"play button": "Level Home",
			"coin": "LoadingAsset",
			"coinBar": "LoadingAsset",
			"coinBarFront": "LoadingAsset",
			"loadingBar": "LoadingAsset",
			"loadingBG": "LoadingAsset",
			"logoGame": "LoadingAsset",
			"Boneka Misterius": "Misteri",
			"Genderuwo": "Misteri",
			"Jimat": "Misteri",
			"Kunang-kunang": "Misteri",
			"kunti": "Misteri",
			"Lentera Tua": "Misteri",
			"Lilin": "Misteri",
			"misteri": "Misteri",
			"pocong": "Misteri",
			"Pohon Beringin": "Misteri",
			"Topeng Misterius": "Misteri",
			"Tuyul": "Misteri",
			"Bintang Laut": "Pantai",
			"Gurita": "Pantai",
			"Hiu": "Pantai",
			"Ikan Badut": "Pantai",
			"Ikan Buntal": "Pantai",
			"Kepiting": "Pantai",
			"Kerang": "Pantai",
			"Lumba-lumba": "Pantai",
			"Pantai": "Pantai",
			"Pari": "Pantai",
			"Paus": "Pantai",
			"Penyu": "Pantai",
			"Dadar Gulung": "Pasar",
			"Getuk": "Pasar",
			"klepon": "Pasar",
			"Kue Cucur": "Pasar",
			"Kue Lumpur": "Pasar",
			"Lemper": "Pasar",
			"Martabak Manis": "Pasar",
			"onde-onde": "Pasar",
			"Pasar": "Pasar",
			"Putu Ayu": "Pasar",
			"Serabi": "Pasar",
			"Tumpeng": "Pasar",
			"prev": "image",
			"close result": "ResultUI",
			"home button": "ResultUI",
			"restart button": "ResultUI",
			"result BG": "ResultUI",
			"result coin": "ResultUI",
			"result crown": "ResultUI",
			"result green": "ResultUI",
			"result HS": "ResultUI",
			"result info": "ResultUI",
			"result red": "ResultUI",
			"result star": "ResultUI",
			"result trophy": "ResultUI",
			"result": "ResultUI",
			"settingsBG": "SettingsUI",
			"slider bg": "SettingsUI",
			"slider knob": "SettingsUI",
			"slider value": "SettingsUI",
			"sign": "image",
			"ayam goreng": "Warung",
			"bakso": "Warung",
			"gerobakMie": "Warung",
			"gorengan": "Warung",
			"kopi": "Warung",
			"mie": "Warung",
			"nasi bungkus": "Warung",
			"Nasi Goreng": "Warung",
			"permen": "Warung",
			"soto": "Warung",
			"telur": "Warung",
			"Warung": "Warung",
			"worldMap": "image",
		};

			melon.textures.configure({
				state: me.state, resources: TextureManifest, levels: LevelTextureSettings, initiallyLoaded: InitiallyLoadedTextures,
				preload: resources => new Promise((resolve, reject) => {
					try {
						const request = me.loader.preload(resources, resolve, false);
						if (request && typeof request.catch === "function") request.catch(reject);
					} catch (error) { reject(error); }
				}),
				unload: resource => me.loader.unload(resource),
				onLoaded: group => { game.installTextureGroup(group); game.refreshCombinedTexture(); },
				onBeforeUnload: group => { game.textureMap.delete(group); game.refreshCombinedTexture(); }
			});


		game.util.__populateAtlasIndices = function(animationKeys, settings){
			let tpAtlas = [], indices = {},
				width = 0, height = 0,
				texture = game.textureMap.get(settings.texture);
			for (let i = 0; i < animationKeys.length; i++) {
				let region = texture.getRegion(animationKeys[i]);
				if (region == null) {
					// throw an error
					throw new me.TextureAtlas.Error(
						"Texture - region for " + animationKeys[i] + " not found");
				}
				tpAtlas[i] = region;
				indices[animationKeys[i]] = i;
				width = Math.max(region.width, width);
				height = Math.max(region.height, height);
			}
			settings.framewidth = width;
			settings.frameheight = height;
			settings.atlas = tpAtlas;
			settings.atlasIndices = indices;
		}
		me.pool.register('spriteTP', __spriteTP);
		me.pool.register('videoSpriteTP', __videoSpriteTP);
		me.pool.register('collisionTP', __collisionTP);
		me.pool.register('noSlopeCollisionTP', __noSlopeCollisionTP);
		game.ShaderManager?.initLoadedShaders(me.game.renderer);
		me.state.change(me.state.LoadingGame);
		game.util.loadLazyAudio();
		initUI();
		document.getElementById("boot")?.remove();
	},false);

};

class __spriteTP extends me.Sprite {
	constructor(x, y, settings = {}) {
		settings.image = (settings.texture) ? game.textureMap.get(settings.texture) : settings.region;
		(settings.texture) ? settings.region = settings.region : "";
		settings.anchorPoint = {
			x : 0.5,
			y : 0.5
		}
		super(x, y, Object.assign(settings));

		
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };
		const flip = inspectors.flip || { x: false, y: false };

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

		this.imageName = settings.region;

		if (settings.sortLayer) this._anchorZ = settings.zAnchor??0;

	}
};


class __videoSpriteTP extends me.Sprite {
	constructor(x, y, settings = {}) {
		settings.image = me.loader.getVideo(settings.videoName);
		(settings.texture) ? settings.region = settings.region : "";
		settings.anchorPoint = {
			x : 0.5,
			y : 0.5
		}
		super(x, y, Object.assign(settings));

		
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };

		const flip = inspectors.flip || { x: false, y: false };

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

	}
	onActivateEvent(){
		this.play();
	}
};

function cloneCollisionTPShape(shape) {
	if (Array.isArray(shape)) {
		return shape.map((item) => cloneCollisionTPShape(item));
	}
	return (shape && typeof shape.clone === "function") ? shape.clone() : shape;
}

function applyCollisionTPBodySettings(body) {
	body.collisionMask = body.collisionMask ?? me.collision.types.ALL_OBJECT;
	body.shapes.forEach((shape) => {
		shape.collisionType = body.collisionType;
		shape.collisionMask = body.collisionMask;
		shape.isTrigger = false;
		shape.isActive = true;
	});
}

class __collisionTP extends me.Renderable {
	constructor(x, y, settings = {}) {
		super(x, y, settings.width, settings.height);

		var shape = settings.shapes;
		if (typeof shape === "undefined") {
			shape = me.pool.pull("Polygon", 0, 0, [
				me.pool.pull("Vector2d", 0,          0),
				me.pool.pull("Vector2d", this.width, 0),
				me.pool.pull("Vector2d", this.width, this.height)
			]);
		}
		if (typeof settings.shapes !== "undefined") shape = cloneCollisionTPShape(shape);
		this.anchorPoint.set(0, 0);
		this.name = settings.name;
		this.type = settings.type;
		// for backward compatibility
		this.class = settings.class || settings.type;
		this.id = settings.id;
		if (settings.collisionType?.[0] === "@") settings.collisionType = settings.collisionType.substring(1);
		const collisionType = settings.collisionType ? (game.collisionTypes[settings.collisionType] || me.collision.types[settings.collisionType]) : me.collision.types.WORLD_SHAPE;
		this.bodyDef = { type: "static", shapes: Array.isArray(shape) ? shape : [shape], collisionType };
	}
};


class __noSlopeCollisionTP extends me.Renderable {
	constructor(x, y, settings = {}) {
		super(x, y, settings.width, settings.height);

		var shape = settings.shapes;
		if (typeof shape === "undefined") {
			shape = me.pool.pull("Polygon", 0, 0, [
				me.pool.pull("Vector2d", 0,          0),
				me.pool.pull("Vector2d", this.width, 0),
				me.pool.pull("Vector2d", this.width, this.height)
			]);
		}
		if (typeof settings.shapes !== "undefined") shape = cloneCollisionTPShape(shape);
		this.anchorPoint.set(0, 0);
		this.name = settings.name;
		this.type = settings.type;
		// for backward compatibility
		this.class = settings.class || settings.type;
		this.id = settings.id;
		if (settings.collisionType?.[0] === "@") settings.collisionType = settings.collisionType.substring(1);
		const collisionType = settings.collisionType ? (game.collisionTypes[settings.collisionType] || me.collision.types[settings.collisionType]) : me.collision.types.NO_SLOPE;
		this.bodyDef = { type: "static", shapes: Array.isArray(shape) ? shape : [shape], collisionType };
	}
};

