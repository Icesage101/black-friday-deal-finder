# black-friday-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Icesage101/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Icesage101/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealSleuth is a static Black Friday and Cyber Monday 2026 deal finder: 47 real deals across 8 categories and 4 stores, each checked on Nov 27, 2026, with its sale price, usual price, discount, store link, check time, source, and an honest verdict (new low, strong price, or routine sale). Search and filters by category, store and discount all work, and the layout works on a phone too. No network requests: the site is plain files under app/ with no build step.

## Run it

```sh
python3 -m http.server 8080 --directory app
```

Then open http://localhost:8080. Or open app/index.html directly in a browser (modules load from file with --allow-file-access-from-files).

## Layout

- `app/` — the site: `index.html`, `style.css`, `app.js` (rendering, search, filters, sorting), `deals.js` (the 47 checked deals), `format.js` (money and percent helpers)
- `screenshots/` — 4 screenshots of the site running, taken in headless Chrome
- `main.ts` — the make.fun hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=h6wxe48a&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
