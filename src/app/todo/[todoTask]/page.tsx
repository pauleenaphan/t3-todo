"use client";

import { api } from "~/trpc/react";
type ParamsType = { todoTask: string }

export default async function TodoTask({ params }: { params: Promise<ParamsType> }) {
    const resolvedParams = await params;
    if (!resolvedParams) {
        return <p>loading todo task...</p>
    }

    const { data } = api.todo.getTodo.useQuery(parseInt(resolvedParams.todoTask));

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