/*
    This file keeps all of the app's addresses and settings in one place.
    It holds the CoinGecko urls for the coin list and single coin info, a local
    backup file url, the Binance price socket url, and the OpenAI details.
    Other files import the ready made appConfig object instead of writing these
    strings themselves.
*/

class AppConfig {
    public readonly hundredCoinsUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

    public readonly hundredCoinsBackupUrl = "/100coins.json";

    public readonly singleCoinUrl = "https://api.coingecko.com/api/v3/coins";

    public readonly hundredCoinsCurrencyUrl = "https://api.coingecko.com/api/v3/simple/price?ids="

    public readonly priceSocketUrl = "wss://stream.binance.com:9443/stream?streams=";


    public readonly openaiUrl = "https://api.openai.com/v1/chat/completions";
    public readonly openaiModel = "gpt-4o-mini";
    public readonly openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
}

// The single settings object the app uses
export const appConfig = new AppConfig();


