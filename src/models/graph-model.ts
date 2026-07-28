import { CoinModel } from "./coin-model";

// 1. The Messy Socket Type (Data Transfer Object)
export type GraphSocketData = {
    stream: string;
    data: {
        s: string;  // Pair symbol, "BTCUSDT"
        c: string;  // Last price, as a string
    };
};

// 2. The Clean App Type (Domain Model)
export type GraphModel = {
    coin: CoinModel;
    price: number;
};

// 3. The Adapter Function
export const adaptGraph = (data: GraphSocketData, coins: CoinModel[]): GraphModel | null => {
    
    const pair = data.data.s.toUpperCase();
    const coin = coins.find(item => pair.startsWith(item.symbol.toUpperCase()));
    if (!coin) return null;

    return {
        coin: coin,
        price: parseFloat(data.data.c)
    };
};
