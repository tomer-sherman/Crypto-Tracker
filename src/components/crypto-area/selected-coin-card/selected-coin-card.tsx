import { CoinModel } from "../../../models/coin-model";
import "./selected-coin-card.css";

export type CoinProp = {
    coin: CoinModel;
}

export function SelectedCoinCard(props: CoinProp) {
    return (
        <div className="CryptoCard">
            <img src={props.coin.image} alt={props.coin.name} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>
        </div>
    );
}
