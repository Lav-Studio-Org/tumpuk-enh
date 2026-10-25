import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'



// Put user code here //
import DataManifest, {
	TextureManifest
} from "../../manifest.js";

function findDataResource(name) {
	const normalized = String(name)
		.trim()
		.toLowerCase();

	return DataManifest.find(resource =>
		String(resource.name).trim().toLowerCase() === normalized
	);
}

function normalizeGroupName(name) {
	return String(name)
		.trim()
		.toLowerCase()
		.replace(/^\/+|\/+$/g, "")
		.replace(/[\s_-]+/g, "");
}

function resolveGroupName(name) {
	const normalized = normalizeGroupName(name);

	const group = Object.keys(TextureManifest).find(
		key => normalizeGroupName(key) === normalized
	);

	if (!group) {
		throw new Error(
			`Asset group "${name}" tidak ditemukan. Available: ` +
			Object.keys(TextureManifest).join(", ")
		);
	}

	return group;
}


function getResources(name) {
	const group = resolveGroupName(name);

	return TextureManifest[group] || [];
}


function isResourceLoaded(resource) {
	switch (resource.type) {

		case "image":
			return !!me.loader.getImage(resource.name);

		case "json":
			return !!me.loader.getJSON(resource.name);

		default:
			return false;
	}
}


function loadResource(resource) {
	return new Promise((resolve, reject) => {

		// Sudah ada di memory, jangan load ulang.
		if (isResourceLoaded(resource)) {
			resolve({
				resource,
				cached: true
			});

			return;
		}


		me.loader.load(
			resource,

			() => {
				resolve({
					resource,
					cached: false
				});
			},

			(error) => {
				reject({
					resource,
					error
				});
			}
		);
	});
}

// console.log(
// 		"[AssetManager] Ready:",
// 		Object.keys(TextureManifest)
// 	);

//  End of user code  //


