/*
    This file holds the types used by the live price graph.
    It has the raw shape that arrives on the price socket, a clean model that pairs a
    coin with its latest price, and a small label saying where that price came from.
    The adapter matches a socket message to a coin from the list and builds the clean model.
*/

import { CoinModel } from "./coin-model";

export type GraphSocketData = {
    stream: string;
    data: {
        s: string;
        c: string;
    };
};

export type GraphSource = "live" | "simulated" | "unavailable";

export type GraphModel = {
    coin: CoinModel;

    price: number;

    source: GraphSource;
};

// Turns a socket message into a graph model
export const adaptGraph = (data: GraphSocketData, coins: CoinModel[]): GraphModel | null => {

    const pair = data.data.s.toUpperCase();

    const coin = coins.find(item => pair === item.symbol.toUpperCase() + "USDT");
    if (!coin) return null;

    return {
        coin: coin,
        price: parseFloat(data.data.c),
        source: "live"
    };
};
