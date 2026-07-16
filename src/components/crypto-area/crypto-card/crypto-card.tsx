import { CoinModel } from "../../../models/coin-model";
import "./crypto-card.css";

// Props block
export type CoinProp = {
    coin: CoinModel;
}

export function CryptoCard(props: CoinProp) {
    return (
        <div className="CryptoCard">

            <img src={props.coin.image} />
            <span>{props.coin.symbol.toUpperCase()}</span>
            <span>{props.coin.name}</span>
            <input type="checkbox" />
            <button>More info</button>

            {/* 
             isPressed &&
             <p>Dollar {coin.value.dollar} </p> 
             <p>Euro {coin.value.euro} </p> 
             <p>Shekels {coin.value.Shekels} </p> 
             */}

        </div>
    );
}