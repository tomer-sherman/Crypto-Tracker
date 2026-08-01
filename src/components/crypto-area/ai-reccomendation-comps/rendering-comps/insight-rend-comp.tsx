/*
    This file is one AI insight card for a single coin.
    It shows the coin chip and a button that asks the AI service for advice about it.
    While the request runs the button is disabled, and pressing Close plays the exit animation before the answer is removed.
*/

import { useState } from "react";
import { AiAnswerModel } from "../../../../models/ai-answer-model";
import { notify } from "../../../../utils/notify";
import { promptService } from "../../../../services/prompt-service";
import { CoinChipMicroComp } from "../../home-comps/micro-comps/coin-chip-micro-comp";
import { CoinProp } from "../../home-comps/micro-comps/coin-identity-micro-comp";
import { AiAnswerMicroComp } from "../micro-comps/ai-answer-micro-comp";
import "./insight-rend-comp.css";

// One AI insight card for a coin
export function InsightRendComp(props: CoinProp) {
    // Holds the answer the AI returned
    const [aiAnswer, setAiAnswer] = useState<AiAnswerModel | null>(null);
    // Tells if the request is still running
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Tells if the panel is animating out
    const [isClosing, setIsClosing] = useState<boolean>(false);

    // Asks the AI service about one coin
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

    // Opens the answer or starts closing it
    function handleAction() {
        if (aiAnswer) {
            setIsClosing(true);
        } else {
            getAiInsight(props.coin.id);
        }
    }

    // Removes the answer after the animation
    function handleAnimationEnd() {
        if (isClosing) {
            setAiAnswer(null);
            setIsClosing(false);
        }
    }

    return (
        <div className="AiRecommendationCard">
            <CoinChipMicroComp coin={props.coin} />

            <button
                onClick={handleAction}
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
