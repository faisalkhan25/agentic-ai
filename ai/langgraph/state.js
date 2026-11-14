import { MessagesValue, ReducedValue, StateSchema } from "@langchain/langgraph";
import z from "zod";

const agentState = new StateSchema({
    messages: MessagesValue,

    llmCalls: new ReducedValue(

        z.number().default(() => 0),

        { reducer: (oldValue, newValue) => oldValue + newValue }
    ),
})