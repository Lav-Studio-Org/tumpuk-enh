import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'


// Put user code here //
import suikaObj from './suikaObj.js';
//  End of user code  //

export default class suikaSpawner extends me.Renderable{
	constructor(x, y, settings = {}){
		settings.width = settings.width || 540;
		settings.height = settings.height || 1280;
		settings.anchorPoint = {
			x: 0.5,
			y: 0.5
		};

        // Put user code here //
        
        //  End of user code  //

		super(x, y, settings.width, settings.height);


		/* Extract inspector values */
		const inspectors = settings.inspectors || {};
		const alpha = inspectors.alpha ?? 1;
		const scale = inspectors.scale || { x: 1, y: 1 };
		const flip = inspectors.flip || { x: false, y: false };
		const rotation = inspectors.rotate || 0;

		/* Handle configuration data for the object */
		this.alpha = alpha;
		this.floating = false;
		this.alwaysUpdate = false;
		this.updateWhenPaused = false;
		this.isPersistent = false;

		/* Apply rotation */
		this.rotate(rotation);
		this._rotation = rotation;

		/* Apply scaling */
		this.scale(scale.x, scale.y);
		this._scaleX = scale.x;
		this._scaleY = scale.y;

		/* Apply flipping on X and/or Y axis */
		this.flipX(flip.x);
		this.flipY(flip.y);
		this.anchorPoint.set(settings.anchorPoint.x, settings.anchorPoint.y);

		this._pointerDownHandler = me.input.registerPointerEvent("pointerdown", this, this.onClick.bind(this));

		/* Configure object body for collision behavior */
		this.isKinematic = false;
		this.var = {};
		this.color = "#ffffff"
		this.roundLevel = 10
		this.shapeType = "rect"

		this.posteffect = settings.posteffect ?? settings.postEffect ?? true;
        // Put user code here //
        this.inputMode = this.resolveInputMode();
        this.isPointerDragging = false;
        
        this._viewportPointerDownHandler =
            () => true;

        this._pointerMoveHandler =
            this.onPointerMove.bind(this);

        this._pointerUpHandler =
            this.onPointerUp.bind(this);

        this._pointerCancelHandler =
            this.onPointerCancel.bind(this);


        me.input.registerPointerEvent(
            "pointerdown",
            me.game.viewport,
            this._viewportPointerDownHandler
        );

        me.input.registerPointerEvent(
            "pointermove",
            me.game.viewport,
            this._pointerMoveHandler
        );

        me.input.registerPointerEvent(
            "pointerup",
            me.game.viewport,
            this._pointerUpHandler
        );

        me.input.registerPointerEvent(
            "pointercancel",
            me.game.viewport,
            this._pointerCancelHandler
        );
        this.isDropping = false;

		this.spawnX = x;
		this.spawnY = y;

		this.minX = settings.minX ?? 130;
		this.maxX = settings.maxX ?? 390;

		this.currentObject = null;
		this.nextObject = null;

		this.preview = null;

		this.pointerMoveHandler = null;
		this.pointerDownHandler = null;
        this.guideBodyProfileCache = new Map();
        //  End of user code  //
	}

	/* triggered when a Renderable is added to the world.
	or when the scene containing it becomes active in game. */
	onActivateEvent() {
        // Put user code here //
        this.generateNext();
		this.createPreview();
		// =========================
		// POINTER MOVE / HOVER
		// =========================

		// this.pointerMoveHandler =
        //     me.event.on(
        //         "me.event.pointermove",
        //         (event) => {
        //             if (this.isDropping) {
        //                 return;
        //             }

        //             let x = event.gameX;

        //             x = Math.max(
        //                 this.minX,
        //                 Math.min(
        //                     this.maxX,
        //                     x
        //                 )
        //             );

        //             this.spawnX = x;
        //             if (this.preview) {
        //                 this.preview.pos.x = this.spawnX;
        //                 this.preview.pos.y = this.spawnY;
        //             }

        //         }
        //     );
        //  End of user code  //
	}

