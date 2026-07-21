import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { hundredCoinsSlice } from "../redux/hundred-coin-slice";
import { selectedCoinsSlice } from "../redux/selected-coins-slice";
import { CoinInfoModel } from "../models/coin-info-model";
import { notify } from "../utils/notify";
import { CoinCurrencyGraphModel } from "../models/coin-currency-graph-model";

class CoinService {


    // Hybrid service, which requires both the server in the initial load, and the global state:
    public async getHundredCoins(): Promise<CoinModel[]> {

        // Check if stored in the global state Fetch from here. IF NOT CONTINUE!!
        if (store.getState().hundredCoins.length > 0) {
            return store.getState().hundredCoins;
        }

        const response = await axios.get<CoinModel[]>(appConfig.hundredCoinsUrl);
        const hundredCoins = response.data

        // Store in global state!!!
        const action = hundredCoinsSlice.actions.initHundredCoins(hundredCoins);
        store.dispatch(action);

        return hundredCoins;
    }



    // Service that always requires the server, Since the info for price always changes And you want too show the user up Too date info
    // There is no need too store this in the global state.
    public async getCoinInfo(coinId: string): Promise<CoinInfoModel> {

        const response = await axios.get<CoinInfoModel>(appConfig.singleCoinUrl + "/" + coinId);
        const coinInfo = response.data

        return coinInfo;
    }

   
    
    public async getCoinGraph(coinSymbols: string){
        const response = await axios.get<CoinCurrencyGraphModel>(appConfig.selectedCoinsValueUrl + coinSymbols);
        const graphs = response.data

        return graphs
    }





    // Services which don't require The server!
    public async selectOneCoin(coin: CoinModel) {
        try {
            const action = selectedCoinsSlice.actions.selectedCoin(coin);
            store.dispatch(action);
        } catch (err: any) { notify.error(err.message) }


    }

    public unSelectOnceCoin(coinId: string): void {

        const action = selectedCoinsSlice.actions.unSelectCoin(coinId);
        store.dispatch(action);
    }



}

export const coinService = new CoinService();
