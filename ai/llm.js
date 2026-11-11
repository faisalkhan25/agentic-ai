import { Ollama } from "@langchain/ollama";



const llm = new Ollama({
    model: "llama3.2:latest",
    baseUrl: "http://localhost:11434",
    temperature: 0.7
});

export default llm;