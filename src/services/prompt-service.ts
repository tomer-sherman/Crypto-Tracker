import { gptService } from "./gpt-service";

class PromptService {
    public async getAiInsight(coinId: string): Promise<string> {
        const systemPrompt = "You are an expert crypto coin trader and mentor for other traders";

        const userPrompt = `

         



        `
        const completion = await gptService.getCompletion(systemPrompt, userPrompt);



        return coinId; // change later
    }
}

export const promptService = new PromptService();
