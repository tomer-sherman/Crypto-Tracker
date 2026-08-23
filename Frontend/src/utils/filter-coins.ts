/*
    This file holds the search helper for the coin list.
    It takes the coins the app already has and the text typed in the search box,
    and gives back only the coins that match. A coin matches when its name or its
    symbol starts with the typed text, and an empty box returns every coin.
*/

import { CoinModel } from "../models/coin-model";

// Keeps coins matching the search text
export function filterCoinsBySearch(coins: CoinModel[], searchStr: string): CoinModel[] {
    if (!searchStr.trim()) return coins;

    const query = searchStr.toLowerCase().trim();

    return coins.filter(coin =>
        coin.name.toLowerCase().startsWith(query) ||
        coin.symbol.toLowerCase().startsWith(query)
    );
}