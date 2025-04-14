import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
    // creates a todo using name and text of todo as input 
    newTodo : publicProcedure
    .input(z.object({ name: z.string(), text: z.string() }))
    .mutation(async ({ ctx, input }) =>{
        return ctx.db.todo.create({ data: input })
    }),

    // takes in number id of todo to remove 
    deleteTodo : publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) =>{
        return ctx.db.todo.delete({
            where:{
                id: input 
            }
        })
    }),

    // takes in id, name, and text to update todo
    editTodo : publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), text: z.string() }))
    .mutation(async({ ctx, input }) =>{
        return ctx.db.todo.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                text: input.text
            }
        })
    }),

    // returns specific todo based on input id 
    getTodo : publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) =>{
        const todo = ctx.db.todo.findFirst({
            where: {
                id: input
            }
        })

        return todo;
    }),

    // grabs and returns all todos 
    getAllTodos : publicProcedure
    .query(async ({ ctx }) =>{
        const allTodos = ctx.db.todo.findMany();

        return allTodos
    })
})
