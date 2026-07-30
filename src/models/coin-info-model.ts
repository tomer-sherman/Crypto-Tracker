// ============================
// 1. The Messy Api Type (Data Transfer Object)
// ============================
export type CoinInfoModelApi = {
    [coinId: string]: {
        usd: number;
        eur: number;
        ils: number;
    };
};

// ============================
// 2. The Clean App Type (Domain Model)
// ============================
export type CoinInfoModel = {
    id: string;
    usd: number;
    eur: number;
    ils: number;
};

// ============================
// 3. The Adapter Function
// ============================
export const adaptCoinInfo = (data: CoinInfoModelApi): CoinInfoModel[] => {
    return Object.entries(data).map(([coinId, values]) => ({
        id: coinId,
        ...values,
    }));
};

// ============================
// 4. The same three parts again, for the saved file in /public
// ============================

// The saved rows carry the whole CoinGecko market payload. current_price is the only
// field worth reading off them, and it is already in dollars.
export type CoinBackupApi = {
    id: string;
    current_price: number;
};

// Reshapes the saved rows into the API shape above, then hands them to the adapter
// that was already here -- so a backup coin ends up as the exact same CoinInfoModel
// a live coin does. eur and ils stay at 0 because the saved file only ever had dollars,
// and dollars are all the reports page reads.
export const adaptCoinBackup = (data: CoinBackupApi[]): CoinInfoModel[] => {

    const asApiShape: CoinInfoModelApi = {};

    for (const row of data) {
        asApiShape[row.id] = { usd: row.current_price, eur: 0, ils: 0 };
    }

    return adaptCoinInfo(asApiShape);
};