	/* triggered when a Renderable is removed from the world.
	or when the scene containing it is no longer active in game */
	onDeactivateEvent() {
		me.input.releasePointerEvent("pointerdown", this, this._pointerDownHandler);
        // Put user code here //
        me.input.releasePointerEvent(
            "pointerdown",
            me.game.viewport,
            this._viewportPointerDownHandler
        );

        me.input.releasePointerEvent(
            "pointermove",
            me.game.viewport,
            this._pointerMoveHandler
        );

        me.input.releasePointerEvent(
            "pointerup",
            me.game.viewport,
            this._pointerUpHandler
        );

        me.input.releasePointerEvent(
            "pointercancel",
            me.game.viewport,
            this._pointerCancelHandler
        );

        this.isPointerDragging = false;

		if (
			this.preview &&
			this.preview.ancestor
		) {

			me.game.world.removeChild(
				this.preview
			);

		}

		this.preview = null;
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
		renderer.setColor(this.color);
		switch (this.shapeType) {
			case "rect":
				renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
				break;

			case "roundrect":
				renderer.fillRoundRect(this.pos.x, this.pos.y, this.width, this.height, this.roundLevel);
				break;

			case "ellipse":
				let radius = Math.min(this.width, this.height) / 2;
				let centerX = this.pos.x + this.width / 2;
				let centerY = this.pos.y + this.height / 2;
				renderer.fillArc(centerX, centerY, radius, 0, Math.PI * 2, false);
				break;

			case "empty":
				break;

			default:
				console.warn(`Unknown shapeType: ${this.shapeType}`);
				renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
				break;
		}
	}

	onClick(pointer) {
		if (this.ancestor && this.ancestor instanceof me.UIBaseElement && this.ancestor?.isEnable === false) return false;

        // Put user code here //
        
        if (this.isDropping) {
            return false;
        }

        // =========================
        // MOBILE
        // =========================

        if (this.inputMode === "MOBILE") {

            // Baru mulai drag.
            // JANGAN drop di pointerdown.
            this.isPointerDragging = true;

            this.movePreviewToPointer(
                pointer
            );

            return false;
        }


        // =========================
        // DESKTOP
        // =========================

        this.movePreviewToPointer(
            pointer
        );

        // Desktop tetap drop saat click/down.
        this.dropObject();
        //  End of user code  //
		return false;
	}

    // Put user code here //
    onPointerMove(pointer) {

        if (
            this.isDropping ||
            game.var.isGameOver
        ) {
            return false;
        }


        // Desktop:
        // preview selalu mengikuti cursor.
        if (this.inputMode === "DESKTOP") {

            this.movePreviewToPointer(
                pointer
            );

            return false;
        }


        // MOBILE:
        // preview HANYA bergerak ketika
        // jari sedang menekan / dragging.
        if (
            this.inputMode === "MOBILE" &&
            this.isPointerDragging
        ) {

            this.movePreviewToPointer(
                pointer
            );
        }


        return false;
    }

    onPointerUp(pointer) {

        if (this.inputMode !== "MOBILE") {
            return true;
        }


        if (!this.isPointerDragging) {
            return true;
        }


        this.isPointerDragging = false;


        // Ambil posisi terakhir jari
        // sebelum object dijatuhkan.
        this.movePreviewToPointer(
            pointer
        );


        // MOBILE baru drop saat release.
        this.dropObject();


        return false;
    }

    onPointerCancel() {

        if (this.inputMode === "MOBILE") {
            this.isPointerDragging = false;
        }

        return true;
    }

    movePreviewToPointer(pointer) {

        if (
            !pointer ||
            this.isDropping
        ) {
            return;
        }


        let x =
            pointer.gameX;


        x =
            Math.max(
                this.minX,
                Math.min(
                    this.maxX,
                    x
                )
            );


        this.spawnX = x;


        if (this.preview) {

            this.preview.pos.x =
                this.spawnX;

            this.preview.pos.y =
                this.spawnY;
        }
    }

    resolveInputMode() {

        const override =
            String(
                game.var.CONFIG?.INPUT_DEVICE ??
                "AUTO"
            ).toUpperCase();


        if (override === "MOBILE") {
            return "MOBILE";
        }


        if (override === "DESKTOP") {
            return "DESKTOP";
        }


        return me.device.isMobile
            ? "MOBILE"
            : "DESKTOP";
    }
    
