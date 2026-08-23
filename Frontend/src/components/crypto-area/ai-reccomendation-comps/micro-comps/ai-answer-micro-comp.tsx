/*
    This file holds the small panel that shows the AI answer for one coin.
    It takes an answer object and prints the short verdict plus its description.
    It also reports back when its animation has ended, so the card above can decide what to do next.
*/

import { AiAnswerModel } from "../../../../models/ai-answer-model";

type AiAnswerProp = {
    aiAnswer: AiAnswerModel;
    isClosing: boolean;
    onAnimationEnd: () => void;
}

// Shows the AI answer panel
export function AiAnswerMicroComp(props: AiAnswerProp) {
    return (
        <div
            className={`ai-feedback ${props.isClosing ? "closing" : ""}`}
            onAnimationEnd={props.onAnimationEnd}
        >
            <h4>{props.aiAnswer.answer}</h4>
            <p>{props.aiAnswer.description}</p>
        </div>
    );
}
