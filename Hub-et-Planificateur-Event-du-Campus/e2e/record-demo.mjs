import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const videoDir = join(__dirname, '..', 'test-videos');
const baseUrl = 'http://localhost:4200';

if (!existsSync(videoDir)) {
  mkdirSync(videoDir, { recursive: true });
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch (err) {
    console.log('[TEST] Fallback to MS Edge...');
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  }
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();

  const log = (step) => console.log(`[TEST] ${step}`);

  try {
    log('1. Page de connexion');
    await page.goto(baseUrl + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(1500);

    log('2. Connexion étudiant');
    await page.fill('input[name="email"]', 'etudiant@campus.com');
    await page.fill('input[name="password"]', 'etu123');
    await page.click('button.submit-btn, button[type="submit"]');
    await wait(4000);
    if (!page.url().includes('/catalog')) {
      await page.goto(baseUrl + '/catalog', { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    await wait(2000);

    log('3. Catalogue événements');
    await page.goto(baseUrl + '/catalog', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(2000);

    log('4. Détail événement');
    const detailBtn = page.locator('a:has-text("Voir Détails"), button:has-text("Voir Détails")').first();
    if (await detailBtn.count()) {
      await detailBtn.click();
      await wait(2000);
      const enrollBtn = page.locator('button:has-text("inscrire"), button:has-text("Inscrire")').first();
      if (await enrollBtn.count()) {
        log('5. Inscription à un événement');
        await enrollBtn.click();
        await wait(2000);
      }
    }

    log('6. Mes inscriptions');
    await page.goto(baseUrl + '/my-enrollments', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(2000);

    log('7. Déconnexion puis connexion admin');
    await page.evaluate(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
    await page.goto(baseUrl + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.fill('input[name="email"]', 'admin@campus.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await wait(3000);

    log('8. Validation admin');
    await page.goto(baseUrl + '/administrateur/validation', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(2500);

    log('9. Utilisateurs admin');
    await page.goto(baseUrl + '/administrateur/users', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(2000);

    log('10. Rapports admin');
    await page.goto(baseUrl + '/administrateur/reports', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await wait(2000);

    log('Test terminé avec succès');
  } catch (err) {
    console.error('[TEST] Erreur:', err.message);
    try {
      await page.screenshot({ path: join(videoDir, 'error-screenshot.png'), fullPage: true, timeout: 10000 });
    } catch (_) { /* ignore */ }
  }

  const video = page.video();
  await page.close();
  await context.close();

  if (video) {
    const dest = join(videoDir, 'demo-test-ecampus.webm');
    await video.saveAs(dest);
    console.log(`Vidéo sauvegardée: ${dest}`);
  }
  await browser.close();
  console.log(`Dossier vidéos: ${videoDir}`);
}

run();