    draw(renderer) {
        super.draw(renderer);

        if (
            game.var.isGameOver ||
            game.var.skillActive ||
            this.isDropping ||
            !this.preview
        ) {
            return;
        }


        const worldX =
            this.spawnX;


        const bodyProfile =
            this.getCurrentGuideBodyProfile();


        // Titik paling bawah body buah preview,
        // bukan sprite bounds.
        const worldStartY =
            this.spawnY +
            bodyProfile.bottom +
            2;

        const yGap = 20;


        // Raycast memakai WORLD coordinate.
        const worldEndY =
            this.getGuideEndY(
                worldX,
                worldStartY
            ) - yGap;


        if (worldEndY <= worldStartY) {
            return;
        }


        // preDraw Renderable otomatis melakukan:
        // translate(-anchorX, -anchorY)
        //
        // Jadi world coordinate yang kita gambar
        // harus dikompensasi anchor.
        const anchorX =
            this.width *
            (this.anchorPoint?.x ?? 0);

        const anchorY =
            this.height *
            (this.anchorPoint?.y ?? 0);


        const startX =
            worldX +
            anchorX;

        const startY =
            worldStartY +
            anchorY;

        const endY =
            worldEndY +
            anchorY;


        const dashLength = 12;
        const gapLength = 9;
        const lineWidth = 3;


        renderer.save();

        renderer.setColor("#ffffff");
        renderer.setGlobalAlpha(0.45);


        for (
            let y = startY;
            y < endY;
            y += dashLength + gapLength
        ) {

            const height =
                Math.min(
                    dashLength,
                    endY - y
                );


            renderer.fillRect(
                startX - lineWidth / 2,
                y,
                lineWidth,
                height
            );
        }


        renderer.restore();
    }

    getGuideEndY(x, startY) {

        const adapter =
            me.game.world.adapter;


        if (!adapter?.raycast) {
            return 900;
        }


        const profile =
            this.getCurrentGuideBodyProfile();


        let predictedOriginY =
            Infinity;


        // =====================================
        // RAYCAST SETIAP BAGIAN BAWAH BODY
        // =====================================

        for (const sample of profile.samples) {

            const rayX =
                x +
                sample.x;


            const rayStartY =
                this.spawnY +
                sample.bottom +
                1;


            const hit =
                adapter.raycast(
                    {
                        x: rayX,
                        y: rayStartY
                    },
                    {
                        x: rayX,
                        y: 950
                    }
                );


            if (!hit?.point) {
                continue;
            }


            // Kalau titik body ini berada di local Y:
            //
            // sample.bottom
            //
            // dan obstacle berada di:
            //
            // hit.point.y
            //
            // maka pusat/origin buah akan menyentuh
            // obstacle ketika berada di:
            //
            // hitY - localBodyY

            const candidateOriginY =
                hit.point.y -
                sample.bottom;


            predictedOriginY =
                Math.min(
                    predictedOriginY,
                    candidateOriginY
                );
        }


        // Tidak ada body yang kena
        if (
            !Number.isFinite(
                predictedOriginY
            )
        ) {

            return 900;
        }


        // Kembalikan posisi bottom CENTER body
        // ketika salah satu bagian body pertama kali menyentuh.
        return (
            predictedOriginY +
            profile.bottom
        );
    }

    generateNext() {

		const level =
			game.var.currentLevel;

		const objects =
			game.var.suikaLevels[level];


		if (!objects || objects.length === 0) {
			return;
		}

		const maxSpawnTier =
			Math.min(
				5,
				objects.length
			);


		const randomIndex =
			Math.floor(
				Math.random() *
				maxSpawnTier
			);


		this.currentObject =
			this.nextObject ||
			// objects[0];
			objects[randomIndex];


		const nextRandomIndex =
			Math.floor(
				Math.random() *
				maxSpawnTier
			);


		this.nextObject =
            // objects[0]
			objects[nextRandomIndex];


		// Kalau punya UI "NEXT"
		game.var.nextObject =
			this.nextObject;

	}


