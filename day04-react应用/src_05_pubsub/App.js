import React, { Component } from 'react'
import Search from './component/Search'
import List from './component/List'
import './App.css';

// 创建并默认导出类式组件
export default class App extends Component {

  render() {
    return (
      <div>
        <Search />
        <List />
      </div>
    )
  }
}
