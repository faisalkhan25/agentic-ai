import { END, START, StateGraph } from "@langchain/langgraph";
import { stateHITL } from "../ai/langgraph/state.js";
import { callModelNodeHITL } from "../ai/langgraph/nodes/model-node-HITL.js";
import { requestHumanApprovalNodeHITL } from "../ai/langgraph/nodes/human-approval-node-HITL.js";
import { executeToolsNodeHITL } from "../ai/langgraph/nodes/tool-node-HITL.js";
import { routeAfterModelCallHITL } from "../ai/langgraph/agent-workflow-HITL.js";
import { checkpointer } from "../config/db.js";

export const agentGraphHITL = new StateGraph(stateHITL)
    .addNode("callModelNodeHITL", callModelNodeHITL)
    .addNode("requestHumanApprovalNodeHITL", requestHumanApprovalNodeHITL)
    .addNode("executeToolsNodeHITL", executeToolsNodeHITL)
    .addEdge(START, "callModelNodeHITL")
    .addConditionalEdges("callModelNodeHITL", routeAfterModelCallHITL, [
        "requestHumanApprovalNodeHITL",
        "executeToolsNodeHITL",
        END,
    ])
    .addEdge("requestHumanApprovalNodeHITL", "executeToolsNodeHITL")
    .addEdge("executeToolsNodeHITL", "callModelNodeHITL")
    .compile({ checkpointer });

