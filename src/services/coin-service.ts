import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { hundredCoinsSlice } from "../redux/hundred-coin-slice";
import { selectedCoinsSlice } from "../redux/selected-coins-slice";
import { notify } from "../utils/notify";
import { adaptGraph, GraphModel, GraphSocketData, GraphSource } from "../models/graph-model";
import { coinsInfoSlice } from "../redux/coins-info-slice";
import { adaptCoinBackup, adaptCoinInfo, CoinBackupApi, CoinInfoModel, CoinInfoModelApi } from "../models/coin-info-model";
import { walkPrice } from "../utils/price-walk";


/* ----------------------------------------------------------------------------
   Timings for the price feed below.

   How fast a stand-in pushes and how long a stream is given to prove itself are
   both questions of how the feed behaves, so they sit beside it rather than in
   app-config, which holds addresses.
   ---------------------------------------------------------------------------- */

// How often a stand-in feed pushes. Deliberately faster than the once a second
// the page samples at, so every sample lands on a value that has actually moved
// -- the same way the real socket, which pushes faster still, always does. The
// pushes in between are read by nobody and are not meant to be.
const SIM_TICK_MS = 250;

// How long a stream has to send a first price before its coin is written off as
// one Binance does not carry.
//
// This is the whole detection mechanism, not a safety net, because Binance never
// says no: subscribe to a pair it does not list and the connection is accepted,
// stays open, and simply never carries that stream. There is no error and no
// close to listen for -- silence is the only signal there is. Listed pairs tick
// about once a second, so anything still quiet after this is not coming.
//
// Counted from the moment the connection is up, not from when it was asked for.
// A slow handshake otherwise eats most of the window and starts writing off
// coins the feed does carry, which is how the same coin ends up labelled real on
// one visit and mock on the next.
const LIVE_GRACE_MS = 4000;


class CoinService {


    // Hybrid service, which requires both the server in the initial load, and the global state:
    public async getHundredCoins(): Promise<CoinModel[]> {

        // Check if stored in the global state Fetch from here. IF NOT CONTINUE!!
        if (store.getState().hundredCoins.length > 0) {
            return store.getState().hundredCoins;
        }

        // The API can go down or rate-limit us, so a rejected call becomes null instead of throwing.
        const response = await axios.get<CoinModel[]>(appConfig.hundredCoinsUrl).catch(() => null);

        let hundredCoins = Array.isArray(response?.data) ? response.data : [];

        // Nothing usable came back -- fall back to the local copy.
        if (hundredCoins.length === 0) {
            const backup = await axios.get<CoinModel[]>(appConfig.hundredCoinsBackupUrl);
            hundredCoins = backup.data;
            notify.error("Live coin data is unavailable, showing saved data instead.");
        }

        // Fetches the 100 coins info in one call:

        const coinIdsString = hundredCoins.map(c => c.id).join(",");
        this.initCoinInfo(coinIdsString);




        // Store in global state!!!
        const action = hundredCoinsSlice.actions.initHundredCoins(hundredCoins);
        store.dispatch(action);

        return hundredCoins;
    }


