import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { hundredCoinsSlice } from "../redux/hundred-coin-slice";
import { selectedCoinsSlice } from "../redux/selected-coins-slice";
import { notify } from "../utils/notify";
import { adaptGraph, GraphModel, GraphSocketData } from "../models/graph-model";
import { coinsInfoSlice } from "../redux/coins-info-slice";
import { adaptCoinBackup, adaptCoinInfo, CoinBackupApi, CoinInfoModel, CoinInfoModelApi } from "../models/coin-info-model";


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


    public subscribeToCoinPrices(coins: CoinModel[], onPrice: (graph: GraphModel) => void, onFailure?: () => void): () => void {

        // Nothing selected -- no socket to open, but still return a no-op so the caller
        // can always call the cleanup without checking.
        if (coins.length === 0) return () => { };

        // "btc" + "eth"  ->  "btcusdt@ticker/ethusdt@ticker"
        const streams = coins
            .map(coin => coin.symbol.toLowerCase() + "usdt@ticker")
            .join("/");

        const socket = new WebSocket(appConfig.priceSocketUrl + streams);

        // Tracks whether the close was ours, so unmounting doesn't look like a failure.
        let closedByUs = false;

        // A dead socket fires onerror AND onclose, so without this the caller
        // gets told the feed died twice.
        let reported = false;

        // The service only says the feed is gone. What to show instead is the comp's call.
        const reportFailure = () => {
            if (closedByUs || reported) return;
            reported = true;
            onFailure?.();
        };

        socket.onmessage = event => {
            // Sockets always deliver strings, never objects.
            const socketData: GraphSocketData = JSON.parse(event.data);

            // Turn Binance's { s, c } into our { coin, price }.
            const graph = adaptGraph(socketData, coins);
            if (graph) onPrice(graph);
        };

        socket.onerror = reportFailure;

        // Binance also just drops the socket on a stream it doesn't serve, with no error first.
        socket.onclose = reportFailure;

        return () => {
            closedByUs = true;
            socket.close();
        };
    }


    // What the reports page draws when the socket never came up: the same saved file the
    // coin list falls back on, read for its dollar prices.
    public async getBackupPrices(coins: CoinModel[]): Promise<GraphModel[]> {

        const response = await axios.get<CoinBackupApi[]>(appConfig.hundredCoinsBackupUrl);
        const backupInfo = adaptCoinBackup(response.data);

        const graphs: GraphModel[] = [];

        for (const coin of coins) {
            const info = backupInfo.find(item => item.id === coin.id);

            // A coin the saved file never had gets no card, rather than a NaN chart.
            if (!info) continue;

            graphs.push({ coin: coin, price: info.usd });
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