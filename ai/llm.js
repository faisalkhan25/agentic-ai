import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";

const llm = new ChatOllama({
    model: "llama3.2:latest",
    baseUrl: "http://localhost:11434",
    temperature: 0,
});

export const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://localhost:11434",
});

export default llm;
