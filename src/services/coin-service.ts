import axios from "axios";
import { CoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";

class CoinService {
	


public async getHundredCoins(): Promise<CoinModel[]>{

    // Check if stored in the global state Fetch from here. IF NOT CONTINUE!!


const response = await axios.get<CoinModel[]>(appConfig.hundredCoinsUrl);
const hundredCoins = response.data

    // Store in global state!!!


return hundredCoins;
}



}

export const coinService = new CoinService();
