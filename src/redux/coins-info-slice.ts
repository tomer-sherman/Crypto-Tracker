import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinInfoModel } from "../models/coin-info-model";



// Grabs all the 100 coins from the Slice, and
function initHundredCoinInfo(_currentState: CoinInfoModel[], action: PayloadAction<CoinInfoModel[]>): CoinInfoModel[] {

    const infoInit = action.payload;
    const newState = infoInit;
    return newState


}


export const coinsInfoSlice = createSlice({
    name:"coins-info-slice",
    initialState: [] as CoinInfoModel[],
    reducers:{initHundredCoinInfo}
})