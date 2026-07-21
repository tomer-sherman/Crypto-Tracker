import axios from "axios";
import { AiCoinInfoModel } from "../models/ai-info-model";
import { gptService } from "./gpt-service";
import { appConfig } from "../utils/app-config";
import { notify } from "../utils/notify";

import { AiAnswerModel } from "../models/ai-answer-model";
import { jsonSanitizer } from "../utils/json-sanitizer";

class PromptService {
    public async getAiInsight(coinId: string): Promise<AiAnswerModel | void> {

        try {
            const info = await this.getAiInfo(coinId);
            
            const systemPrompt = "You are an expert crypto coin trader and mentor for other traders.";
            const userPrompt = `
        Help me decide if I should buy ${coinId} or not. 
        Use this info below to give an accurate answer:

        Coin name: ${info.name}
        Current price: ${info.market_data.current_price.usd},
        Market cap: ${info.market_data.market_cap.usd},
        Total volume of trade in the last 24h: ${info.market_data.total_volume.usd},
        Price change percentage in the last 30 days in usd: ${info.market_data.price_change_percentage_30d_in_currency.usd},
        Price change percentage in the last 60 days in usd: ${info.market_data.price_change_percentage_60d_in_currency.usd},
        Price change percentage in the last 200 days in usd: ${info.market_data.price_change_percentage_200d_in_currency.usd},
            
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


    private async getAiInfo(coinId: string): Promise<AiCoinInfoModel> {

        const response = await axios.get<AiCoinInfoModel>(appConfig.singleCoinUrl + "/" + coinId);
        const coinInfo = response.data;

        return coinInfo;
    }


}



export const promptService = new PromptService();
