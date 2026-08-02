# Crypto Tracker

Browse the top 100 crypto coins, watch their prices tick in live on a hand-built SVG chart, and ask an AI whether a coin is worth buying.

**[Live app →](https://sherman-crypto-tracker.firebaseapp.com/home)** · React 19 · TypeScript · Redux Toolkit · Vite · Firebase

<!-- TODO: add a short GIF of the Reports page here — 3-6 seconds of several charts ticking.
     Save it as docs/reports.gif and uncomment the line below.
![Five coins updating once per second on the Reports page](docs/reports.gif)
-->

---

## The problem that shaped the app

Early on, every "More Info" click fired its own API request — and I kept hitting **429 Too Many Requests**.

I did some research and found out that CoinGecko only updates that data every 1–5 minutes anyway, so fetching a single coin on every click was buying me nothing. So I flipped it around: **one call for all 100 coins, cached in global state, refreshed every 60 seconds.** Clicking "More Info" now just reads from the cache — zero extra requests.

That rule ended up shaping the rest of the app. The graph's fallback prices check the cache first and only fetch when the cache doesn't cover every selected coin ([`graph-service.ts`](src/services/graph-service.ts)), and the coin list returns what's already in state instead of refetching ([`coin-service.ts`](src/services/coin-service.ts)).

---

## What it does

- Fetches the **top 100 coins** from the CoinGecko API and lets you browse, search and page through them.
- Shows each coin's price in **three currencies** (USD, EUR, ILS), refreshed once a minute.
- Draws a **live price graph** for up to 5 coins you select, updating once per second from a WebSocket feed.
- Gives you an **AI opinion** on any selected coin, powered by OpenAI's `gpt-4o-mini`.

### The pages

| Page | What it does |
|------|--------------|
| **Home** | All 100 coins in a paged grid. Search for coins, open a price panel on any coin, and tick up to 5 coins to track. |
| **Reports** | A live graph per selected coin, updated every second — real market data or simulated, see the note below. |
| **AI Recommendation** | For each coin you selected, a button that asks the AI whether you should buy it. |
| **About** | A short page about me and the project. |

> ⚠️ **About the graph data:** the price socket I use (Binance) doesn't carry every one of the 100 coins. When a coin isn't on the feed, the app falls back to its last known cached price and simulates realistic movement from there — so the graph still works, and it's clearly marked as simulated.

---

## Tech stack

| Tool | Role |
|------|------|
| **React 19 + TypeScript** | The foundation of the app. |
| **Vite** | Dev server and build tool. |
| **Redux Toolkit** | Global state (coins, selection, search, price cache). |
| **React Router DOM** | Routing between pages. |
| **Axios** | All HTTP requests. |
| **iziToast** | Pop-up success and error messages. |
| **CoinGecko API** | Coin list, prices, and single-coin market data. |
| **Binance WebSocket** | Live price feed for the graphs. |
| **OpenAI `gpt-4o-mini`** | The AI insight page. |
| **Firebase Hosting** | Deployment. |

---

## Running it locally

```bash
npm install
npm start
```

You'll need a `.env` file in the project root with your OpenAI key:

```
VITE_OPENAI_API_KEY=your-key-here
```

> 🔐 **On that key:** Vite inlines any `VITE_`-prefixed variable straight into the client bundle at build time, so a browser-held key is a public key — the `.env` file hides it from git, not from users. The correct architecture is to put the OpenAI call behind a small server function that holds the key and proxies the request; see [What I'd do next](#what-id-do-next).

Other scripts: `npm run build`, `npm run preview`.

---

## Architecture

The whole structure comes down to one goal: **separation of concerns**. Every file should have one job, so the code stays tidy and I can actually find things when the app grows.

### Two kinds of components

- **Micro components** — "dumb" components. Their only job is to display the data they're handed. No fetching, no state.
- **Rendering components** — "smart" components. They fetch data, read global state, handle conditional rendering, and call services.

The rule is strict enough to be annoying — `coin-prices-micro-comp` can't fetch its own prices even though that would be shorter — but it means every micro component is trivially reusable, and I always know which file a bug lives in.

### Project structure

```
src/
├── components/
│   ├── layout-area/     Header, nav menu, footer, routing, and the Layout frame.
│   │                    Only <main> changes between pages — everything else stays put.
│   ├── pages-area/      The actual pages (home, reports, recommendation, about),
│   │                    rendered inside <main>. They mostly just lay things out.
│   ├── crypto-area/     The real feature code, split into 3 sub-areas — one per page.
│   │                    Each sub-area has its own rendering-comps/ and micro-comps/.
│   └── shared-area/     Reusable pieces: pagination menu, skeleton loaders.
├── models/       All the TypeScript types.
├── services/     Everything that fetches or sends data — APIs and global state.
├── utils/        App config and shared logic used in more than one place.
└── redux/        Global state: the 100 coins, the selection, the search query,
                  and the cached price info.
```

---

## Models

I like a consistent shape for my models. It depends on the API:

- If the API returns something simple and straightforward, the model is just **one type**.
- If it doesn't, the model file holds **three things**:
  1. The type the API actually returns.
  2. The type I want to work with in my own code.
  3. An **adapter function** that converts the first into the second.

That way, the messy API shape stops at the model file, and my components — especially the micro components — only ever see clean, readable data.

A good example is [`coin-info-model.ts`](src/models/coin-info-model.ts): CoinGecko returns prices as an object keyed by coin id, and the adapter flattens it into a simple array the app can loop over.

---

## Services

All the data fetching and coin-state writing lives here. There are four:

| Service | Job |
|---------|-----|
| **coin-service** | Everything coin-related: fetching the 100 coins, fetching all their prices in one call, and selecting/unselecting coins. |
| **prompt-service** | Builds the AI request. It fetches the coin's market numbers, plugs them into a hard-coded system prompt + user prompt, sends them off, then sanitizes the answer into a typed model. |
| **gpt-service** | The thin layer that actually talks to the OpenAI API. Takes a system prompt and a user prompt, returns the completion text. |
| **graph-service** | All the WebSocket logic for the Reports page: opening the feed, handing new prices back, and starting a simulated feed for coins the socket doesn't carry. |

---

## Redux — 4 slices

- **hundredCoins** — the top 100 coins, from the API or from my local JSON backup in `public/` when CoinGecko is down (it's quite flaky).
- **selectedCoins** — the coins you're tracking. The limit is 5, but the slice holds **6**. I let the invalid state exist for exactly one render so the modal can name the coin you just picked and ask which of the five to drop — silently rejecting the click would have been simpler state and worse UX.
- **searchQuery** — the current text in the search bar. It updates on every keystroke and drives the filtering of the coin list on the Home page.
- **coinsInfo** — the cached prices (USD, EUR, ILS) of all 100 coins, replaced wholesale every 60 seconds by a single background call. This is the slice the [429 fix](#the-problem-that-shaped-the-app) is built on.

---

## How the harder pages work

### Reports

The page reads your selected coins from global state and opens a **Binance WebSocket** stream for them.

The socket pushes a new price on every single trade, which can be several times a second — far too fast to render. So instead of drawing every message, the page keeps only the **newest price per coin** in a ref, and a clock ticks **once per second**, takes a snapshot, and adds exactly one point to each coin's chart. Each chart keeps its last 60 readings, giving a rolling one-minute window.

There's also fallback handling, because plenty of the 100 coins simply aren't on the Binance feed. After a 4-second grace period, any coin that hasn't received a live price gets a **simulated feed** instead: it starts from that coin's cached price and walks it with small random moves that drift gently back toward the starting price, so the line looks alive without running away. Coins with no usable starting price at all are marked **unavailable**. Every coin is labeled live / simulated / unavailable on screen, so nothing is pretending to be real data.

The chart itself is a hand-written SVG — line, filled area, grid lines and axis labels — with no charting library involved. At 60 points, one line and no zoom or tooltips, a charting library would have cost more bytes than the feature is worth.

### AI Recommendation

Each selected coin gets a card with a **Get AI Insight** button. One press chains two calls: CoinGecko for the coin's market numbers (price, market cap, 24h volume, and 30/60/200-day changes), then OpenAI with a hard-coded system prompt that demands a fixed JSON verdict.

Because models like to wrap their JSON in prose and code fences, [`json-sanitizer.ts`](src/utils/json-sanitizer.ts) strips whatever came around it and parses what's left into a typed `AiAnswerModel` — which is the whole point of typing it, since the card can then style the verdict and the explanation separately. Two chained API calls behind one button is also why the answer takes a moment to arrive.

---

