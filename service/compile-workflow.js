import { END, START, StateGraph } from "@langchain/langgraph";
import { agentState } from "../ai/langgraph/state";
import { modelNode } from "../ai/langgraph/nodes/model-node";
import { toolNode } from "../ai/langgraph/nodes/tool-node";
import { shouldContinue } from "../ai/langgraph/agent-workflow";

export const agent = new StateGraph(agentState)
    .addNode("agentCall", modelNode)
    .addNode("toolNode", toolNode)
    .addEdge(START, "agentCall")
    .addConditionalEdges("agentCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "agentCall")
    .compile();