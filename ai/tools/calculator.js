import { tool } from "@langchain/core/tools";
import z from "zod";

export const add = tool(({ a, b }) => a + b, {
    name: "add",
    description: "Add two numbers",
    schema: z.object({
        a: z.number().describe("First Number"),
        b: z.number().describe("Second Number")
    }),
});

export const subtract = tool(({ a, b }) => a - b, {
    name: "subtract",
    description: "Subtract two numbers",
    schema: z.object({
        a: z.number().describe("First Number"),
        b: z.number().describe("Second Number")
    }),
});

export const multiply = tool(
    ({ a, b }) => a * b,
    {
        name: "multiply",
        description: "multiply two numbers",
        schema: z.object({
            a: z.number().describe("First Number"),
            b: z.number().describe("Second Number")
        }),
    });

export const divide = tool(({ a, b }) => a / b, {
    name: "divide",
    description: "divide two numbers",
    schema: z.object({
        a: z.number().describe("First Number"),
        b: z.number().describe("Second Number")
    }),
});