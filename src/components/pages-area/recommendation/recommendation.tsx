import { useSelector } from "react-redux";
import { AiInsightList } from "../../crypto-area/ai-page-crypto-comps/ai-insight-list/ai-insight-list";
import { AppState } from "../../../redux/app-state";
import { CoinModel } from "../../../models/coin-model";
import "./recommendation.css"

export function Recommendation() {
    const selectedCoins = useSelector<AppState, CoinModel[]>(state => state.selectedCoins);
    const count = selectedCoins.length;

    // Rendering function to handle the conditional logic
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
                <AiInsightList />
            </>
        );
    };

    return (
        <div className="Recommendation">
            <h1>AI Insights & Recommendations</h1>

            {/* General disclaimers grouped for a cleaner UI read */}
            <div className="disclaimer-box">
                <p>This tool uses Artificial Intelligence to evaluate your selected cryptocurrencies and provide market insights.</p>
                <p><strong>⚠️ Financial Disclaimer:</strong> AI-generated recommendations are for informational purposes only and do not constitute professional financial advice.</p>
                <p>Cryptocurrency markets are highly volatile. Always conduct your own research, consult with a certified financial advisor, and never invest more than you can afford to lose.</p>
            </div>

            {/* Implementing the rendering function */}
            {renderContent()}
        </div>
    );
}