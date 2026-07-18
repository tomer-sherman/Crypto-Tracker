// slices/search-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


function updateSearchQuery(currentState: string, action: PayloadAction<string>) {
    const newState = currentState;
    const newLetter = action.payload;
    return newState + newLetter;
}


export const searchQuerySlice = createSlice({
    name: "search-query-slice",
    initialState: "" as string,
    reducers: { updateSearchQuery }
});