    /* Open a price feed for every selected coin and push each new price back.

       Binance carries nowhere near every coin the list offers, and the way it
       turns one down is the whole problem this solves: it does not. Subscribing
       to a pair it does not list is accepted without complaint, the connection
       stays up, and that stream simply never arrives. No error, no close, no
       message -- the coin just never appears, which is why coins used to go
       missing from this page with nothing anywhere saying why.

       So silence is what gets watched. Every coin that has not sent a price by
       the time the grace period is up is written off and moved onto a stand-in
       feed seeded from `seeds`, which pushes at the same rate the real one does.
       The caller is handed prices either way and told on each one which kind it
       is holding.

       A coin is classified once and the verdict then sticks. That is not tidiness,
       it is the whole reason the page holds still: the copy above the charts names
       the simulated coins by name, so a coin allowed to drift back and forth
       between the two feeds rewrites that sentence several times a second. Binance
       does occasionally start carrying a stream long after the grace period, and
       when it does the price is recorded but not passed on.

       `seeds` is read rather than fetched here so that the moment a coin is
       written off there is already a price to walk away from, with no gap. */
    public subscribeToCoinPrices(coins: CoinModel[], seeds: GraphModel[], onPrice: (graph: GraphModel) => void): () => void {

        // Nothing selected -- no feed to open, but still return a no-op so the caller
        // can always call the cleanup without checking.
        if (coins.length === 0) return () => { };

        // "btc" + "eth"  ->  "btcusdt@ticker/ethusdt@ticker"
        const streams = coins
            .map(coin => coin.symbol.toLowerCase() + "usdt@ticker")
            .join("/");

        // One connection for all of them. An unlisted pair costs nothing here --
        // it is carried as a stream that never speaks, and the others are unaffected.
        const socket = new WebSocket(appConfig.priceSocketUrl + streams);

        // Set the moment the caller tears down, so nothing gets started on the way out.
        let stopped = false;

        // What each coin has been settled as. A coin in here has been decided and
        // the decision is not revisited -- whichever feed it did not end up on is
        // ignored from that point on.
        const settled = new Map<string, GraphSource>();

        // Newest live price per coin, kept so a coin that loses the socket picks up
        // from where it actually was rather than snapping back to a saved price.
        const lastLive = new Map<string, number>();

        // The running stand-ins, by coin. Also stops a coin being handed a second
        // feed to fight the first one over the same card.
        const standIns = new Map<string, number>();

        // The stand-in: a walk pushed on a timer the same way the socket pushes.
        const startStandIn = (coin: CoinModel) => {

            if (stopped || standIns.has(coin.id)) return;

            const seed = seeds.find(item => item.coin.id === coin.id);

            // Where the walk begins: the last price the socket managed to send, or
            // the saved one if it never sent anything at all.
            const base = lastLive.get(coin.id) ?? seed?.price ?? 0;

            // Nothing live and nothing saved, so there is no number to walk away
            // from. Said out loud rather than skipped: a coin that simply never
            // appeared is the bug this whole mechanism exists to stop.
            if (!base) {
                settled.set(coin.id, "unavailable");
                onPrice({ coin: coin, price: 0, source: "unavailable" });
                return;
            }

            settled.set(coin.id, "simulated");

            let price = base;

            const timer = window.setInterval(() => {
                price = walkPrice(price, base);
                onPrice({ coin: coin, price: price, source: "simulated" });
            }, SIM_TICK_MS);

            standIns.set(coin.id, timer);

            // The first walked value is a tick away, so push the price it starts
            // from now -- otherwise the card has nothing to draw until then.
            onPrice({ coin: coin, price: price, source: "simulated" });
        };

        socket.onmessage = event => {
            // Sockets always deliver strings, never objects.
            const socketData: GraphSocketData = JSON.parse(event.data);

            // Turn Binance's { s, c } into our { coin, price }.
            const graph = adaptGraph(socketData, coins);
            if (!graph) return;

            // Recorded even when it is not passed on, so that a coin already on a
            // stand-in still has a real price to fall back to if it is ever needed.
            lastLive.set(graph.coin.id, graph.price);

            // Turned up too late. The page has already told the user this coin is
            // simulated, and taking the price now would start it flickering between
            // the two.
            const verdict = settled.get(graph.coin.id);
            if (verdict === "simulated" || verdict === "unavailable") return;

            settled.set(graph.coin.id, "live");

            onPrice(graph);
        };

        // Armed on connect rather than here, so the window is time spent actually
        // listening and not time spent waiting for the handshake.
        let grace = 0;

        socket.onopen = () => {

            if (stopped) return;

            // Time's up: whoever has not spoken is not going to.
            grace = window.setTimeout(() => {
                for (const coin of coins) {
                    if (!settled.has(coin.id)) startStandIn(coin);
                }
            }, LIVE_GRACE_MS);
        };

        /* The connection dying is the one failure Binance does report, and it takes
           every coin still riding on it at once. They carry on from their last live
           price, which reads better than snapping back to a saved one. A connection
           that never came up at all lands here too, which is what covers the coins
           the grace period above never got the chance to judge.

           This is the one place a live verdict is torn up, and it is torn up because
           it stopped being true. It happens once, so the copy above the charts is
           rewritten once and then holds still again. */
        const handleDeath = () => {

            if (stopped) return;

            window.clearTimeout(grace);

            for (const coin of coins) {

                if (settled.get(coin.id) === "live") settled.delete(coin.id);

                // Anything still settled is already simulated or already known to
                // have no price at all, and neither is changed by the socket dying.
                if (settled.has(coin.id)) continue;

                startStandIn(coin);
            }
        };

        socket.onerror = handleDeath;
        socket.onclose = handleDeath;

        return () => {
            stopped = true;
            window.clearTimeout(grace);
            for (const timer of standIns.values()) window.clearInterval(timer);
            socket.close();
        };
    }


