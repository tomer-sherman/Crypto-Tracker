import { useState } from "react";
import { AiAnswerModel } from "../../../../models/ai-answer-model";
import { notify } from "../../../../utils/notify";
import { promptService } from "../../../../services/prompt-service";
import { CoinChipMicroComp } from "../../home-comps/micro-comps/coin-chip-micro-comp";
import { CoinProp } from "../../home-comps/micro-comps/coin-identity-micro-comp";
import { AiAnswerMicroComp } from "../micro-comps/ai-answer-micro-comp";
import "./insight-rend-comp.css";

/* ============================================================================
   Rendering comp — CHILD side. One coin's AI analysis.

   Every card asks the model on its own, so the button, the request, the
   loading state and the two-step close all belong here. The answer is not
   dropped the moment Close is pressed: the panel is asked to play its exit
   first and only unmounts once it says the animation has ended.
   ============================================================================ */
export function InsightRendComp(props: CoinProp) {
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
            <CoinChipMicroComp coin={props.coin} />

            <button
                onClick={handleAction}
                /* Disable the button while loading OR while the closing animation plays */
                disabled={isLoading || isClosing}
                className={aiAnswer && !isClosing ? "close-mode" : ""}
            >
                {isLoading ? "Analyzing..." : (aiAnswer && !isClosing ? "Close" : "Get AI Insight")}
            </button>

            {aiAnswer && (
                <AiAnswerMicroComp
                    aiAnswer={aiAnswer}
                    isClosing={isClosing}
                    onAnimationEnd={handleAnimationEnd}
                />
            )}
        </div>
    );
}
