class AppConfig {
    public readonly hundredCoinsUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    public readonly singleCoinUrl = "https://api.coingecko.com/api/v3/coins";
    public readonly selectedCoinsValueUrl = "https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=";

    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";
    public readonly openaiModel = "gpt-4o-mini";
    public readonly openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
}

export const appConfig = new AppConfig();


