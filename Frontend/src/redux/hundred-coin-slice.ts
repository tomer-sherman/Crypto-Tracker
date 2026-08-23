/*
    This file is the Redux slice that holds the list of the top hundred coins.
    It has one reducer that saves a fresh list into global state.
    Pages read this list whenever they need to show or search through coins.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinModel } from "../models/coin-model";



// Saves the fetched coin list
function initHundredCoins(_currentState: CoinModel[], action: PayloadAction<CoinModel[]>): CoinModel[]{

const coinsInit = action.payload;
const newState = coinsInit;
return newState;
}




// The slice holding the hundred coins
export const hundredCoinsSlice = createSlice({
    name: "hundred-coins-slice",
    initialState: [] as CoinModel[],
    reducers:{initHundredCoins}
})
