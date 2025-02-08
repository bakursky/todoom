'use client'

import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { QRCodeSVG } from 'qrcode.react';

interface Task {
    id: number;
    task: string;
    completed: boolean;
    user_id: string;
    created_at: string;
}

const supabase = createClient('https://xvaoqofrrmyimwuuankb.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_KEY!)

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [userId, setUserId] = useState('')
    const [inputTask, setInputTask] = useState('')
    const [inputId, setInputId] = useState('')
    const userIdUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}#${userId}`

    useEffect(() => {
        const checkUserId = () => {
            const hashId = window.location.hash.replace("#", "")
            if (hashId) {
                localStorage.setItem('userid', hashId)
                return hashId
            }
            
            const localId = localStorage.getItem('userid')
            if (localId) return localId

            const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            let newId = ''
            for (let i = 0; i < 12; i++) {
                newId += char.charAt(Math.floor(Math.random() * char.length))
            }
            localStorage.setItem('userid', newId)
            return newId
        }
        setUserId(checkUserId())
    }, [])


    const fetchData = async () => {
        if (!userId) return;
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error
        if (data) setTasks(data)
    }

    useEffect(() => {
        fetchData()
    }, [userId])

    //7X92LVNOX8QU


    const buttonHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const { error } = await supabase
            .from('tasks')
            .insert([{ user_id: userId, task: inputTask }])
        if (error) throw error
        setInputTask('')
        await fetchData()
    }

    const checkHandler = async (id: number, completed: boolean) => {
        const { error } = await supabase
            .from('tasks')
            .update({ completed: !completed })
            .eq('id', id);
        if (error) throw error
        await fetchData()
    }

    const deleteTask = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault()
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
        if (error) throw error
        await fetchData()
    }

    return (
        <div className="flex flex-col w-96 mx-auto pt-10 font-press-start">
          <img src="/logo.png" />
            <input value={inputTask} onChange={(e) => { setInputTask(e.target.value) }} placeholder="Do ultra-violence" />
            <button onClick={buttonHandler} className="pb-10">Add task</button>

            {tasks.map((task) => (
                <p key={task.id} className={task.completed ? 'line-through' : ''}>
                    <input type="checkbox" checked={task.completed} onChange={() => { checkHandler(task.id, task.completed) }} />
                    {task.task}
                    <button onClick={(e) => { deleteTask(e, task.id) }}>❌</button>
                </p>
            ))}


            <div className="pt-10">Your ID: <button>{userId}</button></div>
            <details className="cursor-pointer">
              <summary>Generate qr code</summary>
              <div className="inline-block p-4 bg-white ">
              <QRCodeSVG value={`https://${userIdUrl}`}  size={200} level="H"/>
              </div>
                
            </details>

            <div className="pb-10"><input onChange={(e) => { setInputId(e.target.value) }} placeholder="Set new id" className="w-64"/>
                <button onClick={() => { setUserId(inputId) }}>Sync</button>
            </div>
            <p>Made by <a href="https://bakursky.ru/">bakursky</a></p>
            {/* <p><a href="https://dos.zone/ru/doom2d/">Play DOOM 2</a></p> */}

{/* 
            <div>
                <iframe
                    src="https://js-dos.com/games/doom2.exe.html"
                    width="800"
                    height="600"
                    style={{ border: 'none' }}
                    allowFullScreen
                ></iframe>
            </div> */}
        </div>
    )
}