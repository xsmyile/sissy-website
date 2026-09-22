#!/usr/bin/env node
/**
 * Builds `public/sprite.svg` from the brand and vendor marks under `src/assets`.
 *
 * Every surface that draws Sissy or a provider mark does it with
 * `<use href="/sprite.svg#id">`, so the silhouette, its eye and the vendor
 * marks ship once and take each surface's own `currentColor`. Re-run after
 * changing any source file:
 *
 *     npm run sprite
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public/sprite.svg");

const SYMBOLS = [
  { id: "sissy", source: "src/assets/brand/sissy-silhouette.svg" },
  { id: "sissy-body", source: "src/assets/brand/sissy-body.svg" },
  { id: "sissy-eye", source: "src/assets/brand/sissy-eye.svg" },
  { id: "mark-claude-code", source: "src/assets/marks/claude.svg" },
  { id: "mark-codex", source: "src/assets/marks/codex.svg" },
  { id: "mark-github", source: "src/assets/marks/github.svg" },
  { id: "mark-gitlab", source: "src/assets/marks/gitlab.svg" },
];

function symbolFrom(id, svg, source) {
  const root = svg.match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
  const viewBox = root?.[1].match(/viewBox="([^"]+)"/)?.[1];
  if (!root || !viewBox) {
    throw new Error(`${source}: expected an <svg> root with a viewBox`);
  }
  const fill = root[1].match(/fill="([^"]+)"/)?.[1];
  const attributes = fill ? ` viewBox="${viewBox}" fill="${fill}"` : ` viewBox="${viewBox}"`;
  const body = root[2].replace(/<title>[\s\S]*?<\/title>|<desc>[\s\S]*?<\/desc>/g, "").trim();
  return `<symbol id="${id}"${attributes}>${body}</symbol>`;
}

const symbols = await Promise.all(
  SYMBOLS.map(async ({ id, source }) => {
    const svg = await readFile(path.join(ROOT, source), "utf8");
    return symbolFrom(id, svg, source);
  }),
);

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join("\n")}\n</svg>\n`;
await writeFile(OUTPUT, sprite, "utf8");
console.log(`wrote ${path.relative(ROOT, OUTPUT)} with ${symbols.length} symbols`);
