"use client";

import { api } from "~/trpc/react";

export default function TodoTask ({ params }: { params: { todoTask: string } }){
    if(!params){
        return(
            <p> loading todo task... </p>
        )
    }
    const { data } = api.todo.getTodo.useQuery(parseInt(params.todoTask));

    return(
        <main>
            {data ? (
                <div>
                    <p> {data.id} </p>
                    <p> {data.name} </p>
                    <p> {data.text} </p>
                </div>
                
            ) : (
                ""
            )}
        </main>
    )
}