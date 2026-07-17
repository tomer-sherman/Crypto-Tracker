import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { hundredCoinsSlice } from "../redux/hundred-coin-slice";
import { SelectedCoinModel } from "../models/selected-coin-model";

class CoinService {
	


public async getHundredCoins(): Promise<CoinModel[]>{

    // Check if stored in the global state Fetch from here. IF NOT CONTINUE!!
    if(store.getState().hundredCoins.length > 0){
        return  store.getState().hundredCoins;
    }

const response = await axios.get<CoinModel[]>(appConfig.hundredCoinsUrl);
const hundredCoins = response.data

    // Store in global state!!!
const action = hundredCoinsSlice.actions.initHundredCoins(hundredCoins);
store.dispatch(action);

return hundredCoins;
}

public async getOneCoin(coinId: string): Promise<SelectedCoinModel>{

    const response = await axios.get<SelectedCoinModel>(appConfig.singleCoinUrl + "/" + coinId);
    const selectedCoin = response.data

    return selectedCoin;
}

public async selectOneCoin(coinId: string): Promise<SelectedCoinModel>{
    if(store.getState().selectedCoins.length > 0){
        
    }

   const response = await axios.get<SelectedCoinModel>(appConfig.singleCoinUrl + "/" + coinId);
   const selectedCoin = response.data;

   return selectedCoin;
}



}

export const coinService = new CoinService();
