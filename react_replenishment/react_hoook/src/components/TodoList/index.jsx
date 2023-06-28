import React from 'react'
import { useState } from 'react'

export default function TodoList() {
    const [name, setName] = useState("xiaoming")
    const [list, setList] = useState([11, 22, 33])
    const handleDel = (index) => {
        console.log(index)
        var newlist = [...list]
        newlist.splice(index,1)
        setList(newlist)
    }
    
    return (
        <div>
            <input onChange={(event) => {
                console.log(event.target.value)
                setName(event.target.value)
            }} value={name} />
            <button onClick={() => {
                console.log('添加List！')
                setList([...list, name])
                console.log(list)
                setName("")
            }}>
                add
            </button>
            <ul>
                {
                    list.map((item, index) => {
                        return <li key={item}>{item}
                            <button onClick={() => handleDel(index)}>del</button>
                        </li>
                    })
                }
            </ul>
            {!list.length  && <div>暂无待办事项</div>}
        </div>
    )
}
