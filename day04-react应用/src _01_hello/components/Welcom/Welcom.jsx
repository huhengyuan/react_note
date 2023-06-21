import React, {Component} from "react";
import './Welcom.css'
// 创建并暴露组件Hello
export default class Welcom extends Component {
    render(){
        return (
            <div>
                <h1 className="hello">Hello, World!</h1>
            </div>
        )
    }
}
// export default Hello