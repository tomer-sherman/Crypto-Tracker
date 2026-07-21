import { useState } from "react";
import { SelectedCoinCard } from "../../../crypto-area/homepage-crypto-comps/selected-coin-card/selected-coin-card";
import { AiAnswerModel } from "../../../../models/ai-answer-model";
import { notify } from "../../../../utils/notify";
import { CoinProp } from "../../homepage-crypto-comps/crypto-card/crypto-card";
import { promptService } from "../../../../services/prompt-service";
import "./ai-insight-card.css";

export function AiInsightCard(props: CoinProp) {
    const [aiAnswer, setAiAnswer] = useState<AiAnswerModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // NEW: State to track when the card is currently animating out
    const [isClosing, setIsClosing] = useState<boolean>(false);

    async function getAiInsight(coinId: string) {
        try {
            setIsLoading(true);
            const answer = await promptService.getAiInsight(coinId);
            if (answer) setAiAnswer(answer);
        } catch (err: any) {
            notify.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleAction() {
        if (aiAnswer) {
            // Instead of setting to null immediately, trigger the closing animation
            setIsClosing(true);
        } else {
            getAiInsight(props.coin.id);
        }
    }

    // NEW: This fires automatically when the CSS animation finishes
    function handleAnimationEnd() {
        if (isClosing) {
            setAiAnswer(null);    // Now we safely remove it from the DOM
            setIsClosing(false);  // Reset the closing state
        }
    }

    return (
        <div className="AiRecommendationCard">
            <SelectedCoinCard coin={props.coin} />

            <button
                onClick={handleAction}
                /* Disable the button while loading OR while the closing animation plays */
                disabled={isLoading || isClosing}
                className={aiAnswer && !isClosing ? "close-mode" : ""}
            >
                {isLoading ? "Analyzing..." : (aiAnswer && !isClosing ? "Close" : "Get AI Insight")}
            </button>

            {aiAnswer && (
                <div
                    /* Dynamically add the 'closing' class to trigger the reverse animation */
                    className={`ai-feedback ${isClosing ? "closing" : ""}`}
                    onAnimationEnd={handleAnimationEnd}
                >
                    <h4>{aiAnswer.answer}</h4>
                    <p>{aiAnswer.description}</p>
                </div>
            )}
        </div>
    );
}