/* The code below will be executed when the script is imported into a component or another script. */
export default () => {
    // Put user code here //
    game.assets = {


		/**
		 * Mengubah nama bebas menjadi key TextureManifest.
		 *
		 * Contoh:
		 *
		 * "Level Background"
		 * "level_background"
		 * "Level-Background"
		 *
		 * semuanya menjadi:
		 *
		 * "Level_Background"
		 */
		resolve(name) {
			return resolveGroupName(name);
		},


		/**
		 * Ambil daftar resource dalam suatu folder.
		 */
		get(name) {
			return getResources(name);
		},


		/**
		 * Cek apakah semua resource group sudah loaded.
		 */
		isLoaded(name) {
			return getResources(name).every(isResourceLoaded);
		},


		/**
		 * Load satu folder asset.
		 *
		 * await game.assets.load("Kebun");
		 *
		 * await game.assets.load("Level Background", {
		 *     onProgress(info) {
		 *         
		 *     }
		 * });
		 */
        async load(name, options = {}) {

            // =========================
            // 1. Coba TextureManifest
            // =========================

            const normalized = normalizeGroupName(name);

            const group = Object.keys(TextureManifest).find(
                key => normalizeGroupName(key) === normalized
            );

            if (group) {

                const resources = TextureManifest[group] || [];
                const total = resources.length;

                let loaded = 0;

                for (const resource of resources) {

                    await loadResource(resource);

                    loaded++;

                    if (typeof options.onProgress === "function") {

                        options.onProgress({
                            group,
                            progress: loaded / total,
                            loaded,
                            total,
                            resource
                        });

                    }

                }


                // REGISTER ATLAS
                if (typeof game.installTextureGroup === "function") {
                    game.installTextureGroup(group);
                }


                if (typeof game.refreshCombinedTexture === "function") {
                    game.refreshCombinedTexture();
                }


                return group;
            }


            // =========================
            // 2. Coba resource biasa
            // =========================

            const resource = findDataResource(name);

            if (resource) {

                await loadResource(resource);

                if (typeof options.onProgress === "function") {
                    options.onProgress({
                        group: null,
                        progress: 1,
                        loaded: 1,
                        total: 1,
                        resource
                    });
                }

                return resource.name;
            }


            throw new Error(
                `Asset "${name}" tidak ditemukan di TextureManifest maupun DataManifest`
            );
        },


		/**
		 * Load beberapa folder.
		 *
		 * await game.assets.loadMany([
		 *     "image",
		 *     "Level Background",
		 *     "Kebun"
		 * ]);
		 */
		async loadMany(names = [], options = {}) {

            const list = [];
            const loadedGroups = new Set();

            for (const name of names) {

                const normalized = normalizeGroupName(name);

                // =========================
                // TextureManifest
                // =========================

                const group = Object.keys(TextureManifest).find(
                    key => normalizeGroupName(key) === normalized
                );

                if (group) {

                    loadedGroups.add(group);

                    for (const resource of TextureManifest[group] || []) {

                        list.push({
                            group,
                            name,
                            resource
                        });

                    }

                    continue;
                }


                // =========================
                // DataManifest biasa
                // =========================

                const resource = findDataResource(name);

                if (resource) {

                    list.push({
                        group: null,
                        name: resource.name,
                        resource
                    });

                    continue;
                }


                throw new Error(
                    `Asset "${name}" tidak ditemukan di TextureManifest maupun DataManifest`
                );
            }


            const total = list.length;
            let loaded = 0;


            for (const item of list) {

                await loadResource(item.resource);

                loaded++;

                if (typeof options.onProgress === "function") {

                    options.onProgress({
                        group: item.group,
                        name: item.name,

                        progress:
                            total === 0
                                ? 1
                                : loaded / total,

                        loaded,
                        total,

                        resource: item.resource
                    });

                }

            }


            // ============================================
            // PENTING:
            // register atlas yang baru selesai di-load
            // ============================================

            for (const group of loadedGroups) {

                if (typeof game.installTextureGroup === "function") {

                    game.installTextureGroup(group);

                    // console.log(
                    //     "[AssetManager] installed texture:",
                    //     group
                    // );

                }

            }


            // Gabungkan ulang global texture atlas
            if (typeof game.refreshCombinedTexture === "function") {
                game.refreshCombinedTexture();
            }


            // console.log(
            //     "[AssetManager] textureMap:",
            //     [...game.textureMap.keys()]
            // );


            return names;
        },


		/**
		 * Unload satu folder.
		 *
		 * game.assets.unload("Kebun");
		 */
		unload(name) {

            const group = resolveGroupName(name);

            const resources =
                TextureManifest[group] || [];

            if (game.textureMap) {
                game.textureMap.delete(group);
            }

            for (const resource of resources) {

                if (!isResourceLoaded(resource)) {
                    continue;
                }

                me.loader.unload({
                    name: resource.name,
                    type: resource.type
                });

            }

            if (
                typeof game.refreshCombinedTexture ===
                "function"
            ) {

                game.refreshCombinedTexture();

            }

            return group;
        },


		/**
		 * Unload beberapa folder.
		 *
		 * game.assets.unloadMany([
		 *     "Kebun",
		 *     "Level Background"
		 * ]);
		 */
		unloadMany(names) {

            const groups = [
                ...new Set(
                    names.map(resolveGroupName)
                )
            ];

            for (const group of groups) {

                const resources =
                    TextureManifest[group] || [];

                if (game.textureMap) {
                    game.textureMap.delete(group);
                }

                for (const resource of resources) {

                    if (!isResourceLoaded(resource)) {
                        continue;
                    }


                    me.loader.unload({
                        name: resource.name,
                        type: resource.type
                    });

                }

            }

            if (
                typeof game.refreshCombinedTexture ===
                "function"
            ) {

                game.refreshCombinedTexture();

            }

            return groups;
        }
	};
    //  End of user code  //
}
