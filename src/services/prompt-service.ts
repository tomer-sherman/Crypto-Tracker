/*
    This file asks the AI whether a coin is worth buying. It first fetches the coin's
    market numbers from the API, then builds a prompt out of them and sends it to the
    gpt service. The answer comes back as json text, gets cleaned up, and is returned
    to the page that asked for it.
*/

import axios from "axios";
import { adaptAiInfo, AiInfoApiData, AiInfoModel } from "../models/ai-info-model";
import { gptService } from "./gpt-service";
import { appConfig } from "../utils/app-config";
import { notify } from "../utils/notify";

import { AiAnswerModel } from "../models/ai-answer-model";
import { jsonSanitizer } from "../utils/json-sanitizer";

class PromptService {
    // Gets an AI opinion on one coin
    public async getAiInsight(coinId: string): Promise<AiAnswerModel | void> {

        try {
            const info = await this.getAiInfo(coinId);
            
            const systemPrompt = "You are an expert crypto coin trader and mentor for other traders.";
            const userPrompt = `
        Help me decide if I should buy ${coinId} or not. 
        Use this info below to give an accurate answer:

        Coin name: ${info.name}
        Current price: ${info.price},
        Market cap: ${info.marketCap},
        Total volume of trade in the last 24h: ${info.volume24h},
        Price change percentage in the last 30 days in usd: ${info.change30d},
        Price change percentage in the last 60 days in usd: ${info.change60d},
        Price change percentage in the last 200 days in usd: ${info.change200d},
            
        Return your answers as the json below:
         {"answer" : "Yes you should totally buy this coin || No you should't buy this coin" ,"description": "here you write you'r paragraph"}

        RETURN YOUR ANSWER ONLY IN THIS JSON FORMAT!!!!.
        `
            const completion = await gptService.getCompletion(systemPrompt, userPrompt);
            const aiInsight =  jsonSanitizer.sanitize(completion)
            console.log("AI ANSWER:  " + aiInsight.answer+ ",  AI DESC: " + aiInsight.description);

            return aiInsight;

        } catch (err: any) { notify.error(err.message) }



    }


    // Fetches the market numbers for one coin
    private async getAiInfo(coinId: string): Promise<AiInfoModel> {

        const response = await axios.get<AiInfoApiData>(appConfig.singleCoinUrl + "/" + coinId);

        const coinInfo = adaptAiInfo(response.data);

        return coinInfo;
    }


}



export const promptService = new PromptService();
