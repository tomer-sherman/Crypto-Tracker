/*
    This file describes the shape of the whole Redux store.
    It lists the four pieces of global state the app keeps, which are the hundred coins,
    the coins the user selected, the search text, and the coin prices. The store file
    uses this type so every slice is placed under the right key.
*/

import { CoinInfoModel } from "../models/coin-info-model";
import { CoinModel } from "../models/coin-model"


export type AppState = {
    hundredCoins: CoinModel[];
    selectedCoins: CoinModel[];
    searchQuery: string;
    coinsInfo: CoinInfoModel[];
}