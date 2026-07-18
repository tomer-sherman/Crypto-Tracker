import { useSelector } from "react-redux";
import "./validation-dialog.css";
import { AppState } from "../../../redux/app-state";
import { CoinModel } from "../../../models/coin-model";
import { SelectedCoinCard } from "../selected-coin-card/selected-coin-card";
import { coinService } from "../../../services/coin-service";


export function ValidationDialog() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);

    function unSelect(coinId: string) {
        coinService.unSelectOnceCoin(coinId);
    }


    return (
        <div className="ValidationDialog">

            <h1>Maximum Coins Reached</h1>
            <p>You can select up to 5 coins, too add {selectedCoins[5].name}, </p>

            <p>you can choose which coin too switch with {selectedCoins[5].name},</p>
            <p>or go back too the main home page.</p>

            {selectedCoins.slice(0, 5).map(c => (
                <div key={c.id}><SelectedCoinCard coin={c} /><button onClick={() => unSelect(c.id)}>Replace</button></div>))}

            <button onClick={()=>unSelect(selectedCoins[5].id)} >Back</button>

        </div>
    );
}
