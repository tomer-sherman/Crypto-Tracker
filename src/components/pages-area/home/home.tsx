
import { CheckedCoinList } from "../../crypto-area/checked-coin-list/checked-coin-list";
import { CryptoList } from "../../crypto-area/crypto-list/crypto-list";

import "./home.css";

export function Home() {
    return (
        <div className="Home">


            <CheckedCoinList />
            <CryptoList />

        </div>
    );
}