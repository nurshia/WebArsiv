#!/usr/bin/env node
/**
 * index.html'deki animasyonu kare kare MP4 videoya çevirir.
 *
 *   node render.mjs                   → 9:16 Reels + 4:5 gönderi videosu (müzikli) + kapak görselleri
 *   node render.mjs --format reels    → sadece 9:16 (reels | feed | all)
 *   node render.mjs --sessiz          → ayrıca müziksiz kopya (Instagram'dan kendi müziğini eklemek için)
 *   node render.mjs --kare 3,6.5,12   → video yerine sadece o saniyelerin PNG karelerini çıkarır
 *   node render.mjs --kapak 8.2       → kapak görseli için kullanılacak saniye
 *   node render.mjs --fps 30 --crf 19 → kare hızı / kalite (düşük crf = yüksek kalite, büyük dosya)
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DIR, 'cikti');
const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf('--' + name);
  if (i === -1) return def;
  const next = argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
};

const FPS = Number(opt('fps', 30));
const CRF = Number(opt('crf', 19));
const KAPAK = Number(opt('kapak', 8.2));
const STILLS = opt('kare', null);
const SILENT = Boolean(opt('sessiz', false));
const FORMAT = String(opt('format', 'all'));
const FORMATS = FORMAT === 'all' ? ['reels', 'feed'] : [FORMAT];
const SIZE = { reels: [1080, 1920], feed: [1080, 1350] };
const NAME = { reels: 'yazilim-dersleri-reels', feed: 'yazilim-dersleri-4x5' };
const COVER = { reels: 'kapak-reels.jpg', feed: 'kapak-4x5.jpg' };

for (const f of FORMATS) if (!SIZE[f]) throw new Error(`Bilinmeyen format: ${f} (reels | feed | all)`);

async function ffmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    const mod = await import('ffmpeg-static');
    if (mod.default) return mod.default;
  } catch { /* kurulu değil → sistemdeki ffmpeg */ }
  return 'ffmpeg';
}

function run(bin, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', d => (err += d));
    p.on('error', reject);
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${bin} hata verdi (${code}):\n${err.slice(-1500)}`))));
  });
}

const ff = await ffmpegPath();
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars'],
});

try {
  for (const fmt of FORMATS) {
    const [w, h] = SIZE[fmt];
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    page.on('pageerror', e => console.error('  [sayfa hatası]', e.message));
    page.on('console', m => m.type() === 'error' && console.error('  [konsol]', m.text()));
    await page.goto(pathToFileURL(join(DIR, 'index.html')).href + `?render=1&format=${fmt}`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 60_000 });
    const duration = await page.evaluate(() => window.DURATION);

    if (STILLS) {
      const dir = join(OUT, 'kareler');
      mkdirSync(dir, { recursive: true });
      for (const s of String(STILLS).split(',').map(Number)) {
        await page.evaluate(t => window.renderFrame(t), s);
        const file = join(dir, `${fmt}-${s.toFixed(2)}.png`);
        await page.screenshot({ path: file });
        console.log('  kare →', file);
      }
      await page.close();
      continue;
    }

    console.log(`\n▶ ${fmt} (${w}×${h}, ${duration} sn, ${FPS} fps)`);
    const wav = join(OUT, `.${fmt}-muzik.wav`);
    const tmp = join(OUT, `.${fmt}-video.mp4`);

    console.log('  müzik sentezleniyor…');
    writeFileSync(wav, Buffer.from(await page.evaluate(() => window.exportAudioWav()), 'base64'));

    const total = Math.round(duration * FPS);
    const enc = spawn(ff, [
      '-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF), '-tune', 'animation',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-g', String(FPS * 2),
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
      '-an', tmp,
    ], { stdio: ['pipe', 'ignore', 'pipe'] });
    let encErr = '';
    enc.stderr.on('data', d => (encErr += d));
    const encDone = new Promise((res, rej) => enc.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg: ' + encErr.slice(-1500))))));

    const started = Date.now();
    for (let i = 0; i < total; i++) {
      await page.evaluate(t => window.renderFrame(t), i / FPS);
      const png = await page.screenshot({ type: 'png' });
      if (!enc.stdin.write(png)) await once(enc.stdin, 'drain');
      if (i % FPS === FPS - 1 || i === total - 1) {
        const pct = (((i + 1) / total) * 100).toFixed(0).padStart(3);
        process.stdout.write(`\r  kareler: ${pct}%  (${i + 1}/${total}, ${((Date.now() - started) / 1000).toFixed(0)} sn)`);
      }
    }
    enc.stdin.end();
    await encDone;
    process.stdout.write('\n');

    const final = join(OUT, NAME[fmt] + '.mp4');
    await run(ff, ['-y', '-loglevel', 'error', '-i', tmp, '-i', wav, '-map', '0:v', '-map', '1:a',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', final]);
    console.log('  video →', final);
    if (SILENT) {
      const silent = join(OUT, NAME[fmt] + '-sessiz.mp4');
      await run(ff, ['-y', '-loglevel', 'error', '-i', tmp, '-c', 'copy', '-movflags', '+faststart', silent]);
      console.log('  müziksiz →', silent);
    }

    await page.evaluate(t => window.renderFrame(t), KAPAK);
    const cover = join(OUT, COVER[fmt]);
    await page.screenshot({ path: cover, type: 'jpeg', quality: 92 });
    console.log('  kapak →', cover);

    rmSync(tmp, { force: true });
    rmSync(wav, { force: true });
    await page.close();
  }
} finally {
  await browser.close();
}
