/*
    This file does the maths behind the coin list pages.
    It is given all the coins, the page the user is on, and how many coins fit on
    a page. It returns just the coins for that page, how many pages there are in
    total, and whether there were any coins to show at all.
*/

import { CoinModel } from "../models/coin-model";

interface PaginationResult {
    currentCoins: CoinModel[];
    totalPages: number;
    hasResults: boolean;
}

// Cuts the coins into one page
export function paginateCoins(
    coins: CoinModel[],
    currentPage: number,
    itemsPerPage: number
): PaginationResult {
    const totalPages = Math.ceil(coins.length / itemsPerPage);

    const currentCoins = coins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
        currentCoins,
        totalPages,
        hasResults: coins.length > 0
    };
}