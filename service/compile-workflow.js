import { END, START, StateGraph } from "@langchain/langgraph";
import { agentState } from "../ai/langgraph/state.js";
import { modelNode } from "../ai/langgraph/nodes/model-node.js";
import { toolNode } from "../ai/langgraph/nodes/tool-node.js";
import { shouldContinue } from "../ai/langgraph/agent-workflow.js";
import { checkpointer } from "../config/db.js"

export const agentLang = new StateGraph(agentState)
    .addNode("agentCall", modelNode)
    .addNode("toolNode", toolNode)
    .addEdge(START, "agentCall")
    .addConditionalEdges("agentCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "agentCall")
    .compile({ checkpointer });