/*
    This file holds the price types for the coins and the code that tidies them up.
    The live API returns prices keyed by coin id, so an adapter turns that into a
    simple array the app can loop over. There is also a shape for the backup file
    saved in the public folder, with its own adapter that reuses the first one.
*/

export type CoinInfoModelApi = {
    [coinId: string]: {
        usd: number;
        eur: number;
        ils: number;
    };
};

export type CoinInfoModel = {
    id: string;
    usd: number;
    eur: number;
    ils: number;
};

// Turns the API prices into an array
export const adaptCoinInfo = (data: CoinInfoModelApi): CoinInfoModel[] => {
    return Object.entries(data).map(([coinId, values]) => ({
        id: coinId,
        ...values,
    }));
};

export type CoinBackupApi = {
    id: string;
    current_price: number;
};

// Turns the saved backup rows into prices
export const adaptCoinBackup = (data: CoinBackupApi[]): CoinInfoModel[] => {

    const asApiShape: CoinInfoModelApi = {};

    for (const row of data) {
        asApiShape[row.id] = { usd: row.current_price, eur: 0, ils: 0 };
    }

    return adaptCoinInfo(asApiShape);
};