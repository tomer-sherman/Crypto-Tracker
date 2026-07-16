class AppConfig {
	public readonly hundredCoinsUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    //public readonly singleCoinUrl = "https://api.coingecko.com/api/v3/coins/%3ccoin-id%3e";
}

export const appConfig = new AppConfig();
