/*
    This file is the Redux slice that holds the text typed into the search box.
    It has one reducer that saves the newest input value as the whole state.
    Components read this text to filter the coins that get shown.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Saves the current search text
function updateSearchQuery(_currentState: string, action: PayloadAction<string>) {
    const currentInputValue = action.payload;

    return currentInputValue;
}


// The slice holding the search text
export const searchQuerySlice = createSlice({
    name: "search-query-slice",
    initialState: "" as string,
    reducers: { updateSearchQuery }
});
