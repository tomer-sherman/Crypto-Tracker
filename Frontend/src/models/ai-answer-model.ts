/*
    This file describes the answer that comes back from the AI.
    It holds a short answer plus a longer description that explains it.
    The app parses the AI reply into this shape before showing it on a coin card.
*/

export type AiAnswerModel = {
	answer: string;
    description: string;
}
