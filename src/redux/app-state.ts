import { CoinModel } from "../models/coin-model"


export type AppState = {
    hundredCoins: CoinModel[];
    selectedCoins: CoinModel[];
    searchQuery: string;
}