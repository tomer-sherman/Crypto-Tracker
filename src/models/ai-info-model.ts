/*
    This file holds the coin data that gets handed to the AI.
    It has the messy shape the market API returns and a clean shape the app prefers,
    with only the price and the change numbers the AI needs. A small adapter function
    turns the messy shape into the clean one.
*/

export type AiInfoApiData = {
    name: string;
    market_data: {
        current_price: { usd: number };
        market_cap: { usd: number };
        total_volume: { usd: number };
        price_change_percentage_30d_in_currency: { usd: number };
        price_change_percentage_60d_in_currency: { usd: number };
        price_change_percentage_200d_in_currency: { usd: number };
    };
};

export type AiInfoModel = {
    name: string;
    price: number;
    marketCap: number;
    volume24h: number;
    change30d: number;
    change60d: number;
    change200d: number;
};

// Turns the API data into the clean model
export const adaptAiInfo = (data: AiInfoApiData): AiInfoModel => {

    const market = data.market_data;

    return {
        name: data.name,
        price: market.current_price.usd,
        marketCap: market.market_cap.usd,
        volume24h: market.total_volume.usd,
        change30d: market.price_change_percentage_30d_in_currency.usd,
        change60d: market.price_change_percentage_60d_in_currency.usd,
        change200d: market.price_change_percentage_200d_in_currency.usd
    };
};
