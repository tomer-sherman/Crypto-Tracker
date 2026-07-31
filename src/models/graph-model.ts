import { CoinModel } from "./coin-model";

// 1. The Messy Socket Type (Data Transfer Object)
export type GraphSocketData = {
    stream: string;
    data: {
        s: string;  // Pair symbol, "BTCUSDT"
        c: string;  // Last price, as a string
    };
};

/* Where the price on a card came from.

   The live feed carries nowhere near every coin the list offers, so this page is
   normally a mix and every card has to be able to say out loud which kind it is:

   "live"        — straight off the socket. Real market data.
   "simulated"   — the socket does not carry this coin, so the card starts from
                   the last market price the app has for it and walks from there.
   "unavailable" — not on the socket and with no price anywhere to fall back on,
                   so there is no number to draw at all.

   Three values rather than a boolean, because "not live" on its own cannot tell
   a made-up price apart from no price. */
export type GraphSource = "live" | "simulated" | "unavailable";

// 2. The Clean App Type (Domain Model)
export type GraphModel = {
    coin: CoinModel;

    // Always read through `source`: on an "unavailable" coin this is 0 and means
    // nothing at all.
    price: number;

    source: GraphSource;
};

// 3. The Adapter Function
export const adaptGraph = (data: GraphSocketData, coins: CoinModel[]): GraphModel | null => {

    const pair = data.data.s.toUpperCase();

    // Matched whole rather than by prefix. The list is full of short symbols that
    // are the start of longer ones -- u, m, cc, gt, usd1, usde -- and a prefix
    // test hands "USDCUSDT" to whichever of them happens to sit earlier in the
    // array, putting one coin's price on another coin's card. The pair is built
    // as symbol + "usdt" on the way out, so it can be rebuilt exactly on the way in.
    const coin = coins.find(item => pair === item.symbol.toUpperCase() + "USDT");
    if (!coin) return null;

    return {
        coin: coin,
        price: parseFloat(data.data.c),
        source: "live"
    };
};
