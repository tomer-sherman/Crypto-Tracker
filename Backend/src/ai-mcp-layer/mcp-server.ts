
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpRegister } from "./mcp-register";

class CryptoTrackerMcpServer {

    public create(): McpServer {
        const mcpServer = new McpServer({
            name: "crypto-tracker-mcp-server",
            version: "1.0.0"
        })


        mcpRegister.registerGetHundredCoins(mcpServer);
        mcpRegister.registerGetCoin(mcpServer);


        return mcpServer;
    }


}

export const cryptoTrackerMcpServer = new CryptoTrackerMcpServer();