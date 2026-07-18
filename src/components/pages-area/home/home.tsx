

import { useSelector } from "react-redux";
import { CheckedCoinList } from "../../crypto-area/checked-coin-list/checked-coin-list";
import { CryptoList } from "../../crypto-area/crypto-list/crypto-list";
import { ValidationDialog } from "../../crypto-area/validation-dialog/validation-dialog";
import "./home.css";
import { AppState } from "../../../redux/app-state";



export function Home() {

    const coinCount = useSelector<AppState, number>(state=> state.selectedCoins.length);







    return (
        <div className="Home">

           {coinCount === 6 && <ValidationDialog/>}
            <CheckedCoinList />
            <CryptoList />

        </div>
    );
}