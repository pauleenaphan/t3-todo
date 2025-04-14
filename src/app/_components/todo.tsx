"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { api } from "~/trpc/react";

interface Todo {
    name: string,
    text: string,
    createdAt?: Date,
    updatedAt?: Date,
    done?: boolean,
    id: number
}

export function Todopage(){
    const router = useRouter();

    const [todoForm, setTodoForm] = useState(false);
    const [todo, setTodo] = useState<Todo>({
        name: "",
        text: "",
        id: 0,
    })
    const { data, refetch } = api.todo.getAllTodos.useQuery();
    const [listOfAllTodos, setListOfAllTodos] = useState<Todo[]>([]);
    const [currFormAction, setCurrFormAction] = useState<string>("");

    useEffect(() =>{
        if(data){
            setListOfAllTodos(data);
        }
    }, [data])

    // defines the mutation for our backend endpoints 
    const newTodo = api.todo.newTodo.useMutation({
        onSuccess: async () =>{
            setTodoForm(false);
            setTodo({name: "", text: "", id: 0});
            alert("new todo has been added");
            await refetch();
        },
        onError: () =>{
            alert("error creating new todo");
        }
    })

    const removeTodo = api.todo.deleteTodo.useMutation({
        onSuccess: async () =>{
            alert("todo has been removed");
            await refetch();
        },
        onError: () =>{
            alert("todo has NOT been removed ");
        }
    })

    const editTodo = api.todo.editTodo.useMutation({
        onSuccess: async () =>{
            alert("todo is succesfully edit");
            setTodoForm(false);
            await refetch();
        },
        onError: () =>{
            alert("todo cannot be edited");
        }
    })

    const handleTodoChange = (key: string, val: string) =>{
        setTodo(prev => ({ ...prev, [key]: val }));
    }

    const handleTodoForm = (e: React.FormEvent) =>{
        e.preventDefault();

        if(currFormAction == "New"){
            newTodo.mutate({ name: todo.name, text: todo.text });
        }else{
            //edit todo
            editTodo.mutate({ id: todo.id,  name: todo.name, text: todo.text })
        }       
    }

    return(
        <main className="mx-auto w-1/3 mt-30">
            <section>
                <div className="flex justify-between pb-2">
                    <h1 className="font-bold text-2xl"> Your Todos </h1>
                    <button onClick={() =>{ 
                        setTodoForm(!todoForm);
                        setCurrFormAction("New"); 
                    }}
                        className="text-xl border-green-500 border-2 rounded px-2 hover:bg-green-500 hover:text-white cursor-pointer"
                    > + Add todo </button>
                </div>
                
                {todoForm ? (
                    <form onSubmit={handleTodoForm}
                        className="bg-pink-100 flex flex-col"
                    >
                        <h2> {currFormAction} todo form </h2>
                        <div className="flex flex-col">
                            <label> name </label>
                            <input 
                                type='text' 
                                placeholder="name of todo here"
                                value={todo.name}
                                onChange={(e) =>{ handleTodoChange("name", e.target.value)}}
                            />
                            <label> text </label>
                            <textarea 
                                placeholder="text here"
                                value={todo.text}
                                onChange={(e) => { handleTodoChange("text", e.target.value)}}
                            />
                        </div>
                        <button type="submit"> Submit Todo </button>
                    </form>
                ) : (
                    ""
                )}
            </section>
            <section className="flex flex-col gap-4">
                {listOfAllTodos ? (
                    // loops thru todos 
                    listOfAllTodos.map(todo => (
                        <div key={todo.id} 
                            className="bg-gray-200 p-4 rounded"
                            >
                            <h3 className="text-lg font-bold"> {todo.name} </h3>
                            <p className="mb-4"> {todo.text} </p>
                            <div className="flex gap-3 flex-row">
                                <button 
                                    onClick={() =>{ if(todo.id){ removeTodo.mutate(todo.id) }}}
                                    className="border-2 border-red-500 rounded px-2 cursor-pointer hover:bg-red-500 hover:text-white"
                                    > REMOVE TODO </button>
                                <button
                                    onClick={() =>{
                                        setTodo({name: todo.name, text: todo.text, id: todo.id});
                                        setCurrFormAction("Edit");
                                        setTodoForm(!todoForm);
                                    }}
                                    className="border-2 border-orange-500 rounded px-2 cursor-pointer hover:bg-orange-500 hover:text-white"
                                > EDIT TODO </button>
                                <button
                                    onClick={() =>{ router.push(`/todo/${todo.id}`)}}
                                    className="border-2 border-blue-500 rounded px-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                                > VIEW THIS TODO </button>
                            </div>
                            
                        </div>
                    ))
                ) : (
                    <p> Loading todos...</p>
                )}
            </section>
            <section>

            </section>
        </main>
    )
}