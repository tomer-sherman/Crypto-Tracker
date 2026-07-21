import { AiAnswerModel } from "../models/ai-answer-model";

class JsonSanitizer {

    public sanitize(text: string): AiAnswerModel {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        const json = text.substring(start, end + 1);
        const recommendation: AiAnswerModel = JSON.parse(json);
        return recommendation

    }



}

export const jsonSanitizer = new JsonSanitizer();
