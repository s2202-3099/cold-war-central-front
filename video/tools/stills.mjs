// Render many stills with one bundle: node tools/stills.mjs <list file: "Comp name frame" per line> <outdir>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';
const [list, outDir] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
fs.mkdirSync(outDir, {recursive: true});
const comps = {};
for (const line of fs.readFileSync(list, 'utf8').trim().split('\n')) {
  const [id, name, frame] = line.split(' ');
  comps[id] ??= await selectComposition({serveUrl, id, inputProps: {}, browserExecutable});
  await renderStill({serveUrl, composition: comps[id], frame: +frame, output: `${outDir}/${id}_${name}.png`, scale: 0.5, browserExecutable});
  process.stdout.write(name + ' ');
}
console.log('done');
