import "dotenv/config";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "langchain";
import { z } from "zod";

const tavily = new TavilySearch({
    maxResults: 5,
    topic: "general",
    tavilyApiKey: process.env.TAVILY_API_KEY,
});

export const searchTool = tool(
    async ({ query }) => {
        const result = await tavily.invoke({ query });
        return JSON.stringify(result);
    },
    {
        name: "tavily_search",
        description: "Search the web for current events, real-time data, weather, or facts you are unsure of.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the web"),
        }),
    }
);


