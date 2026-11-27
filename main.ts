// DealSleuth hand-in program (Node 22, standard library only).
//
// The repository holds a static deal-finder site in app/ and its screenshots
// in screenshots/. This program is what the grader runs: it copies both
// folders into the output directory and writes dossier.json, the summary
// the judge reads, using the kit's vendored library. vendor/makefun-frontend.ts
// must stay exactly as the kit shipped it: the scorer rebuilds the dossier
// with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Start from a clean output directory so a second run writes the same bytes.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const appSource = join(repoRoot, "app");
const shotsSource = join(repoRoot, "screenshots");
if (!existsSync(appSource)) {
  throw new Error("app/ is missing from the repository");
}

cpSync(appSource, join(outputDir, "app"), { recursive: true });
if (existsSync(shotsSource)) {
  cpSync(shotsSource, join(outputDir, "screenshots"), { recursive: true });
}

// The scorer's own caps, from the kit rules: at most 4 screenshots of
// 256 KiB each, app/ at most 993 files and directories and 16 MiB, and
// the dossier text capped at 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);

// A one-line summary on stdout so a local run shows what was handed in.
console.log(
  `DealSleuth hand-in written to ${outputDir} (dossier.json: ${dossier.length} bytes)`,
);
