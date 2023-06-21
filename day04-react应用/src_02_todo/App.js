import Header from './components/Header';
import List from './components/List'
import Footer from './components/Footer'
import './App.css';
import React, { Component } from 'react'
import UploadImage from './components/UploadImage';
import CheckBox from './components/Checkbox';
/**
|--------------------------------------------------
| cmmb -- 状态在哪里，方法就写在哪里
|--------------------------------------------------
*/
// 创建并默认导出类式组件
export default class App extends Component {
  // 初始化状态
  state = {
    todos: [
      { id: 1, name: "eat", done: true },
      { id: 2, name: "drink", done: true },
      { id: 3, name: "sleep", done: false },
      { id: 4, name: "street", done: false }
    ]
  }
  //addTodo用于添加一个todo，接收的参数是todo对象
  addTodo = (todoObj) => {
    // const { todos } = this.state
    // this.setState({ todos: [todoObj, ...todos] })
    //获取原todos
    const { todos } = this.state
    //追加一个todo
    const newTodos = [todoObj, ...todos]
    //更新状态
    this.setState({ todos: newTodos })
  }
  //updateTodo用于更新一个todo对象
  updateTodo = (id, done) => {
    //获取状态中的todos
    const { todos } = this.state
    //匹配处理数据
    const newTodos = todos.map((todoObj) => {
      if (todoObj.id === id) return { ...todoObj, done }
      else return todoObj
    })
    this.setState({ todos: newTodos })
  }
  //deleteTodo用于删除一个todo对象
  deleteTodo = (id) => {
    //获取原来的todos
    const { todos } = this.state
    //删除指定id的todo对象
    const newTodos = todos.filter((todoObj) => {
      return todoObj.id !== id
    })
    //更新状态
    this.setState({ todos: newTodos })
  }

  //checkAllTodo用于全选
  checkAllTodo = (done) => {
    //获取原来的todos
    const { todos } = this.state
    //加工数据
    const newTodos = todos.map((todoObj) => {
      return { ...todoObj, done }
    })
    //更新状态
    this.setState({ todos: newTodos })
  }

  //clearAllDone用于清除所有已完成的
  clearAllDone = () => {
    //获取原来的todos
    const { todos } = this.state
    //过滤数据
    const newTodos = todos.filter((todoObj) => {
      return !todoObj.done
    })
    console.log('newTodos', newTodos)
    //更新状态
    this.setState({ todos: newTodos })
  }
  render() {
    const { todos } = this.state
    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header addTodo={this.addTodo} />
          <List todos={todos} updateTodo={this.updateTodo} deleteTodo={this.deleteTodo} />
          <Footer todos={todos} checkAllTodo={this.checkAllTodo} clearAllDone={this.clearAllDone} />
        </div>
        <div>
          <UploadImage/>
        </div>
        <div>
          <CheckBox/>
        </div>
      </div>
    )
  }
}


// 创建函数式组件
// function App() {
//   return (
//     <div className="App">
//       <div className="todo-container">
//         <div className="todo-wrap">
//           <Header/>
//           <List/>
//           <Footer/>
//         </div>
//       </div>
//     </div>

//   );
// }

// export default App;
/**
|----------------------------------------------------------------------------
  ## 一、todoList案例相关知识点
		1.拆分组件、实现静态组件，注意：className、style的写法
		2.动态初始化列表，如何确定将数据放在哪个组件的state中？
					——某个组件使用：放在其自身的state中
					——某些组件使用：放在他们共同的父组件state中（官方称此操作为：状态提升）
		3.关于父子之间通信：
				1.【父组件】给【子组件】传递数据：通过props传递
				2.【子组件】给【父组件】传递数据：通过props传递，要求父提前给子传递一个函数
		4.注意defaultChecked 和 checked的区别，类似的还有：defaultValue 和 value
		5.状态在哪里，操作状态的方法就在哪里
|----------------------------------------------------------------------------
*/
