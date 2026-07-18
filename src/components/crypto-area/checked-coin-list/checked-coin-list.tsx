import { useSelector } from "react-redux";
import "./checked-coin-list.css";
import { AppState } from "../../../redux/app-state";
import { CoinModel } from "../../../models/coin-model";
import { SelectedCoinCard } from "../selected-coin-card/selected-coin-card";

export function CheckedCoinList() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const count = selectedCoins.length;

    return (
        <div className="CheckedCoinList">
            <h1>Selected crypto coins:</h1>


            {count === 0 ?
                (<div className="placeholder-mini-card"></div>)
                :
                (<div className="checked-cards-wrapper">
                    {selectedCoins.map(coin => (<SelectedCoinCard key={coin.id} coin={coin} />))}
                </div>)}

            <p className="limit-warning">👾 You can only select 5 crypto coins !!!</p>

        </div>
    );
}