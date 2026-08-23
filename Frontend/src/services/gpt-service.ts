/*
    This file talks to the OpenAI chat API. It takes a system prompt and a user
    prompt, sends them to the model with the api key from the app config, and
    returns the text the model answered with. The rest of the app uses it instead
    of calling the API directly.
*/

import axios from "axios";
import { appConfig } from "../utils/app-config";

class GptService {
	
// Sends the prompts and returns the answer
public async getCompletion(systemPrompt: string, userPrompt: string): Promise<string>{
    const body = {
        model: appConfig.openaiModel,
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: userPrompt}
        ]
    };

    const options = {
        headers: {
            authorization: "Bearer " + appConfig.openaiApiKey
        }
    };

    const response = await axios.post(appConfig.openaiUrl, body ,options);
    const completion = response.data.choices[0].message.content;

    return completion
}




}

export const gptService = new GptService();
