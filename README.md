# Scottie Scalps — Technical Wiki

Live trading dashboard and content infrastructure for [scottiescalps.com](https://scottiescalps.com).

---

## Stack Overview

| Layer | Tool | Purpose |
|---|---|---|
| Frontend | HTML/JS | Dashboard UI |
| Hosting | Vercel | Auto-deploys from this repo |
| Proxy | Cloudflare Workers | API proxy for Binance + CryptoQuant |
| Data (free) | Binance WebSocket | Live price, candles, OI |
| Data (paid) | CryptoQuant Premium API | Funding rates, netflow, taker ratio, etc |
| Performance tracking | Kinfo.io | Trade journal + social sharing |

---

## Live Pages

| URL | Status | Description |
|---|---|---|
| scottiescalps.com | Live | Main site |
| scottiescalps.com/levels | Testing | Live liquidation dashboard |

---

## Cloudflare Worker

**URL:** `https://cryptoquant-proxy.scottchristie049.workers.dev`

Handles two proxy routes via query parameter:

### Binance passthrough
```
?url=https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
```
Passes any Binance REST endpoint through with CORS headers. No auth required — Binance public data is free.

### CryptoQuant proxy
```
?endpoint=/global-metric/open-interest/aggregated-open-interest-by-exchange
```
Prepends the CQ base URL and injects the hardcoded Premium API key. Key is stored in the Worker environment — do not commit it to this repo.

### Why Cloudflare and not Vercel
Vercel serverless function IPs were blocked by CryptoQuant's firewall. Cloudflare Worker IPs are not. All API proxying goes through the Worker — never call CQ directly from the frontend or from Vercel.

---

## Levels Dashboard (scottiescalps.com/levels)

**File:** `levels.html`

### What it does
- Connects to Binance WebSocket for live BTC/ETH/XRP price and 1m candle data
- Displays liquidation levels on a canvas chart
- Shows ping time colour-coded: green / yellow / red
- Light/dark mode toggle

### Data sources
| Data | Source | Method |
|---|---|---|
| Price (BTC/ETH/XRP) | Binance WS | WebSocket stream |
| Candles (1m) | Binance WS | WebSocket stream |
| Liquidation levels | Binance OI (via Worker) | REST, polled |

### CryptoQuant on this page
CQ liquidation endpoint was tested but dropped — CORS issues even via the Worker were not fully resolved for this specific use case. Binance free data is sufficient for the levels dashboard.

---

## CryptoQuant Premium — Available Endpoints

All confirmed working through the Worker. Endpoint paths for `?endpoint=`:

| Data | Endpoint path |
|---|---|
| Funding rates | `/market-indicator/funding-rates-all-exchanges/funding-rates` |
| Open interest | `/global-metric/open-interest/aggregated-open-interest-by-exchange` |
| Taker buy/sell ratio | `/market-indicator/taker-buy-sell-ratio/taker-buy-sell-ratio` |
| Exchange netflow | `/flow-indicator/exchange-flow-sum/exchange-netflow` |
| Whale ratio | `/flow-indicator/exchange-whale-ratio/exchange-whale-ratio` |
| Miner position index | `/miner/miner-postion-index/all-miner` |
| Stablecoin supply ratio | `/market-indicator/stablecoin-supply-ratio/stablecoin-supply-ratio` |

> **Note:** Verify exact endpoint paths against CQ docs — some may have versioning. Test via `?endpoint=` on the Worker URL before building UI.

---

## Planned Builds

### In progress
- [ ] Funding rate heatmap — free daily image card for X/Instagram
- [ ] Taker buy/sell ratio panel — add to levels dashboard

### Next
- [ ] OI delta chart — website + daily post
- [ ] Exchange netflow panel — website + daily post
- [ ] Automated daily snapshot card — scheduled, posts to X at 7am Dubai time

### Long term
- [ ] Paid edge pack page — gated dashboard combining taker ratio, OI delta, netflow, whale ratio
- [ ] BitFunded.io — separate repo when ready

---

## Deployment

1. Edit files locally or via GitHub web editor
2. Push to `main`
3. Vercel auto-deploys — live within ~30 seconds

No build step. Pure HTML/JS — what you push is what goes live.

---

## Environment Variables

| Variable | Where stored | Used by |
|---|---|---|
| CryptoQuant API key | Cloudflare Worker env | Worker only — never in frontend code |

---

## Key Decisions Log

| Decision | Reason |
|---|---|
| Binance WS over CQ for price data | Free, reliable, no auth, sufficient for levels dashboard |
| Cloudflare Worker over Vercel functions | Vercel IPs blocked by CQ firewall |
| Image cards for social content | Screenshot of styled HTML page, post to X with site URL in copy |
| No on-camera content | Screen record + AI voiceover is the content format |

---

## Contacts / Accounts

| Service | Notes |
|---|---|
| Vercel | Connected to this GitHub repo, auto-deploy on push |
| Cloudflare | Worker deployed under scottchristie049 account |
| CryptoQuant | Premium plan — API key in Worker env |
| Tickmill | IB link in social bios |
| Kinfo.io | Trade tracking — connect via Tickmill API |

---

*Last updated: add date when you paste this in*
