import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { hundredCoinsSlice } from "../redux/hundred-coin-slice";
import { selectedCoinsSlice } from "../redux/selected-coins-slice";
import { adaptCoinInfo, adaptCoinInfoList, CoinInfoApiData, CoinInfoModel } from "../models/coin-info-model";
import { notify } from "../utils/notify";
import { adaptGraph, GraphModel, GraphSocketData } from "../models/graph-model";
import { coinsInfoSlice } from "../redux/coins-info-slice";


class CoinService {


    // Hybrid service, which requires both the server in the initial load, and the global state:
    public async getHundredCoins(): Promise<CoinModel[]> {

        // Check if stored in the global state Fetch from here. IF NOT CONTINUE!!
        if (store.getState().hundredCoins.length > 0) {
            return store.getState().hundredCoins;
        }

        const response = await axios.get<CoinModel[]>(appConfig.hundredCoinsUrl);
        const hundredCoins = response.data;

        const coinsInfo = hundredCoins.map(c => c.id);



        // Store in global state!!!
        const action = hundredCoinsSlice.actions.initHundredCoins(hundredCoins);
        store.dispatch(action);

        return hundredCoins;
    }





    // Service that always requires the server, Since the info for price always changes And you want too show the user up Too date info
    // There is no need too store this in the global state.
    public async getCoinInfo(coinId: string): Promise<CoinInfoModel> {

        const response = await axios.get<CoinInfoApiData>(appConfig.hundredCoinsCurrencyUrl + "/" + coinId);

        // Turn CoinGecko's nested { market_data: { current_price: { usd, eur, ils } } } into our flat model.
        const coinInfo = adaptCoinInfo(response.data);

        return coinInfo;
    }








    // Live price feed. Unlike the services above there is no "response" to await --
    // the socket stays open and Binance pushes a new price whenever it changes.
    // The caller passes a callback that runs on every push, and gets back a function
    // that closes the socket. The caller MUST call it when it no longer needs prices.
    public subscribeToCoinPrices(coins: CoinModel[], onPrice: (graph: GraphModel) => void): () => void {

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

        socket.onmessage = event => {
            // Sockets always deliver strings, never objects.
            const socketData: GraphSocketData = JSON.parse(event.data);

            // Turn Binance's { s, c } into our { coin, price }.
            const graph = adaptGraph(socketData, coins);
            if (graph) onPrice(graph);
        };

        socket.onerror = () => {
            if (!closedByUs) notify.error("Lost connection to the live price feed.");
        };

        return () => {
            closedByUs = true;
            socket.close();
        };
    }




    // Services which don't require The server!
    public selectOneCoin(coin: CoinModel) {
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

        const response = await axios.get<CoinInfoApiData[]>(appConfig.singleCoinUrl + coinIds);
        const coinsInfo = adaptCoinInfoList(response.data);


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