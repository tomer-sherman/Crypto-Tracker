import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedCoinModel } from "../models/selected-coin-model";

function addSelectedCoin(currentState: SelectedCoinModel[], action: PayloadAction<SelectedCoinModel>): SelectedCoinModel[] {
    const coinToAdd = action.payload;

    // 1. Check at the very beginning
    const isAlreadySelected = currentState.some(coin => coin.symbol === coinToAdd.symbol);

    // 2. Early return: if it's already there, return the exact same state reference
    if (isAlreadySelected) {
        return currentState;
    }

    // 3. If we got here, it's safe to clone and add
    const newState = [...currentState];
    newState.push(coinToAdd);

    return newState;
}

export const selectedCoinsSlice = createSlice({
    name: "selected-coins-slice",
    initialState: [] as SelectedCoinModel[],
    reducers: { addSelectedCoin }
});