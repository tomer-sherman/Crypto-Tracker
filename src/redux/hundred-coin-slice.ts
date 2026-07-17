import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinModel } from "../models/coin-model";



function initHundredCoins(_currentState: CoinModel[], action: PayloadAction<CoinModel[]>): CoinModel[]{

const coinsInit = action.payload;
const newState = coinsInit;
return newState;
}


export const hundredCoinsSlice = createSlice({
    name: "hundred-coins-slice",
    initialState: [] as CoinModel[],
    reducers:{initHundredCoins}
})
