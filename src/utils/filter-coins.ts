import { CoinModel } from "../models/coin-model";

export function filterCoinsBySearch(coins: CoinModel[], searchStr: string): CoinModel[] {
    if (!searchStr.trim()) return coins;

    const query = searchStr.toLowerCase().trim();

    return coins.filter(coin =>
        coin.name.toLowerCase().startsWith(query) ||
        coin.symbol.toLowerCase().startsWith(query)
    );
}