    /* The starting prices the stand-in feeds walk away from.

       Two sources, best first. Global state already holds a dollar price for every
       coin, fetched from CoinGecko when the list loaded, and that is the freshest
       number the app has -- a simulated card seeded from it starts at roughly what
       the coin is really worth. The saved file is the fallback, and only worth a
       round trip when global state cannot cover the whole selection.

       Fetched by the comp before it subscribes, so a coin the socket turns out to
       refuse has a number waiting for it the instant that becomes clear. */
    public async getSeedPrices(coins: CoinModel[]): Promise<GraphModel[]> {

        const storedInfo = store.getState().coinsInfo;

        const findStored = (coinId: string) => storedInfo.find(item => item.id === coinId && item.usd);

        // Every selected coin already priced in global state means nothing to fetch.
        const covered = coins.every(coin => findStored(coin.id));

        let backupInfo: CoinInfoModel[] = [];

        if (!covered) {
            const response = await axios.get<CoinBackupApi[]>(appConfig.hundredCoinsBackupUrl);
            backupInfo = adaptCoinBackup(response.data);
        }

        const graphs: GraphModel[] = [];

        for (const coin of coins) {

            const info = findStored(coin.id) ?? backupInfo.find(item => item.id === coin.id);

            // A coin neither source has a price for gets no seed. The subscription
            // reports it as having no data rather than leaving it blank.
            if (!info?.usd) continue;

            graphs.push({ coin: coin, price: info.usd, source: "simulated" });
        }

        return graphs;
    }



    // Services which don't require The server!
    public selectOneCoin(coin: CoinModel): void {
        try {
            const action = selectedCoinsSlice.actions.selectedCoin(coin);
            store.dispatch(action);
        } catch (err: any) { notify.error(err.message) }


    }

    public unSelectOnceCoin(coinId: string): void {

        const action = selectedCoinsSlice.actions.unSelectCoin(coinId);
        store.dispatch(action);
    }


    public async initCoinInfo(coinIds: string): Promise<CoinInfoModel[]> {

        console.log("Fetching Coin Info Data")
        const response = await axios.get<CoinInfoModelApi>(appConfig.hundredCoinsCurrencyUrl + coinIds + "&vs_currencies=usd,eur,ils");
        const coinsInfo = adaptCoinInfo(response.data);


        const action = coinsInfoSlice.actions.initHundredCoinInfo(coinsInfo);
        store.dispatch(action);

        return coinsInfo;
    }

}

export const coinService = new CoinService();

//An init function that activates in the getHundred coins function,
// which stores the initial 100 coin's currency in the global state.

// function that fetches all the 100 coins from the global state,
// takes their coinId's puts it in the argument of a another func, which fethces all the 100 coin's currency.
// this function, replaces the current 100 coins info with the new 100 coins.

// a button function that takes this coinId whithin its argument,
// and fetches from the global state, a single coin value.

//What needs too be within the global state


//TOTAL FUNCS IN THE SERVICE:
// SEPERATION OF CONCERN:
// 1. FUNC THAT FETCHES DATA FROM THE API.
// 2. A FUNC THAT ACTIVATES EACH MIN TOO FETCH DATA FROM THE API AND STORE STORES IT IN THE GLOBAL STATE, AND THE SECOND AND MORE TIMES IT ACTIVATES IT RECYCLES THE GLOBAL STATE MORE INFO SLICE
// 3. A SINGLE COIN INFO FUNC, THAT FETCHES DATA FROM A SINGLE COIN ONLY FROM THE GLOBAL STATE