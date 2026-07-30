// 1. The Messy Api Type (Data Transfer Object)
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

// 2. The Clean App Type (Domain Model)
export type AiInfoModel = {
    name: string;
    price: number;
    marketCap: number;
    volume24h: number;
    change30d: number;
    change60d: number;
    change200d: number;
};

// 3. The Adapter Function
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
