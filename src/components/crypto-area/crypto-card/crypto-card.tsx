import { useState } from "react";
import { CoinModel } from "../../../models/coin-model";
import "./crypto-card.css";
import { coinService } from "../../../services/coin-service";
import { SelectedCoinModel } from "../../../models/selected-coin-model";
import { notify } from "../../../utils/notify";

export type CoinProp = {
    coin: CoinModel;
}

export function CryptoCard(props: CoinProp) {
    // You don't need a separate state for btnString. We can derive it directly from the flag!
    const [coinInfo, setCoinInfo] = useState<SelectedCoinModel>();
    const [flag, setFlag] = useState<boolean>(false);

    async function triggerInfo() {
        const isOpening = !flag; // Check what the *new* state will be
        setFlag(isOpening); // Actually toggle the state

        // Only fetch data if we are OPENING the info div AND we haven't already fetched it
        if (isOpening && !coinInfo) {
            coinService.getOneCoin(props.coin.id)
                .then(selectedCoin => setCoinInfo(selectedCoin))
                .catch(err => notify.error(err.message));
        }
    }

    return (
        <div className="CryptoCard">
            <img src={props.coin.image} alt={props.coin.name} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>

            <input type="checkbox" />

            {/* Fix: Pass the function reference directly so it actually runs on click */}
            <button onClick={triggerInfo}>
                {flag ? "Close" : "More Info"}
            </button>

            {/* Fix: Make sure to check that coinInfo actually exists before trying to render its properties */}
            {flag && coinInfo && (
                <div>
                    <span>Dollar: {coinInfo.market_data.current_price.usd}</span><br />
                    <span>Euro: {coinInfo.market_data.current_price.eur}</span><br />
                    <span>Shekels: {coinInfo.market_data.current_price.ils}</span>
                </div>
            )}

            {/* Optional loading state while waiting for the API */}
            {flag && !coinInfo && <span>Loading...</span>}
        </div>
    );
}