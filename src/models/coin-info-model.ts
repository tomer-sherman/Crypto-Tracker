// 1. The Messy Api Type (Data Transfer Object)
export type CoinInfoApiData = {
    id: string
    market_data: {
        current_price: {
            usd: number;
            eur: number;
            ils: number;
        };
    };
};

// 2. The Clean App Type (Domain Model)
export type CoinInfoModel = {
    coinId: string;
    usd: number;
    eur: number;
    ils: number;
};

// 3. The Adapter Function
export const adaptCoinInfo = (data: CoinInfoApiData): CoinInfoModel => {

    const prices = data.market_data.current_price;


    return {
        coinId: data.id,
        usd: prices.usd,
        eur: prices.eur,
        ils: prices.ils
    };
};

// 4. The Collection Adapter -- same conversion, one coin at a time.
export const adaptCoinInfoList = (data: CoinInfoApiData[]): CoinInfoModel[] => {

    return data.map(adaptCoinInfo);
};



