import * as me from '../../dist/melon-runtime.module.js'
import melon from '../../dist/melon-runtime.module.js'
import game from '../game.js'



// Put user code here //
const PREFIX =
    "achievement_";


/*
 * Listener ini nanti bisa dipakai
 * untuk achievement popup.
 */
const unlockListeners =
    new Set();


function toNumber(
    value,
    fallback = 0
) {

    const result =
        Number(value);


    return Number.isFinite(result)
        ? result
        : fallback;
}


function normalizeLevel(level) {

    return String(
        level ||
        game.var.currentLevel ||
        "KEBUN"
    ).toUpperCase();
}


function storageKey(name) {

    return `${PREFIX}${name}`;
}


/*
 * =========================
 * STAT STORAGE
 * =========================
 */

function getStat(
    name,
    fallback = 0
) {

    return toNumber(
        melon.storage.get(
            storageKey(
                `stat_${name}`
            ),
            fallback
        ),
        fallback
    );
}


function setStat(
    name,
    value
) {

    melon.storage.set(
        storageKey(
            `stat_${name}`
        ),
        value
    );


    return value;
}


function incrementStat(
    name,
    amount = 1
) {

    return setStat(
        name,
        getStat(name) + amount
    );
}


function maxStat(
    name,
    value
) {

    const oldValue =
        getStat(name);


    const newValue =
        Math.max(
            oldValue,
            toNumber(value)
        );


    if (
        newValue !== oldValue
    ) {

        setStat(
            name,
            newValue
        );
    }


    return newValue;
}


/*
 * =========================
 * UNLOCK STORAGE
 * =========================
 */

function isUnlocked(id) {

    return (
        melon.storage.get(
            storageKey(
                `unlocked_${id}`
            ),
            false
        ) === true
    );
}


function getDefinitions() {

    return Array.isArray(
        game.var.ACHIEVEMENTS
    )
        ? game.var.ACHIEVEMENTS
        : [];
}


/*
 * =========================
 * MAP PROGRESS
 * =========================
 */

function getPlayedMapCount() {

    const levels =
        Object.keys(
            game.var.suikaLevels || {}
        );


    return levels.filter(level => {

        return (
            melon.storage.get(
                storageKey(
                    `played_${level}`
                ),
                false
            ) === true
        );

    }).length;
}


function getFinalMapCount(
    targetLevel = 11
) {

    const levels =
        Object.keys(
            game.var.suikaLevels || {}
        );


    return levels.filter(level => {

        return (
            getStat(
                `maxObject_${level}`
            ) >= targetLevel
        );

    }).length;
}


/*
 * =========================
 * ACHIEVEMENT PROGRESS
 * =========================
 */

function getProgress(
    achievement
) {

    switch (
        achievement.type
    ) {

        case "mergeCount":

            return getStat(
                "mergeCount"
            );


        case "combo":

            return getStat(
                "bestCombo"
            );


        case "score":

            return getStat(
                "bestScore"
            );


        case "gamesPlayed":

            return getStat(
                "gamesPlayed"
            );


        case "mapsPlayed":

            return getPlayedMapCount();


        case "objectLevel": {

            /*
             * Kalau achievement
             * khusus map tertentu.
             */
            if (
                achievement.level
            ) {

                const level =
                    normalizeLevel(
                        achievement.level
                    );


                return getStat(
                    `maxObject_${level}`
                );
            }


            /*
             * Tidak ada level:
             * cari object level tertinggi
             * dari semua map.
             */
            const levels =
                Object.keys(
                    game.var.suikaLevels || {}
                );


            let highest = 0;


            for (
                const level
                of levels
            ) {

                highest =
                    Math.max(
                        highest,

                        getStat(
                            `maxObject_${level}`
                        )
                    );
            }


            return highest;
        }


        case "finalMaps":

            return getFinalMapCount(
                achievement.objectLevel ??
                11
            );


        default:

            return 0;
    }
}


/*
 * =========================
 * REWARD
 * =========================
 */

