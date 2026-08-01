/*
    This file holds the AI Insights page of the crypto tracker app.
    It reads the coins the user selected from the global state and shows a
    disclaimer about AI advice. If no coins are selected it asks the user to go
    pick some, otherwise it renders the list of insight cards.
*/

import { useSelector } from "react-redux";
import { InsightListRendComp } from "../../crypto-area/ai-reccomendation-comps/rendering-comps/insight-list-rend-comp";
import { AppState } from "../../../redux/app-state";
import { CoinModel } from "../../../models/coin-model";
import "./recommendation.css"

// Shows the AI insights page
export function Recommendation() {
    // Reads the selected coins from global state
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const count = selectedCoins.length;

    // Picks what to show on the page
    const renderContent = () => {
        if (count === 0) {
            return (
                <p className="empty-state">
                    You haven't selected any coins yet. Please go back to the home page and select coins to view their AI insights here.
                </p>
            );
        }

        return (
            <>
                <p className="instruction-text">
                    Click the <strong>Get AI Insight</strong> button on any card below to generate a detailed analysis.
                </p>
                <InsightListRendComp />
            </>
        );
    };

    return (
        <div className="Recommendation">
            <h1>AI Insights & Recommendations</h1>

            <div className="disclaimer-box">
                <p>This tool uses Artificial Intelligence to evaluate your selected cryptocurrencies and provide market insights.</p>
                <p><strong>⚠️ Financial Disclaimer:</strong> AI-generated recommendations are for informational purposes only and do not constitute professional financial advice.</p>
                <p>Cryptocurrency markets are highly volatile. Always conduct your own research, consult with a certified financial advisor, and never invest more than you can afford to lose.</p>
            </div>

            {renderContent()}
        </div>
    );
}