/*
    This file handles all of the coin data for the app. It fetches the top hundred
    coins and their currency info from the APIs, saves them in the global state, and
    falls back to a saved local copy when the live API is down. It also tracks which
    coins the user has picked.
*/

import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { hundredCoinsSlice } from "../redux/hundred-coin-slice";
import { selectedCoinsSlice } from "../redux/selected-coins-slice";
import { notify } from "../utils/notify";
import { coinsInfoSlice } from "../redux/coins-info-slice";
import { adaptCoinInfo, CoinInfoModel, CoinInfoModelApi } from "../models/coin-info-model";


class CoinService {


    // Fetches the top hundred coins
    public async getHundredCoins(): Promise<CoinModel[]> {

        if (store.getState().hundredCoins.length > 0) {
            return store.getState().hundredCoins;
        }

        const response = await axios.get<CoinModel[]>(appConfig.hundredCoinsUrl).catch(() => null);

        let hundredCoins = Array.isArray(response?.data) ? response.data : [];

        if (hundredCoins.length === 0) {
            const backup = await axios.get<CoinModel[]>(appConfig.hundredCoinsBackupUrl);
            hundredCoins = backup.data;
            notify.error("Live coin data is unavailable, showing saved data instead.");
        }

        const coinIdsString = hundredCoins.map(c => c.id).join(",");
        this.initCoinInfo(coinIdsString);


        const action = hundredCoinsSlice.actions.initHundredCoins(hundredCoins);
        store.dispatch(action);

        return hundredCoins;
    }


    // Adds one coin to the selection
    public selectOneCoin(coin: CoinModel): void {
       
            const action = selectedCoinsSlice.actions.selectedCoin(coin);
            store.dispatch(action); 
        


    }

    // Removes one coin from the selection
    public unSelectOnceCoin(coinId: string): void {

        const action = selectedCoinsSlice.actions.unSelectCoin(coinId);
        store.dispatch(action);
    }


    // Fetches all 100 coins currency at once. // this func is triggered every 60 seconds.
    public async initCoinInfo(coinIds: string): Promise<CoinInfoModel[]> {

        const response = await axios.get<CoinInfoModelApi>(appConfig.hundredCoinsCurrencyUrl + coinIds + "&vs_currencies=usd,eur,ils");
        const coinsInfo = adaptCoinInfo(response.data);


        const action = coinsInfoSlice.actions.initHundredCoinInfo(coinsInfo);
        store.dispatch(action);

        return coinsInfo;
    }

}

export const coinService = new CoinService();