function giveReward(
    achievement
) {

    const reward =
        Math.max(
            0,

            Math.floor(
                toNumber(
                    achievement.rewardCoin
                )
            )
        );


    if (
        reward <= 0
    ) {
        return;
    }


    /*
     * Ambil coin terbaru.
     *
     * Pakai game.var kalau sudah
     * tersedia, fallback ke storage.
     */
    const currentCoin =
        toNumber(
            game.var.coinValue ??
            melon.storage.get(
                "coinValue",
                0
            )
        );


    game.var.coinValue =
        currentCoin +
        reward;


    melon.storage.set(
        "coinValue",
        game.var.coinValue
    );


    /*
     * Kalau coin UI sedang tampil,
     * langsung update juga.
     */
    game.var.coinObj?.setText?.(
        game.var.coinValue
            .toLocaleString(
                "id-ID"
            )
    );
}


/*
 * =========================
 * UNLOCK
 * =========================
 */

function unlock(
    achievement
) {

    if (
        !achievement?.id
    ) {
        return false;
    }


    /*
     * Sudah unlock sebelumnya.
     *
     * Penting supaya reward
     * tidak diberikan dua kali.
     */
    if (
        isUnlocked(
            achievement.id
        )
    ) {
        return false;
    }


    melon.storage.set(
        storageKey(
            `unlocked_${achievement.id}`
        ),
        true
    );


    melon.storage.set(
        storageKey(
            `unlockedAt_${achievement.id}`
        ),
        Date.now()
    );


    giveReward(
        achievement
    );


    const data = {

        ...achievement,

        progress:
            getProgress(
                achievement
            ),

        unlocked: true
    };




    /*
     * Kirim event ke popup/UI
     * kalau nanti ada.
     */
    for (
        const callback
        of unlockListeners
    ) {

        callback(data);
    }


    return true;
}


/*
 * =========================
 * CHECK ACHIEVEMENTS
 * =========================
 */

function evaluate(
    types = null
) {

    const allowedTypes =
        types
            ? new Set(types)
            : null;


    for (
        const achievement
        of getDefinitions()
    ) {

        if (
            isUnlocked(
                achievement.id
            )
        ) {
            continue;
        }


        /*
         * Hanya cek tipe achievement
         * yang berhubungan dengan
         * event yang baru terjadi.
         */
        if (
            allowedTypes &&
            !allowedTypes.has(
                achievement.type
            )
        ) {
            continue;
        }


        const target =
            Math.max(
                1,

                toNumber(
                    achievement.target,
                    1
                )
            );


        const progress =
            getProgress(
                achievement
            );


        if (
            progress >= target
        ) {

            unlock(
                achievement
            );
        }
    }
}


/*
 * =====================================================
 * PUBLIC API
 * =====================================================
 */

