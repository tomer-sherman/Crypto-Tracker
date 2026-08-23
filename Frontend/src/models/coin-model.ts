/*
    This file holds the basic type for a single coin.
    It keeps the id, symbol, name, and image link that come back from the coin list API.
    Most parts of the app pass coins around in this shape.
*/

export type CoinModel = {
    id: string;
    symbol: string;
    name: string;
    image: string;
}
