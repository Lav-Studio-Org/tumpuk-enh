// Bot score distribution per world, used to set the world-unlock targets in
// js/ui/meta.js (WORLD_UNLOCK). Real physics, so it runs in real time.
//
//   python3 -m http.server 8123 &      # from the repo root
//   node scripts/balance.js [games=6] [worlds=KEBUN,PASAR] [parallel=3]
//
// Two bots: "random" drops anywhere, "greedy" drops on the highest object of the
// same type when there is one. A casual human sits roughly between them.
const { chromium } = require('playwright');

const URL = process.env.URL || 'http://localhost:8123/';
const games = Number(process.argv[2] || 6);
const worlds = (process.argv[3] || 'KEBUN').split(',');
const parallel = Number(process.argv[4] || 3);

async function playOne(browser, level, strategy) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(URL);
  await page.waitForFunction(() => window.__tumpuk && window.__tumpuk.melon.scene.current() === 'Main', null, { timeout: 60000 });
  const result = await page.evaluate(async ({ level, strategy }) => {
    const { game, me, melon, meta } = window.__tumpuk;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    meta.setFlag('tutorial');
    melon.storage.set(`world_${level}`, true);
    let done = null;
    game.ui.showRevive = ({ onDecline }) => onDecline();
    game.ui.showResult = (d) => { done = d; };
    game.util.goScene('Gameplay', { level });
    await sleep(3500);
    const objects = game.var.suikaLevels[level];
    const t0 = Date.now();
    let drops = 0;
    while (!done && Date.now() - t0 < 8 * 60 * 1000) {
      const sp = me.game.world.getChildByName('suikaSpawner')[0];
      if (sp && !sp.isDropping && !game.var.isGameOver) {
        let x = sp.minX + Math.random() * (sp.maxX - sp.minX);
        if (strategy === 'greedy') {
          const lvl = objects.indexOf(sp.currentObject) + 1;
          let best = null;
          for (const o of me.game.world.getChildren()) {
            if (o.objLevel !== lvl || !o.getBounds) continue;
            const top = o.getBounds().top;
            if (!best || top < best.top) best = { top, x: o.pos.x };
          }
          if (best) x = Math.min(sp.maxX, Math.max(sp.minX, best.x + (Math.random() - 0.5) * 10));
        }
        sp.spawnX = x;
        sp.dropObject();
        drops++;
      }
      await sleep(650);
    }
    return { score: done ? done.score : game.var.scoreValue, finished: !!done, drops, biggest: done && done.biggest };
  }, { level, strategy });
  await page.close();
  return result;
}

function pct(arr, p) {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
}

(async () => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
  for (const level of worlds) {
    for (const strategy of ['random', 'greedy']) {
      const jobs = Array.from({ length: games }, () => () => playOne(browser, level, strategy));
      const results = [];
      while (jobs.length) {
        const batch = jobs.splice(0, parallel).map((j) => j());
        results.push(...(await Promise.all(batch)));
      }
      const scores = results.map((r) => r.score);
      console.log(JSON.stringify({
        level, strategy, n: scores.length,
        p25: pct(scores, 25), median: pct(scores, 50), p75: pct(scores, 75),
        min: Math.min(...scores), max: Math.max(...scores),
        drops: Math.round(results.reduce((a, r) => a + r.drops, 0) / results.length),
        unfinished: results.filter((r) => !r.finished).length,
        biggest: results.map((r) => r.biggest),
      }));
    }
  }
  await browser.close();
})();