	createPreview() {

        if (!this.currentObject) {
            return;
        }


        // Hapus preview lama
        if (
            this.preview &&
            this.preview.ancestor
        ) {
            me.game.world.removeChild(
                this.preview
            );
        }


        const level =
            game.var.currentLevel;


        const textureName =
            game.var.levelMap[level];


        const imageName =
            game.var.suikaPreviewImages?.[level]?.[
                this.currentObject
            ];

        const objects =
            game.var.suikaLevels?.[level] || [];

        const objectIndex =
            Math.max(0, objects.indexOf(this.currentObject));

        const previewScale =
            game.util.getSuikaScale(level, objectIndex);

        if (!textureName) {

            console.warn(
                "Texture world tidak ditemukan:",
                level
            );

            return;
        }


        if (!imageName) {

            console.warn(
                "Preview image tidak ditemukan:",
                level,
                this.currentObject
            );

            return;
        }


        const texture =
            game.textureMap.get(
                textureName
            );


        if (!texture) {

            console.warn(
                "Texture belum loaded:",
                textureName
            );

            return;
        }


        this.preview =
            melon.object.spawn(
                "objectPreview",
                {
                    x: this.spawnX,
                    y: this.spawnY,

                    // Harus masuk SEBELUM super()
                    image: texture,

                    imageLists: [
                        imageName
                    ],

                    // Opsional, berguna untuk debugging
                    objectName:
                        this.currentObject,

                    imageName:
                        imageName,

                    texture:
                        textureName,

                    z: 10,
                    
                    inspectors: {
                        scale: {
                            x: previewScale,
                            y: previewScale
                        }
                    }
                }
            );


        if (this.preview) {

            this.preview.setOpacity?.(
                0.8
            );

        }

    }

	dropObject() {

        if (
            this.isDropping ||
            !this.currentObject || 
            game.var.skillActive ||
            game.var.isGameOver
        ) {
            return;
        }


        this.isDropping = true;

        game.ui?.onDrop();


        // =========================
        // SIMPAN OBJECT SAAT INI
        // =========================

        const droppedObject =
            this.currentObject;


        // =========================
        // AMBIL TINT DARI CONFIG
        // =========================

        const level =
            game.var.currentLevel;

        const levelObjects =
            game.var.suikaLevels?.[level] || [];

        const levelTints =
            game.var.suikaTints?.[level] || [];


        const objectIndex =
            levelObjects.indexOf(
                droppedObject
            );


        const tint =
            objectIndex >= 0
                ? (
                    levelTints[
                        objectIndex
                    ] ?? "#ffffff"
                )
                : "#ffffff";


        // =========================
        // HAPUS PREVIEW
        // =========================

        if (
            this.preview &&
            this.preview.ancestor
        ) {

            me.game.world.removeChild(
                this.preview
            );

        }

        this.preview = null;


        // =========================
        // SPAWN PHYSICS OBJECT
        // =========================

        melon.object.spawn(
            droppedObject,
            {
                x: this.spawnX,
                y: this.spawnY,
                z: 10,

                isPreview: false
            }
        );


        // =========================
        // SPAWN PARTICLE
        // =========================

        // melon.object.spawn(
        //     "exp",
        //     {
        //         x: this.spawnX,
        //         y: this.spawnY,

        //         tint: tint
        //     }
        // );


        // =========================
        // PREPARE OBJECT BERIKUTNYA
        // =========================

        this.generateNext();


        // =========================
        // DELAY ANTI SPAM
        // =========================

        melon.time.after(
            game.var.spawnTime,
            () => {

                this.isDropping = false;

                if (!game.var.isGameOver) {
                    this.createPreview();
                }

            }
        );

    }

    getPolygonBottomAtX(vertices, x = 0) {

        let bottom = -Infinity;

        const eps = 0.0001;


        for (let i = 0; i < vertices.length; i++) {

            const a = vertices[i];

            const b =
                vertices[
                    (i + 1) %
                    vertices.length
                ];


            const minX =
                Math.min(a.x, b.x) - eps;

            const maxX =
                Math.max(a.x, b.x) + eps;


            if (
                x < minX ||
                x > maxX
            ) {
                continue;
            }


            const dx =
                b.x - a.x;


            if (Math.abs(dx) < eps) {

                if (
                    Math.abs(
                        x - a.x
                    ) <= eps
                ) {

                    bottom =
                        Math.max(
                            bottom,
                            a.y,
                            b.y
                        );
                }

                continue;
            }


            const t =
                (x - a.x) /
                dx;


            if (
                t < -eps ||
                t > 1 + eps
            ) {
                continue;
            }


            const y =
                a.y +
                (
                    b.y - a.y
                ) * t;


            bottom =
                Math.max(
                    bottom,
                    y
                );
        }


        return bottom;
    }

