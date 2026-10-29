// Repo banner kit — 7 line-pattern styles, Fog palette, 1280 × 320 SVG
// Usage:
//   node make-banner.mjs --style diagonal-drift --repo "my-project" --tagline "What it does." --seed 7 --out banner.svg
//   node make-banner.mjs --all --repo "my-project" --tagline "What it does."      (writes one SVG per style into ./out)
//   node make-banner.mjs --list
// Options: --handle "@aaitor"  --animate false  --seed <n>
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const H = {
  ln: (x1, y1, x2, y2, stroke, sw = 1, op = 1) => ['line', { x1, y1, x2, y2, stroke, 'stroke-width': sw, opacity: op, 'stroke-linecap': 'round' }],
  pa: (d, stroke, sw = 1, op = 1) => ['path', { d, stroke, 'stroke-width': sw, opacity: op, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
};
const ACCENT = '#2a4a78'; // pulse color used by circuit-traces

export const STYLES = {
  'diagonal-drift': {
    id: '1a', name: 'Diagonal drift', anim: 1,
    colors: { bg: '#0e0f11', handle: '#7fa6e0', title: '#f1f1ef', tagline: '#adaaab' },
    fade: [0.32,0.62],
    pattern: function (R) { const o = []; for (let i = 0; i < 95; i++) { const x0 = 360 + i * 10 + R() * 4; const s = R() * 0.6, e = Math.min(1.1, s + 0.15 + R() * 0.6); const lime = R() < 0.06; o.push(H.ln(x0 + s * 340, 330 - s * 340, x0 + e * 340, 330 - e * 340, lime ? '#7d838b' : '#9aabc3', lime ? 2 : 1, lime ? 1 : 0.28 + R() * 0.3)); } return o; },
  },
  'flow-field': {
    id: '1c', name: 'Flow field', anim: 3,
    colors: { bg: '#1d1f22', handle: '#7fa6e0', title: '#f1f1ef', tagline: '#9aabc3' },
    fade: [0.3,0.6],
    pattern: function (R) { const o = []; const a = R() * 6, b = R() * 6; for (let i = 0; i < 170; i++) { let x = 420 + R() * 900, y = R() * 340 - 10; let d = 'M' + x.toFixed(1) + ' ' + y.toFixed(1); for (let s = 0; s < 45; s++) { const ang = Math.sin(x * 0.005 + a) * Math.cos(y * 0.012 + b) * Math.PI + 0.4; x += Math.cos(ang) * 4; y += Math.sin(ang) * 4; d += 'L' + x.toFixed(1) + ' ' + y.toFixed(1); } const lime = R() < 0.05; o.push(H.pa(d, lime ? '#7d838b' : '#657da0', lime ? 1.6 : 1, lime ? 0.9 : 0.22 + R() * 0.3)); } return o; },
  },
  'radial-burst': {
    id: '1e', name: 'Radial burst', anim: 5,
    colors: { bg: '#08090a', handle: '#7fa6e0', title: '#f1f1ef', tagline: '#918c8e' },
    fade: [0.3,0.58],
    pattern: function (R) { const o = []; const cx = 1200, cy = 380; for (let i = 0; i < 150; i++) { const ang = Math.PI * (1.05 + R() * 0.5); const r1 = 40 + R() * 200, r2 = r1 + 80 + R() * 700; const t = R(); const c = t < 0.03 ? '#7d838b' : t < 0.25 ? '#9aabc3' : '#312e2f'; o.push(H.ln(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1, cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2, c, t < 0.03 ? 1.6 : 1, t < 0.25 ? 0.6 : 0.9)); } return o; },
  },
  'data-streams': {
    id: '1f', name: 'Data streams', anim: 6,
    colors: { bg: '#1c3355', handle: '#7fa6e0', title: '#f1f1ef', tagline: '#c9d3e2' },
    fade: [0.34,0.6],
    pattern: function (R) { const o = []; for (let r = 0; r < 25; r++) { const y = 16 + r * 12; let x = 460 + R() * 120; while (x < 1300) { const len = 8 + R() * 130; const t = R(); const c = t < 0.04 ? '#a1969a' : t < 0.4 ? '#f1f1ef' : '#9aabc3'; o.push(H.ln(x, y, x + len, y, c, 2, t < 0.04 ? 1 : 0.25 + R() * 0.5)); x += len + 8 + R() * 50; } } return o; },
  },
  'orbit-arcs': {
    id: '1h', name: 'Orbit arcs', anim: 8,
    colors: { bg: '#14243d', handle: '#7fa6e0', title: '#f1f1ef', tagline: '#adaaab' },
    fade: [0.32,0.58],
    pattern: function (R) { const o = []; const cx = 1140, cy = 340; for (let r = 30; r < 760; r += 13) { let a = Math.PI * (1 + R() * 0.3); while (a < Math.PI * 1.55) { const sw = 0.05 + R() * 0.35; const a2 = Math.min(a + sw, Math.PI * 1.6); const t = R(); const c = t < 0.05 ? '#7d838b' : t < 0.4 ? '#9aabc3' : '#46628c'; o.push(H.pa(`M${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}A${r} ${r} 0 0 1 ${(cx + Math.cos(a2) * r).toFixed(1)} ${(cy + Math.sin(a2) * r).toFixed(1)}`, c, t < 0.05 ? 2 : 1.2, t < 0.05 ? 1 : 0.35 + R() * 0.35)); a = a2 + 0.03 + R() * 0.15; } } return o; },
  },
  'signal-waves': {
    id: '1i', name: 'Signal waves', anim: 9,
    colors: { bg: '#7d838b', handle: '#0f1f38', title: '#0e0f11', tagline: '#0e0f11' },
    fade: [0.36,0.6],
    pattern: function (R) { const o = []; const ph = R() * 6, f = 0.012 + R() * 0.008; for (let i = 0; i < 26; i++) { const base = 8 + i * 12.4; let d = ''; for (let x = 480; x <= 1290; x += 6) { const A = Math.max(0, (x - 560) / 720) ** 1.6 * 34; const y = base + A * Math.sin(x * f + ph + i * 0.22); d += (x === 480 ? 'M' : 'L') + x + ' ' + y.toFixed(1); } o.push(H.pa(d, '#0e0f11', 1.2, 0.35 + (i % 5 === 0 ? 0.4 : 0))); } return o; },
  },
  'circuit-traces': {
    id: '1j', name: 'Circuit traces', anim: 10,
    colors: { bg: '#f1f1ef', handle: '#2a4a78', title: '#0e0f11', tagline: '#4b4948', border: '#d9d6d7' },
    fade: [0.36,0.58],
    pattern: function (R) { const o = []; const g = 16; for (let i = 0; i < 34; i++) { let x = 1296, y = Math.round(R() * 20) * g; let d = `M${x} ${y}`; const segs = 2 + Math.floor(R() * 3); for (let s = 0; s < segs; s++) { x -= (2 + Math.floor(R() * 10)) * g; d += `L${x} ${y}`; if (s < segs - 1) { const dy = (R() < 0.5 ? -1 : 1) * (1 + Math.floor(R() * 2)) * g; x -= Math.abs(dy); y += dy; d += `L${x} ${y}`; } } const hi = R() < 0.22; o.push(H.pa(d, hi ? '#2a4a78' : '#cecccd', hi ? 1.6 : 1.2, 1)); o.push(['circle', { cx: x, cy: y, r: 3.5, fill: '#f1f1ef', stroke: hi ? '#2a4a78' : '#8f8d8c', strokeWidth: 1.4 }]); } return o; },
  },
};

function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kebab = (k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const num = (v) => typeof v === 'number' ? +v.toFixed(2) : v;

function animate(n, kids, R) {
  const sec = (a, b) => (a + R() * (b - a)).toFixed(2) + 's';
  const dash = (arr, a, b) => ({ 'stroke-dasharray': arr, animation: `bnDash ${sec(a, b)} linear infinite`, 'animation-delay': '-' + sec(0, 10) });
  const rows = {}; const out = [];
  kids.forEach((k, i) => {
    const [tag, p] = k;
    if (n === 1) out.push([tag, { ...p, pathLength: 1 }, dash('0.55 0.45', 6, 14)]);
    else if (n === 3) out.push([tag, { ...p, pathLength: 1 }, dash('0.3 0.7', 4, 9)]);
    else if (n === 5) out.push([tag, p, { animation: `bnPulse ${sec(3, 8)} ease-in-out infinite`, 'animation-delay': '-' + sec(0, 8) }]);
    else if (n === 6) { const r = rows[p.y1] || (rows[p.y1] = { d: sec(7, 16), o: '-' + sec(0, 16) }); out.push([tag, p, { animation: `bnDrift ${r.d} ease-in-out infinite alternate`, 'animation-delay': r.o }]); }
    else if (n === 8) out.push([tag, p, { 'transform-box': 'view-box', 'transform-origin': '1140px 340px', animation: `bnSway ${sec(18, 40)} ease-in-out infinite alternate`, 'animation-delay': '-' + sec(0, 40) }]);
    else if (n === 9) out.push([tag, p, { animation: 'bnBob 3.6s ease-in-out infinite alternate', 'animation-delay': (-i * 0.14).toFixed(2) + 's' }]);
    else if (n === 10) { out.push(k); if (tag === 'path') out.push([tag, { ...p, stroke: ACCENT, 'stroke-width': 2, opacity: 1, pathLength: 1 }, dash('0.07 0.93', 3, 7)]); }
    else out.push(k);
  });
  return out;
}

function el([tag, props, style]) {
  const attrs = Object.entries(props).map(([k, v]) => `${kebab(k) === 'path-length' ? 'pathLength' : kebab(k)}="${num(v)}"`).join(' ');
  const st = style ? ` style="${Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')}"` : '';
  return `<${tag} ${attrs}${st}/>`;
}

const KEYFRAMES = '@keyframes bnDash{to{stroke-dashoffset:-1}}@keyframes bnPulse{0%,100%{opacity:.15}50%{opacity:.95}}@keyframes bnDrift{from{transform:translateX(-36px)}to{transform:translateX(36px)}}@keyframes bnSway{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}@keyframes bnBob{from{transform:translateY(-6px)}to{transform:translateY(6px)}}@media (prefers-reduced-motion:reduce){.p *{animation:none!important}}';

export function makeBanner({ style = 'diagonal-drift', repo = 'my-project', tagline = 'One-line description of what this repository does.', handle = '@aaitor', seed = 7, animate: anim = true, fontCss = '' } = {}) {
  const S = STYLES[style]; if (!S) throw new Error('Unknown style: ' + style + '. Use --list.');
  const C = S.colors;
  let kids = S.pattern(rng(seed * 101 + S.anim));
  if (anim) kids = animate(S.anim, kids, rng(seed * 7 + S.anim));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="320" viewBox="0 0 1280 320" role="img" aria-label="${esc(repo)}">
<style>
${esc(fontCss)}
${anim ? KEYFRAMES : ''}
.h{font:500 15px 'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.2px}
.t{font:400 80px 'Instrument Serif',Georgia,'Times New Roman',serif;letter-spacing:-1px}
.d{font:400 20px 'Geist',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif}
</style>
<defs>
  <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0"><stop offset="${S.fade[0]}" stop-color="${C.bg}"/><stop offset="${S.fade[1]}" stop-color="${C.bg}" stop-opacity="0"/></linearGradient>
  <radialGradient id="fog1" cx=".78" cy=".45" r=".55" gradientTransform="translate(.78 .45) scale(1 1.64) translate(-.78 -.45)"><stop offset="0" stop-color="#dce0e4" stop-opacity=".22"/><stop offset=".7" stop-color="#dce0e4" stop-opacity="0"/></radialGradient>
  <radialGradient id="fog2" cx=".95" cy="1" r=".4" gradientTransform="translate(.95 1) scale(1 1.75) translate(-.95 -1)"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1280" height="320" fill="${C.bg}"/>
<g class="p">${kids.map(el).join('')}</g>
<rect width="1280" height="320" fill="url(#fog1)"/>
<rect width="1280" height="320" fill="url(#fog2)"/>
<rect width="1280" height="320" fill="url(#fade)"/>
${C.border ? `<rect x=".5" y=".5" width="1279" height="319" fill="none" stroke="${C.border}"/>` : ''}
<text class="h" x="80" y="100" fill="${C.handle}">${esc(handle)}</text>
<text class="t" x="78" y="180" fill="${C.title}">${esc(repo)}</text>
<text class="d" x="80" y="230" fill="${C.tagline}">${esc(tagline)}</text>
</svg>`;
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const av = process.argv.slice(2); const args = {};
  for (let i = 0; i < av.length; i++) { const k = av[i].replace(/^--/, ''); if (av[i + 1] && !av[i + 1].startsWith('--')) { args[k] = av[i + 1]; i++; } else args[k] = true; }
  if (args.list) { for (const [slug, s] of Object.entries(STYLES)) console.log(`${s.id}  ${slug.padEnd(16)} ${s.name}`); process.exit(0); }
  const dir = dirname(fileURLToPath(import.meta.url));
  const fp = join(dir, 'fonts.css');
  const base = { repo: args.repo, tagline: args.tagline, handle: args.handle, seed: args.seed ? +args.seed : 7, animate: args.animate !== 'false', fontCss: existsSync(fp) ? readFileSync(fp, 'utf8') : '' };
  if (args.all) {
    const outDir = args.out || 'out'; mkdirSync(outDir, { recursive: true });
    for (const slug of Object.keys(STYLES)) { const f = join(outDir, `banner-${slug}.svg`); writeFileSync(f, makeBanner({ ...base, style: slug })); console.log('wrote', f); }
  } else {
    const svg = makeBanner({ ...base, style: args.style || 'diagonal-drift' });
    if (args.out) writeFileSync(args.out, svg); else process.stdout.write(svg);
  }
}
