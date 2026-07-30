class AppConfig {
    // hundred coins url:
    public readonly hundredCoinsUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

    // Single coin more Info url:
    public readonly singleCoinUrl = "https://api.coingecko.com/api/v3/coins";

    //hundred coins USD,ILS,EUR info:
    public readonly hundredCoinsCurrencyUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd,eur,ils"

    public readonly priceSocketUrl = "wss://stream.binance.com:9443/stream?streams=";






    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";
    public readonly openaiModel = "gpt-4o-mini";
    public readonly openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
}

export const appConfig = new AppConfig();


