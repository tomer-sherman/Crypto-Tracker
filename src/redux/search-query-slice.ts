// slices/search-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


function updateSearchQuery(_currentState: string, action: PayloadAction<string>) {
    const currentInputValue = action.payload;

    return currentInputValue;
}


export const searchQuerySlice = createSlice({
    name: "search-query-slice",
    initialState: "" as string,
    reducers: { updateSearchQuery }
});
