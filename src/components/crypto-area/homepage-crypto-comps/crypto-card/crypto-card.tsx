import { useState } from "react";
import { CoinModel } from "../../../../models/coin-model";
import "./crypto-card.css";
import { coinService } from "../../../../services/coin-service";
import { notify } from "../../../../utils/notify";
import { CoinInfoModel } from "../../../../models/coin-info-model";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/app-state";

export type CoinProp = {
    coin: CoinModel;
}

export function CryptoCard(props: CoinProp) {

    const [coinInfo, setCoinInfo] = useState<CoinInfoModel>();
    const [flag, setFlag] = useState<boolean>(false);
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const isSelected = selectedCoins.some(c => c.id === props.coin.id);

    async function triggerInfo() {
        const isOpening = !flag;
        setFlag(isOpening);

        if (isOpening && !coinInfo) {
            coinService.getCoinInfo(props.coin.id)
                .then(coinInfo => setCoinInfo(coinInfo))
                .catch(err => notify.error(err.message));
        }
    }

    async function triggerSelect() {
        isSelected ?
            coinService.unSelectOnceCoin(props.coin.id)
            : coinService.selectOneCoin(props.coin);
    }

    return (
        <div className="CryptoCard">
            <img src={props.coin.image} alt={props.coin.name} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>

            <input
                type="checkbox"
                checked={isSelected}
                onChange={triggerSelect}
            />

            <button onClick={triggerInfo}>
                {flag ? "Close" : "More Info"}
            </button>

            {/* NEW DESIGNED INFO PANEL WITH SMOOTH RESIZE WRAPPER */}
            <div className={`coin-info-wrapper ${flag && coinInfo ? "open" : ""}`}>
                <div className="coin-info-panel">
                    <div className="coin-info-content">
                        {coinInfo && (
                            <>
                                <div className="price-row">
                                    <span className="currency">$</span>
                                    <span className="value">{coinInfo.market_data.current_price.usd.toLocaleString()}</span>
                                </div>
                                <div className="price-row">
                                    <span className="currency">€</span>
                                    <span className="value">{coinInfo.market_data.current_price.eur.toLocaleString()}</span>
                                </div>
                                <div className="price-row">
                                    <span className="currency">₪</span>
                                    <span className="value">{coinInfo.market_data.current_price.ils.toLocaleString()}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Optional loading state while waiting for the API */}
            {flag && !coinInfo && <span className="loading-text">Fetching data...</span>}
        </div>
    );
}