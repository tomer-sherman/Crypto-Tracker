/*
    This file cleans up the text answer that comes back from the AI.
    The AI often wraps its JSON in extra words, so this takes only the part
    between the first curly brace and the last one. That piece is then parsed
    into an AiAnswerModel object the app can use.
*/

import { AiAnswerModel } from "../models/ai-answer-model";

class JsonSanitizer {

    // Pulls the JSON out of AI text
    public sanitize(text: string): AiAnswerModel {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        const json = text.substring(start, end + 1);
        const recommendation: AiAnswerModel = JSON.parse(json);
        return recommendation

    }



}

// The shared json sanitizer object
export const jsonSanitizer = new JsonSanitizer();
