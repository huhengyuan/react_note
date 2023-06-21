import React, {Component} from "react";
import hello from './Hello.module.css'
// 创建并暴露组件Hello
export default class Hello extends Component {
    render(){
        return (
            <div>
                <h1 className={hello.hello}>Hello, React!</h1>
            </div>
        )
    }
}
// export default Hello