game.achievement = {


    /*
     * Dipanggil ketika gameplay dimulai.
     */
    onLevelStart(
        level =
        game.var.currentLevel
    ) {

        const currentLevel =
            normalizeLevel(level);


        melon.storage.set(
            storageKey(
                `played_${currentLevel}`
            ),
            true
        );


        evaluate([
            "mapsPlayed"
        ]);
    },


    /*
     * Dipanggil setiap merge berhasil.
     */
    onMerge({

        level =
            game.var.currentLevel,

        createdObjLevel = 0,

        comboCount = 0

    } = {}) {

        const currentLevel =
            normalizeLevel(level);


        /*
         * Total merge all-time.
         */
        incrementStat(
            "mergeCount",
            1
        );


        /*
         * Best combo all-time.
         */
        maxStat(
            "bestCombo",
            comboCount
        );


        /*
         * Object tertinggi
         * yang pernah dibuat
         * pada map ini.
         */
        if (
            createdObjLevel > 0
        ) {

            maxStat(
                `maxObject_${currentLevel}`,
                createdObjLevel
            );
        }


        evaluate([
            "mergeCount",
            "combo",
            "objectLevel",
            "finalMaps"
        ]);
    },


    /*
     * Score tertinggi dari
     * satu permainan.
     */
    onScore(
        score =
        game.var.scoreValue
    ) {

        maxStat(
            "bestScore",
            score
        );


        evaluate([
            "score"
        ]);
    },


    /*
     * Dipanggil ketika game over.
     */
    onGameOver({

        score =
            game.var.finalScore

    } = {}) {

        incrementStat(
            "gamesPlayed",
            1
        );


        maxStat(
            "bestScore",
            score
        );


        evaluate([
            "gamesPlayed",
            "score"
        ]);
    },


    /*
     * Dipakai achievement menu.
     */
    getAll() {

        return getDefinitions()
            .map(
                achievement => {

                    const progress =
                        getProgress(
                            achievement
                        );


                    const target =
                        Math.max(
                            1,

                            toNumber(
                                achievement.target,
                                1
                            )
                        );


                    return {

                        ...achievement,

                        progress,

                        target,

                        percent:
                            Math.min(
                                1,
                                progress /
                                target
                            ),

                        unlocked:
                            isUnlocked(
                                achievement.id
                            ),

                        unlockedAt:
                            melon.storage.get(
                                storageKey(
                                    `unlockedAt_${achievement.id}`
                                ),
                                null
                            )
                    };
                }
            );
    },


    getById(id) {

        return (
            this.getAll()
                .find(
                    achievement =>
                        achievement.id === id
                ) ||
            null
        );
    },


    /*
     * Contoh:
     *
     * {
     *   unlocked: 5,
     *   total: 17,
     *   percent: 0.294
     * }
     */
    getCompletion() {

        const achievements =
            this.getAll();


        const unlocked =
            achievements.filter(
                achievement =>
                    achievement.unlocked
            ).length;


        return {

            unlocked,

            total:
                achievements.length,

            percent:
                achievements.length > 0
                    ? unlocked /
                      achievements.length
                    : 0
        };
    },


    /*
     * Listener untuk popup achievement.
     *
     * contoh:
     *
     * game.achievement.onUnlock(data => {
     *     
     * });
     */
    onUnlock(callback) {

        if (
            typeof callback !==
            "function"
        ) {

            return () => {};
        }


        unlockListeners.add(
            callback
        );


        /*
         * Return unsubscribe.
         */
        return () => {

            unlockListeners.delete(
                callback
            );
        };
    },


    isUnlocked,

    reset() {

        /*
        * Reset achievement unlock + stats.
        *
        * Hanya key dengan prefix:
        * achievement_
        */

        const achievements =
            getDefinitions();


        /*
        * Reset unlock data.
        */
        for (
            const achievement
            of achievements
        ) {

            melon.storage.remove(
                storageKey(
                    `unlocked_${achievement.id}`
                )
            );

            melon.storage.remove(
                storageKey(
                    `unlockedAt_${achievement.id}`
                )
            );
        }


        /*
        * Reset global stats.
        */
        const statKeys = [
            "mergeCount",
            "bestCombo",
            "bestScore",
            "gamesPlayed"
        ];


        for (
            const stat
            of statKeys
        ) {

            melon.storage.remove(
                storageKey(
                    `stat_${stat}`
                )
            );
        }


        /*
        * Reset data per-map.
        */
        const levels =
            Object.keys(
                game.var.suikaLevels || {}
            );


        for (
            const level
            of levels
        ) {

            melon.storage.remove(
                storageKey(
                    `played_${level}`
                )
            );

            melon.storage.remove(
                storageKey(
                    `stat_maxObject_${level}`
                )
            );
        }


    },

    /*
     * Untuk debug/manual refresh.
     */
    evaluate() {

        evaluate();
    }
};
/*
 * =========================
 * ACHIEVEMENT POPUP
 * =========================
 */
game.achievement.onUnlock(
    achievement => {

        game.util
            .showAchievementPopup
            ?.(
                achievement
            );
    }
);

window.resetAchievement = game.achievement.reset;
//  End of user code  //


/* The code below will be executed when the script is imported into a component or another script. */
export default () => {
    // Put user code here //
    
    //  End of user code  //
}
