import opentype from "opentype.js";
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, readFileSync } from "fs";
import os from "os";

const FONTS = `${os.homedir()}/.fonts`;
const load = (f) => opentype.parse(readFileSync(`${FONTS}/${f}`).buffer.slice(readFileSync(`${FONTS}/${f}`).byteOffset, readFileSync(`${FONTS}/${f}`).byteOffset + readFileSync(`${FONTS}/${f}`).byteLength));
const semibold = load("Geist-SemiBold.ttf");
const medium = load("Geist-Medium.ttf");

// ---- Brightseed restrained warning palette (tinted toward forest brand) ----
const C = {
  surface: "#FBF2E2",      // warm amber-50 surface tint
  border:  "#E8D2A4",      // amber-200 hairline
  accent:  "#B5701C",      // amber-700 line-art accent
  primary: "#16241C",      // forest near-black (brand text)
  secondary:"#5E6356",     // muted warm neutral (AA on surface)
};

// Lay out a string as outlined glyph paths with letter spacing.
function glyphPaths(font, text, x, baseline, size, tracking) {
  const scale = size / font.unitsPerEm;
  let cx = x;
  const d = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    const p = g.getPath(cx, baseline, size);
    const data = p.toPathData(3);
    if (data && data !== "Z") d.push(data);
    cx += g.advanceWidth * scale + tracking;
  }
  return { d: d.join(" "), width: cx - tracking - x };
}
function advance(font, text, size, tracking) {
  const scale = size / font.unitsPerEm;
  let w = 0;
  for (const ch of text) w += font.charToGlyph(ch).advanceWidth * scale + tracking;
  return w - tracking;
}

// Line-art "caution" tile: rounded square outline + diagonal hazard stripes.
function cautionTile(x, y, s) {
  const r = s * 0.26;
  const sw = Math.max(1.6, s * 0.05);          // square stroke
  const stripeW = Math.max(2.2, s * 0.085);    // stripe stroke
  const clip = `clip${Math.round(x)}${Math.round(y)}`;
  // diagonals across the tile (bottom-left to top-right)
  const lines = [];
  const step = s * 0.30;
  for (let o = -s; o < s * 1.6; o += step) {
    lines.push(`<line x1="${x + o}" y1="${y + s}" x2="${x + o + s}" y2="${y}"/>`);
  }
  return `
    <defs><clipPath id="${clip}">
      <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" ry="${r}"/>
    </clipPath></defs>
    <g clip-path="url(#${clip})" stroke="${C.accent}" stroke-width="${stripeW}" stroke-linecap="round" fill="none">
      ${lines.join("\n      ")}
    </g>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${r}" ry="${r}"
          fill="none" stroke="${C.accent}" stroke-width="${sw}"/>`;
}

function buildFull() {
  const padX = 24, H = 78, icon = 40;
  const gap = 16;
  const iconX = padX, iconY = (H - icon) / 2;
  const textX = padX + icon + gap;

  const pTxt = "UNDER CONSTRUCTION", pSize = 19, pTrack = 1.7;
  const sTxt = "Work in progress · not final", sSize = 12.5, sTrack = 0.15;
  const pBase = 35, sBase = 54;

  const pW = advance(semibold, pTxt, pSize, pTrack);
  const sW = advance(medium, sTxt, sSize, sTrack);
  const contentW = Math.max(pW, sW);
  const W = Math.round(textX + contentW + padX);

  const p = glyphPaths(semibold, pTxt, textX, pBase, pSize, pTrack);
  const s = glyphPaths(medium, sTxt, textX, sBase, sSize, sTrack);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15" ry="15"
        fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>
  ${cautionTile(iconX, iconY, icon)}
  <path d="${p.d}" fill="${C.primary}"/>
  <path d="${s.d}" fill="${C.secondary}"/>
</svg>`;
}

function buildCompact() {
  const padX = 18, H = 50, icon = 26, gap = 12;
  const iconX = padX, iconY = (H - icon) / 2;
  const textX = padX + icon + gap;
  const pTxt = "UNDER CONSTRUCTION", pSize = 15, pTrack = 1.5;
  const pBase = H / 2 + pSize * 0.34;
  const pW = advance(semibold, pTxt, pSize, pTrack);
  const W = Math.round(textX + pW + padX);
  const p = glyphPaths(semibold, pTxt, textX, pBase, pSize, pTrack);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="12" ry="12"
        fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>
  ${cautionTile(iconX, iconY, icon)}
  <path d="${p.d}" fill="${C.primary}"/>
</svg>`;
}

function renderPng(svg, scale, out) {
  const r = new Resvg(svg, { fitTo: { mode: "zoom", value: scale }, background: "rgba(0,0,0,0)" });
  writeFileSync(out, r.render().asPng());
}

const full = buildFull();
const compact = buildCompact();
const OUT = process.argv[2] || ".";
writeFileSync(`${OUT}/under-construction-badge.svg`, full);
writeFileSync(`${OUT}/under-construction-badge-compact.svg`, compact);
renderPng(full, 3, `${OUT}/under-construction-badge.png`);
renderPng(compact, 3, `${OUT}/under-construction-badge-compact.png`);
console.log("done");
