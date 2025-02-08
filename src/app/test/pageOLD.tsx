'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

interface Task {
    task: string;
}

export default function nowletdoitwithoutAI() {

    const supabaseUrl = 'https://xvaoqofrrmyimwuuankb.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    const [task, setTask] = useState<Task[]>([])

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase
                .from('tasks')
                .select('task')
            if (data) setTask(data)
        }
        fetchData()
    }, [])


    return (
        <>

            {task.map((item, index) => (
                <p key={index}>
                    {item.task}
                </p>
            ))}

        </>
    )
}