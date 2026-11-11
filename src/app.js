import express from 'express';
import { askAI } from '../service/ai-service.js';

const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    const response = await askAI(prompt);

    res.status(200).json({
        message: response
    })
    
})

export default app;

