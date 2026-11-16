My personal website inspired by the original WII home screen.

`/good-food` is a Hell’s Kitchen inspired P-House tracker. Every reload (or **Refresh schedule**) fetches the latest `commands/scheduled/goodfood.go` from [RITSEC’s OBIII](https://github.com/ritsec/ops-bot-iii/blob/main/commands/scheduled/goodfood.go), then reads its recurring `makePing` cron entries. All dates and countdowns use `America/New_York`, including daylight saving time. The photo is the Good Food image linked by OBIII.

The bot lists weekly start times, not service end times or cancellations. The page links to [RIT’s official visiting chef calendar](https://www.rit.edu/dining/visiting-chefs) for current exceptions and additional visits. If GitHub is unavailable, a previously fetched schedule is clearly marked as a saved copy with its check time; no schedule is invented on first-load failure.

Vite emits `dist/good-food/index.html` for direct navigation on static hosting. Build with `npm run build`; check schedule parsing, refresh behavior, and campus time calculations with `node --test tests/goodFood.test.js`.

web design Inspired by:
