// End-to-end smoke test: boot, menu, map, locked world card, play, power-up
// shop, revive, result, play again. Fails on any page error.
//
//   python3 -m http.server 8123 &      # from the repo root
//   node scripts/smoke.js [--shots dir]
const { chromium } = require('playwright');

const URL = process.env.URL || 'http://localhost:8123/';
const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const step = async (name, fn) => {
    process.stdout.write(`- ${name} ... `);
    await fn();
    if (shotsDir) await page.screenshot({ path: `${shotsDir}/${name.replace(/\W+/g, '-')}.png` });
    console.log('ok');
  };
  const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
  const T = (fn, arg) => page.evaluate(fn, arg);

  await page.addInitScript(() => { window.__tumpukFastAds = true; });
  await page.goto(URL);

  await step('boot to menu', async () => {
    await page.waitForFunction(() => window.__tumpuk && window.__tumpuk.melon.scene.current() === 'Main', null, { timeout: 60000 });
    expect(await T(() => document.documentElement.lang) === 'id', 'html lang must be id');
  });

  await step('settings opens and closes', async () => {
    await T(() => window.__tumpuk.game.util.openSettings());
    await page.waitForSelector('.modal.settings.show');
    await T(() => document.querySelector('.modal .panel-close').click());
    await page.waitForFunction(() => !document.querySelector('.modal'));
  });

  await step('map shows worlds, Pasar locked', async () => {
    await T(() => window.__tumpuk.game.util.goScene('Maps'));
    await page.waitForFunction(() => window.__tumpuk.melon.scene.current() === 'Maps', null, { timeout: 20000 });
    await page.waitForTimeout(800);
    expect(await T(() => window.__tumpuk.meta.isUnlocked('KEBUN')), 'Kebun open');
    expect(!(await T(() => window.__tumpuk.meta.isUnlocked('PASAR'))), 'Pasar locked');
    await T(() => window.__tumpuk.game.ui.showWorldLocked('PASAR'));
    await page.waitForSelector('.modal.locked.show');
    await T(() => document.querySelector('.modal .panel-close').click());
    await page.waitForFunction(() => !document.querySelector('.modal'));
  });

  await step('play Kebun and drop objects', async () => {
    await T(() => window.__tumpuk.game.util.goScene('Gameplay', { level: 'KEBUN' }));
    await page.waitForFunction(() => window.__tumpuk.melon.scene.current() === 'Gameplay', null, { timeout: 20000 });
    await page.waitForTimeout(2500);
    await page.waitForSelector('.tutorial.show', { state: 'attached' });
    for (let i = 0; i < 8; i++) {
      await page.mouse.move(120 + i * 20, 300);
      await page.mouse.down();
      await page.mouse.up();
      await page.waitForTimeout(700);
    }
    expect(!(await page.$('.tutorial.show')), 'tutorial hides after the first drop');
    const next = await T(() => document.querySelector('.next img').getAttribute('src'));
    expect(/ui\/obj\/kebun\/\w+\.webp/.test(next || ''), 'next preview shows an object: ' + next);
  });

  await step('empty power-up opens shop, rewarded ad grants it', async () => {
    await T(() => window.__tumpuk.meta.setSkillCount('hammer', 0));
    await T(() => window.__tumpuk.game.ui.trySkill('hammer', () => { window.__tumpuk.game.var.skillActive = 'hammer'; }));
    await page.waitForSelector('.modal.shop.show');
    await T(() => document.querySelector('.modal.shop [data-act="ad"]').click());
    await page.waitForSelector('.ad-close:not([disabled])');
    await T(() => document.querySelector('.ad-close').click());
    await page.waitForFunction(() => window.__tumpuk.game.var.skillActive === 'hammer');
    await page.waitForSelector('.skill-banner.show');
    await T(() => document.querySelector('.skill-cancel').click());
    expect(await T(() => window.__tumpuk.meta.skillCount('hammer')) === 1, 'cancel refunds the hammer');
  });

  await step('game over offers revive, revive continues', async () => {
    await T(() => window.__tumpuk.me.state.current().triggerGameOver());
    await page.waitForSelector('.modal.revive.show');
    await T(() => document.querySelector('.modal.revive [data-act="ad"]').click());
    await page.waitForSelector('.ad-close:not([disabled])');
    await T(() => document.querySelector('.ad-close').click());
    await page.waitForFunction(() => !window.__tumpuk.game.var.isGameOver && !document.querySelector('.modal'));
  });

  await step('second game over shows result', async () => {
    await page.waitForTimeout(500);
    await T(() => window.__tumpuk.me.state.current().triggerGameOver());
    await page.waitForSelector('.modal.result.show');
    expect(!(await page.$('.modal.revive')), 'revive is offered once per round');
    const coins = await T(() => window.__tumpuk.meta.coins());
    expect(coins >= 0, 'coins saved');
  });

  await step('main lagi restarts the round', async () => {
    await T(() => document.querySelector('.modal.result [data-act="again"]').click());
    await page.waitForFunction(() => !document.querySelector('.modal') && window.__tumpuk.game.var.scoreValue === 0 && !window.__tumpuk.game.var.isGameOver, null, { timeout: 15000 });
  });

  await browser.close();
  if (errors.length) {
    console.error('Page errors:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('smoke ok');
})().catch((e) => { console.error(e); process.exit(1); });
