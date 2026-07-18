import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinModel } from "../models/coin-model";


function selectedCoin(currentState: CoinModel[], action: PayloadAction<CoinModel>): CoinModel[] {
    const coinToAdd = action.payload;
    const isAlreadySelected = currentState.some(coin => coin.id === coinToAdd.id);

    if (currentState.length >= 6) { throw new Error("Cannot exceed 5 selected coins, and 1 pending coin.") }


    if (isAlreadySelected) return currentState;
    const newState = [...currentState];
    newState.push(coinToAdd);
    return newState;
}

function unSelectCoin(currentState: CoinModel[], action: PayloadAction<string>): CoinModel[] {
    const coinToUnselect = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(c => c.id === coinToUnselect);
    if (index >= 0) newState.splice(index, 1);
    return newState;

}




export const selectedCoinsSlice = createSlice({
    name: "selected-coins-slice",
    initialState:
        [] as CoinModel[],
    reducers: { selectedCoin, unSelectCoin }
});