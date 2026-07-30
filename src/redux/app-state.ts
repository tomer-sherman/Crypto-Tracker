import { CoinInfoModel } from "../models/coin-info-model";
import { CoinModel } from "../models/coin-model"


export type AppState = {
    hundredCoins: CoinModel[];
    selectedCoins: CoinModel[];
    searchQuery: string;
    coinsInfo: CoinInfoModel[];
}