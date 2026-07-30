import { AiAnswerModel } from "../../../../models/ai-answer-model";

type AiAnswerProp = {
    aiAnswer: AiAnswerModel;
    isClosing: boolean;
    onAnimationEnd: () => void;
}

/* ============================================================================
   Micro comp — the model's verdict panel.

   It shows an AiAnswerModel and reports back when its animation has finished;
   the card above decides what that means. Nothing inside this panel may be
   animated: `animationend` bubbles, so a moving child would tell the card the
   exit is over while it is still on screen.
   ============================================================================ */
export function AiAnswerMicroComp(props: AiAnswerProp) {
    return (
        <div
            /* Dynamically add the 'closing' class to trigger the reverse animation */
            className={`ai-feedback ${props.isClosing ? "closing" : ""}`}
            onAnimationEnd={props.onAnimationEnd}
        >
            <h4>{props.aiAnswer.answer}</h4>
            <p>{props.aiAnswer.description}</p>
        </div>
    );
}
