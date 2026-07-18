import { useState } from "react";
import { CoinModel } from "../../../models/coin-model";
import "./crypto-card.css";
import { coinService } from "../../../services/coin-service";
import { notify } from "../../../utils/notify";
import { CoinInfoModel } from "../../../models/coin-info-model";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";


export type CoinProp = {
    coin: CoinModel;
}

export function CryptoCard(props: CoinProp) {

    const [coinInfo, setCoinInfo] = useState<CoinInfoModel>();
    const [flag, setFlag] = useState<boolean>(false);
    const [selectFlag, setSelectFlag] = useState<boolean>(false);
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const isSelected = selectedCoins.some(c =>c.id === props.coin.id);



    async function triggerInfo() {
        const isOpening = !flag;
        setFlag(isOpening);

        if (isOpening && !coinInfo) {
            coinService.getCoinInfo(props.coin.id)
                .then(coinInfo => setCoinInfo(coinInfo))
                .catch(err => notify.error(err.message));
        }
    }

    async function triggerSelect(coinId: string, coin: CoinModel) {
        // Setting true or false
        const isChecked = !selectFlag;
        setSelectFlag(isChecked);

        // Calling service depending on flag
        coinId = props.coin.id;
        if (isChecked) coinService.selectOneCoin(coin);
        if (!isChecked) coinService.unSelectOnceCoin(coinId);
    }


    return (
        <div className="CryptoCard">
            <img src={props.coin.image} alt={props.coin.name} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>
            <input type="checkbox" checked={isSelected}  onChange={() => triggerSelect(props.coin.id, props.coin)} />
            <button onClick={triggerInfo}>
                {flag ? "Close" : "More Info"}
            </button>

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