import { END } from "@langchain/langgraph";
import { AIMessage } from "langchain";

export const shouldContinue = async (state) => {

    const lastMessage = state.messages.at(-1);

    if(!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END
    }

    if(lastMessage.tool_calls?.length) {
        return "toolNode";
    }

    return END;
}