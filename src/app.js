import express from 'express';
import { askAI } from '../service/ai-service.js';
import { askAgent } from '../service/agent-service.js';
import { askAgentLang } from '../service/agent-langgraph.js';

const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {

    const { prompt } = req.body;
    const response = await askAI(prompt);
    res.status(200).json({
        message: response
    });
})

app.post('/agent', async (req, res) => {
    const {input, userId, threadId} = req.body;

    if(!input || !userId || !threadId) {
        return res.status(400).json({
            success: false,
            message: "Bad Request"
        })
    }

    const response = await askAgent(input, userId, threadId);

    res.status(200).json({
        success: true,
        message: response
    })

})

app.post('/workflow/agent', async (req, res) => {

    const {input} = req.body;

    const response = await askAgentLang(input);

    return res.status(200).json({
        message: response
    });
})

export default app;

