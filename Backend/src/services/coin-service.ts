import axios from "axios";
import { CoinComparisonModel, CoinDeepDiveModel, OverviewCoinModel } from "../models/coin-model";
import { appConfig } from "../utils/app-config";
import { coinsCache } from "../utils/coins-cache";

// Logic:
class CoinService {

    // Get all products:
    public async getHundredCoins(): Promise<OverviewCoinModel[]> {

        const cachedCoins = coinsCache.getHundredCoins();
        if (cachedCoins) {
            console.log("Fetching from cache!!!");
            return cachedCoins;
        }

        const response = await axios.get<OverviewCoinModel[]>(appConfig.hundredCoinsUrl);
        const coins = response.data;


        console.log("storing new cache info!!");
        coinsCache.setHundredCoins(coins);


        return coins;

    }

    // Get single coin data:
    public async getCoin(id: string): Promise<CoinDeepDiveModel> {

        const cachedDivedCoins = coinsCache.getDivedCoins(id)
        if (cachedDivedCoins) {
            console.log("Fetching from cache!!!");
            return cachedDivedCoins;
        }

        const response = await axios.get<CoinDeepDiveModel>(appConfig.singleCoinUrl + "/" + id);
        const coin = response.data;


        console.log("Storing dived coin to cache!!!");
        coinsCache.setDivedCoins(coin);

        return coin;

    }

    // Later use
    // public async getCoinComparison(coinArr: string[]): Promise<CoinComparisonModel[]> {

    //     const comparedCoinsArr = coinArr.join(",");
    //     const response = await axios.get<CoinComparisonModel[]>(appConfig.coinsByIdsUrl + comparedCoinsArr)

    //     const comparedCoins = response.data;

    //     return comparedCoins;
    // };






}

export const coinService = new CoinService();
