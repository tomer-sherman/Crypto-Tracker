import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";
import z from "zod";

class McpRegister {

    public registerGetHundredCoins(mcpServer: McpServer): void {

        const uniqueName = "get_top_hundred_coins";
        const config = {
            description: "Gets the top 100 crypto coins in the market."
        }
        mcpServer.registerTool(uniqueName, config, mcpTools.getHundredCoins);
    }

    public registerGetCoin(mcpServer: McpServer): void {

        const uniqueName = "get_one_coin_deep_dive";
        const config = {
            description: "Gets a single coin data for a deeper data dive, by coin id.",
            inputSchema: z.object({ id: z.string() })
        }
        mcpServer.registerTool(uniqueName, config, mcpTools.getCoin);
    }


}

export const mcpRegister = new McpRegister();