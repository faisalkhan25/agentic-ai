import { SystemMessage } from "langchain";
import { llm2 } from "../../llm.js";


export const modelNode = async (state) => {
    const response = await llm2.invoke([
        new SystemMessage(
            "You are a helpfull assistant tasked with performing web search uisng tavily_search tool. Save the user information using save_user_memory tool and recall the user information using recall_user_memories tool. If you have to perform the arithmatic operations you have add,subtract, divide, multiply tools"
        ),
        ...state.messages
    ]);

    return {
        messages: [response],
        llmCalls: 1,
    }
}
