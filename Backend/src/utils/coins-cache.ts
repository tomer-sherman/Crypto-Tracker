import { CoinDeepDiveModel, OverviewCoinModel } from "../models/coin-model";


class CoinsCache {


    private hundredCoinsCache: OverviewCoinModel[] | null = null;
    private fetchingTimeCoins: number = 0;
    private readonly ttlMsCoins: number = 3 * 60 * 1000 // 60 seconds, This is the exp window


    private fetchingTimeCoinDive: number = 0;
    private deepDivedCoins = new Map<string, { coin: CoinDeepDiveModel, fetchedAt: number }>();
    private readonly ttlMsCoinsDive: number = 3 * 60 * 1000;



    public getHundredCoins(): OverviewCoinModel[] | null {

        const isFresh = Date.now() - this.fetchingTimeCoins < this.ttlMsCoins;
        if (this.hundredCoinsCache && isFresh) return this.hundredCoinsCache;

        return null;

    }

    public setHundredCoins(coins: OverviewCoinModel[]): void {
        this.hundredCoinsCache = coins;
        this.fetchingTimeCoins = Date.now();
    }

    public getDivedCoins(coinId: string): CoinDeepDiveModel | null {

        const entry = this.deepDivedCoins.get(coinId);
        if (entry && Date.now() - entry.fetchedAt < this.ttlMsCoinsDive) return entry.coin;
        return null;

    }

    public setDivedCoins(coin: CoinDeepDiveModel): void {
        this.deepDivedCoins.set(coin.id, { coin: coin, fetchedAt: Date.now() })
    }







}


export const coinsCache = new CoinsCache();