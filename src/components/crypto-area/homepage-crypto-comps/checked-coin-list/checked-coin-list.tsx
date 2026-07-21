import { useSelector } from "react-redux";
import "./checked-coin-list.css";
import { AppState } from "../../../../redux/app-state";
import { CoinModel } from "../../../../models/coin-model";
import { SelectedCoinCard } from "../selected-coin-card/selected-coin-card";

export function CheckedCoinList() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const count = selectedCoins.length;

    return (
        <div className="CheckedCoinList">

            <div className="coins-dropzone">


                <div className="cards-inner-layout">
                    {count === 0 ? (
                        // ADDED CLASS HERE
                        <div className="empty-state-wrapper">
                            <div className="empty-state-wrapper">
                                <p className="empty-text">WELCOME TO CRYPTO TRACKER</p>
                                <p className="empty-text">1. Your selected coins will appear in this section.</p>
                                <p className="empty-text">2. Clicking on the more info button, gives you the real time coin's value in the market in (USD,EUR,ILS).</p>
                                <p className="empty-text">3. Each selected coin generates a real-time graph on the Reports page, tracking its value every second.</p>
                                <p className="empty-text">4. Visit the AI Recommendation page to analyze your coins and receive personalized buying advice.</p>
                            </div>
                        </div>
                    ) : (
                        selectedCoins.map(coin => <SelectedCoinCard key={coin.id} coin={coin} />)
                    )}
                </div>

                <p className="limit-warning">👾 You can only select 5 crypto coins !!!</p>
            </div>

        </div>
    );
}