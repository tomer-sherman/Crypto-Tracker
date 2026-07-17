export type SelectedCoinModel = {
	name: string;
    symbol: string;
    image: {
        large: string;
    }
    market_data:{
        current_price:{
            usd: number;
            eur: number;
            ils: number;
        }
    }
}
