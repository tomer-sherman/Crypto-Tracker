export type OverviewCoinModel = {
    id: string;
    symbol: string;
    name: string;
    price: number;
    market_cap: number;
    rank: number;
    volume_24h: number;
    change_24h: number;
    change_7d: number;
    change_30d: number;
};

export type CoinDeepDiveModel = {
    id: string;

    // Project / technology
    description: string;
    categories: string[];
    hashing_algorithm: string | null;
    block_time_minutes: number | null;
    genesis_date: string | null;

    // Official resources
    homepage_url: string | null;
    whitepaper_url: string | null;
    blockchain_sites: string[];

    // Market
    price_usd: number;
    market_cap_usd: number | null;
    market_cap_rank: number | null;
    fully_diluted_valuation_usd: number | null;
    total_volume_24h_usd: number | null;

    // Price performance
    change_1h: number | null;
    change_24h: number | null;
    change_7d: number | null;
    change_14d: number | null;
    change_30d: number | null;
    change_60d: number | null;
    change_200d: number | null;
    change_1y: number | null;

    // All-time highs / lows
    ath_usd: number | null;
    ath_change_percentage: number | null;
    ath_date: string | null;
    atl_usd: number | null;
    atl_change_percentage: number | null;
    atl_date: string | null;

    // Supply
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;

    // Community
    sentiment_up_percentage: number | null;
    sentiment_down_percentage: number | null;
    watchlist_users: number | null;

    // Development
    developer: {
        forks: number | null;
        stars: number | null;
        subscribers: number | null;
        total_issues: number | null;
        closed_issues: number | null;
        pull_requests_merged: number | null;
        pull_request_contributors: number | null;
        commits_4_weeks: number | null;
        code_additions_4_weeks: number | null;
        code_deletions_4_weeks: number | null;
    };

    // Social / community activity
    community: {
        reddit_subscribers: number | null;
        reddit_active_users_48h: number | null;
        reddit_posts_48h: number | null;
        reddit_comments_48h: number | null;
        telegram_users: number | null;
    };

    last_updated: string;
};


export type CoinComparisonModel = {
    id: string;
    symbol: string;
    name: string;

    priceUsd: number;
    marketCapUsd: number;
    marketCapRank: number;
    fullyDilutedValuationUsd: number | null;
    volume24hUsd: number;

    change24h: number;
    change24hPercentage: number;

    circulatingSupply: number | null;
    totalSupply: number | null;
    maxSupply: number | null;

    athUsd: number | null;
    athChangePercentage: number | null;
    athDate: string | null;
};

// An example for later filtering within my own DB it doesn't fetch any data.
type ScreenCoinsInput = {
    minMarketCapUsd?: number;
    maxMarketCapUsd?: number;

    minVolume24hUsd?: number;

    minChange24h?: number;
    maxChange24h?: number;

    minChange7d?: number;
    maxChange7d?: number;

    minChange30d?: number;
    maxChange30d?: number;

    maxAthDistancePercentage?: number;

    sortBy?:
    | "marketCap"
    | "volume24h"
    | "change24h"
    | "change7d"
    | "change30d"
    | "athDistance";

    limit?: number;
};


// Another screening TOOL uses the same 100 cached coins too filter out, which are the most moving Coins
type MarketMover = {
  id: string;
  symbol: string;
  name: string;

  priceUsd: number;
  marketCapUsd: number;
  marketCapRank: number;
  volume24hUsd: number;

  changePercentage: number | null;
};