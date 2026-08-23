/*
    This file is the Redux slice that keeps the price info for the coins.
    It has one reducer that swaps the whole list for a fresh one coming from the service.
    Coin cards read this state when they show a price in dollars, euros, or shekels.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinInfoModel } from "../models/coin-info-model";



// Replaces the stored coin prices
function initHundredCoinInfo(_currentState: CoinInfoModel[], action: PayloadAction<CoinInfoModel[]>): CoinInfoModel[] {

    const infoInit = action.payload;
    const newState = infoInit;
    return newState


}


// The slice holding coin price info
export const coinsInfoSlice = createSlice({
    name: "coins-info-slice",
    initialState: [] as CoinInfoModel[],
    reducers: { initHundredCoinInfo }
})