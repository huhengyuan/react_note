import React from 'react'
import { useState } from 'react'

export default function UseState() {
    const [name, setName] =useState("xiaoming")
    return (
        <div>
            <button onClick={() =>{
                setName('xiaohuang')
            }}>
                {name}
            </button>
        </div>
    )
}
