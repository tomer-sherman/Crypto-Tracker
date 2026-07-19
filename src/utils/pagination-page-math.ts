import { CoinModel } from "../models/coin-model";

interface PaginationResult {
    currentCoins: CoinModel[];
    totalPages: number;
    hasResults: boolean;
}

export function paginateCoins(
    coins: CoinModel[],
    currentPage: number,
    itemsPerPage: number
): PaginationResult {
    const totalPages = Math.ceil(coins.length / itemsPerPage);

    // One-line slicing math
    const currentCoins = coins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
        currentCoins,
        totalPages,
        hasResults: coins.length > 0
    };
}