import React, { Component } from 'react'
import './index.css'
export default class Footer extends Component {
  //全选checkbox的回调
	handleCheckAll = (event)=>{
		this.props.checkAllTodo(event.target.checked)
	}

	//清除已完成任务的回调
	handleClearAllDone = ()=>{
		this.props.clearAllDone()
	}
  render() {
    const { todos } = this.props
    const total = todos.length
    let doneCount = 0;
    doneCount = todos.filter(todo => todo.done === true).length;
    doneCount = todos.reduce((acc, todo) => {
      if (todo.done === true) {
        return acc + 1;
      }
      return acc;
    }, 0);
    // for (let i = 0; i < todos.length; i++) {
    //   if (todos[i].done === true) {
    //     count++;
    //   }
    // }
    
    return (
      <div className="todo-footer">
        <label>
          <input type="checkbox" onChange={this.handleCheckAll} checked={doneCount === total && total !== 0 ? true : false}/>
        </label>
        <span>
          <span>已完成【{doneCount}】</span> / 全部【{total}】
        </span>
        <button className="btn btn-danger" onClick={this.handleClearAllDone}>清除已完成任务</button>
      </div>
    )
  }
}
