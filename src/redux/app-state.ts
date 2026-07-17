import { CoinModel } from "../models/coin-model"
import { SelectedCoinModel } from "../models/selected-coin-model";

export type AppState = {
    hundredCoins: CoinModel[];
    selectedCoins: SelectedCoinModel[];
}