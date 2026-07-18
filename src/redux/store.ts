import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./app-state";
import { hundredCoinsSlice } from "./hundred-coin-slice";
import { selectedCoinsSlice } from "./selected-coins-slice";
import { searchQuerySlice } from "./search-query-slice";


export const store = configureStore<AppState>({
    reducer:{
        hundredCoins: hundredCoinsSlice.reducer,
        selectedCoins: selectedCoinsSlice.reducer,
        searchQuery: searchQuerySlice.reducer
    }
})