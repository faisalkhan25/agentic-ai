import express from 'express';
import { askAI } from '../service/ai-service.js';
import { askAgent } from '../service/agent-service.js';
import { askAgentLang } from '../service/agent-langgraph.js';
import { askAgentWithHITL } from '../service/agent-ask-HITL.js';
import { approveAgentToolCallHITL } from '../service/agent-approve-HITL.js';

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

    const {input, threadId, userId} = req.body;
    


    const response = await askAgentLang(input, threadId, userId);

    return res.status(200).json({
        message: response
    });
})

app.post('/workflow/hitl/agent', async (req, res) => {
    const { input, threadId, userId } = req.body;

    if (!input || !threadId) {
        return res.status(400).json({
            success: false,
            message: "Both 'input' and 'threadId' are required"
        });
    }

    const result = await askAgentWithHITL(input, threadId, userId);

    return res.status(200).json({
        success: true,
        ...result
    });
});

app.post('/workflow/hitl/approve', async (req, res) => {
    const { approved, threadId, userId } = req.body;

    if (typeof approved !== "boolean" || !threadId) {
        return res.status(400).json({
            success: false,
            message: "'threadId' and a boolean 'approved' (true/false) are required"
        });
    }

    const result = await approveAgentToolCallHITL(approved, threadId, userId);

    return res.status(200).json({
        success: true,
        ...result
    });
});


export default app;

