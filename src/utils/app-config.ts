class AppConfig {
    // hundred coins url:
    public readonly hundredCoinsUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

    // Local backup of the 100 coins, used when CoinGecko is down or rate-limits us:
    public readonly hundredCoinsBackupUrl = "/100coins.json";

    // Single coin more Info url:
    public readonly singleCoinUrl = "https://api.coingecko.com/api/v3/coins";

    //hundred coins USD,ILS,EUR info:
    public readonly hundredCoinsCurrencyUrl = "https://api.coingecko.com/api/v3/simple/price?ids="

    public readonly priceSocketUrl = "wss://stream.binance.com:9443/stream?streams=";






    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";
    public readonly openaiModel = "gpt-4o-mini";
    public readonly openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
}

export const appConfig = new AppConfig();


