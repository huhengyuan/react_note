import React, { Component } from 'react'
import Search from './component/Search'
import './App.css';
import List from './component/List';
// import Table from './component/Table';
// import Mask from './component/Mask';
/**
|--------------------------------------------------
| cmmb -- 状态在哪里，方法就写在哪里
|--------------------------------------------------
*/
// 创建并默认导出类式组件
export default class App extends Component {
  state = { //初始化状态
    users: [], //users初始值为数组
    isFirst: true, //是否为第一次打开页面
    isLoading: false,//标识是否处于加载中
    err: '',//存储请求相关的错误信息
  }
  
  //更新App的state
  updateAppState = (stateObj) => {
    this.setState(stateObj)
  }
  render() {
    return (
      <div>
        <div className="container">
          <Search updateAppState={this.updateAppState} />
          <List {...this.state} />
          {/* <Table /> */}
          {/* <Mask/> */}
        </div>
      </div>
    )
  }
}