    getCurrentGuideBodyProfile() {

        if (!this.currentObject) {
            return {
                bottom: 0,
                samples: [
                    {
                        x: 0,
                        bottom: 0
                    }
                ]
            };
        }


        const key =
            `${game.var.currentLevel}:${this.currentObject}`;


        const cached =
            this.guideBodyProfileCache.get(
                key
            );


        if (cached) {
            return cached;
        }


        const adapter =
            me.game.world.adapter;


        let probe = null;


        try {

            probe =
                me.pool.pull(
                    this.currentObject,
                    0,
                    0,
                    {}
                );


            const shapes =
                probe.bodyDef?.shapes ??
                [];


            const polygons = [];

            let minX = Infinity;
            let maxX = -Infinity;
            let maxBottom = -Infinity;


            for (const shape of shapes) {

                if (
                    typeof adapter?._shapeToMatter !==
                    "function"
                ) {
                    continue;
                }


                const matterShape =
                    adapter._shapeToMatter(
                        shape,
                        0,
                        0
                    );


                const parts =
                    matterShape.parts?.length > 1
                        ? matterShape.parts.slice(1)
                        : [matterShape];


                for (const part of parts) {

                    const vertices =
                        part.vertices?.map(
                            vertex => ({
                                x: vertex.x,
                                y: vertex.y
                            })
                        ) ?? [];


                    if (vertices.length < 3) {
                        continue;
                    }


                    polygons.push(
                        vertices
                    );


                    for (const vertex of vertices) {

                        minX =
                            Math.min(
                                minX,
                                vertex.x
                            );

                        maxX =
                            Math.max(
                                maxX,
                                vertex.x
                            );

                        maxBottom =
                            Math.max(
                                maxBottom,
                                vertex.y
                            );
                    }
                }
            }


            if (
                polygons.length === 0 ||
                !Number.isFinite(minX) ||
                !Number.isFinite(maxX)
            ) {

                return {
                    bottom: 0,
                    samples: [
                        {
                            x: 0,
                            bottom: 0
                        }
                    ]
                };
            }


            // =============================
            // SAMPLE KONTUR BAWAH BODY
            // =============================

            const sampleCount = 11;

            const sampleMap =
                new Map();


            const addSample =
                (sampleX) => {

                    let bottom =
                        -Infinity;


                    for (const polygon of polygons) {

                        const candidate =
                            this.getPolygonBottomAtX(
                                polygon,
                                sampleX
                            );


                        if (
                            Number.isFinite(
                                candidate
                            )
                        ) {

                            bottom =
                                Math.max(
                                    bottom,
                                    candidate
                                );
                        }
                    }


                    if (
                        Number.isFinite(bottom)
                    ) {

                        sampleMap.set(
                            sampleX.toFixed(4),
                            {
                                x: sampleX,
                                bottom: bottom
                            }
                        );
                    }
                };


            // Selalu sample tengah
            addSample(0);


            // Sample seluruh lebar collision body
            for (
                let i = 0;
                i < sampleCount;
                i++
            ) {

                const t =
                    i /
                    (sampleCount - 1);


                const sampleX =
                    minX +
                    (
                        maxX - minX
                    ) * t;


                addSample(
                    sampleX
                );
            }


            const samples =
                [...sampleMap.values()]
                    .sort(
                        (a, b) =>
                            a.x - b.x
                    );


            // Bottom tepat di tengah body.
            // Ini yang dipakai posisi garis vertikal.
            let centerBottom =
                -Infinity;


            for (const polygon of polygons) {

                const candidate =
                    this.getPolygonBottomAtX(
                        polygon,
                        0
                    );


                if (
                    Number.isFinite(candidate)
                ) {

                    centerBottom =
                        Math.max(
                            centerBottom,
                            candidate
                        );
                }
            }


            if (
                !Number.isFinite(
                    centerBottom
                )
            ) {

                centerBottom =
                    maxBottom;
            }


            const profile = {

                bottom:
                    centerBottom,

                minX:
                    minX,

                maxX:
                    maxX,

                samples:
                    samples
            };


            this.guideBodyProfileCache.set(
                key,
                profile
            );


            return profile;

        } finally {

            if (
                probe?._pointerDownHandler
            ) {

                me.input.releasePointerEvent(
                    "pointerdown",
                    probe,
                    probe._pointerDownHandler
                );
            }


            probe?.body?.destroy?.();
        }
    }
    //  End of user code  //
};

// Put user code here //
 
//  End of user code  //
