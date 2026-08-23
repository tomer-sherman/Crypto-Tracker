import { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { coinService } from "../services/coin-service";


class McpTools {

    public async getHundredCoins(): Promise<CallToolResult> {

        console.log("Using getHundredCoins Tool!!");
        const coins = await coinService.getHundredCoins();
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(coins)
            }]
        };

        return result;
    }

     public async getCoin(args: {id: string}): Promise<CallToolResult> {

        console.log("Using getCoin Tool!!");
        const coin = await coinService.getCoin(args.id);
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(coin)
            }]
        };

        return result;
    }



}

export const mcpTools = new McpTools();