import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { searchTool } from "./tools/search.tool.js";
import { recallMemoryTool, saveMemoryTool } from "./tools/memory.tool.js";
import { add, divide, multiply, subtract } from "./tools/calculator.js";


export const toolsByName = {
    [searchTool.name]: searchTool,
    [recallMemoryTool.name]: recallMemoryTool,
    [saveMemoryTool.name]: saveMemoryTool,
    [add.name]: add,
    [subtract.name]: subtract,
    [multiply.name]: multiply,
    [divide.name]: divide,
};

const tools = Object.values(toolsByName);

const llm = new ChatOllama({
    model: "llama3.2:latest",
    baseUrl: "http://localhost:11434",
    temperature: 0,
});

export const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text:latest",
    baseUrl: "http://localhost:11434",
});

export const llm2 = new ChatOllama({
    model: "llama3.2:latest",
    baseUrl: "http://localhost:11434",
    temperature: 0,
}).bindTools(tools);

export default llm;
