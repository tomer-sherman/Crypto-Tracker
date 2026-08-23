/*
    This file is the Redux slice that keeps the coins the user picked.
    One reducer adds a coin, skipping it if it is already there and throwing once the
    list is full. The other reducer takes a coin back out by its id.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinModel } from "../models/coin-model";


// Adds a coin to the selection
function selectedCoin(currentState: CoinModel[], action: PayloadAction<CoinModel>): CoinModel[] {
    const coinToAdd = action.payload;
    const isAlreadySelected = currentState.some(coin => coin.id === coinToAdd.id);

    if (currentState.length >= 6) { throw new Error("Cannot exceed 5 selected coins, and 1 pending coin.") }


    if (isAlreadySelected) return currentState;
    const newState = [...currentState];
    newState.push(coinToAdd);
    return newState;
}

// Removes a coin from the selection
function unSelectCoin(currentState: CoinModel[], action: PayloadAction<string>): CoinModel[] {
    const coinToUnselect = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(c => c.id === coinToUnselect);
    if (index >= 0) newState.splice(index, 1);
    return newState;

}




// The slice holding the selected coins
export const selectedCoinsSlice = createSlice({
    name: "selected-coins-slice",
    initialState:
        [] as CoinModel[],
    reducers: { selectedCoin, unSelectCoin }
});