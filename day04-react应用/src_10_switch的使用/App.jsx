import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import MyNavLink from './component/MyNavLink'

export default class App extends Component {
	render() {
		return (
			<div>
				<div className="row">
					<div className="col-xs-offset-2 col-xs-8">
						<div className="page-header"><h2>React Router Demo</h2></div>
					</div>
				</div>
				{/* <BrowserRouter> 直接包裹app组件 */}
				<div className="row">
					<div className="col-xs-2 col-xs-offset-2">
						<div className="list-group">

							{/* 原生html中，靠<a>跳转不同的页面 */}
							{/* <a className="list-group-item" href="./about.html">About</a>
							<a className="list-group-item active" href="./home.html">Home</a> */}

							{/* 在React中靠路由链接实现切换组件--编写路由链接 */}
							{/* <BrowserRouter> */}
							{/* <NavLink activeClassName='active' className="list-group-item" to="/about">About</NavLink>
								<NavLink activeClassName='active' className="list-group-item" to="/home">Home</NavLink> */}
							{/* 标签体内容是一个特殊的属性 children属性 */}
							<Switch>
								{/* 用于单一匹配 */}
								<MyNavLink to="/about" title="About">About</MyNavLink>
								<MyNavLink to="/home" title="Home">Home</MyNavLink>
								<MyNavLink to="/about" title="About">About</MyNavLink>
								<MyNavLink to="/home" title="Home">Home</MyNavLink>
							</Switch>
							<MyNavLink to="/about" title="About">About</MyNavLink>
							<MyNavLink to="/home" title="Home">Home</MyNavLink>
							{/* </BrowserRouter> */}
						</div>
					</div>
					<div className="col-xs-6">
						<div className="panel">
							<div className="panel-body">
								{/* 注册路由 */}
								{/* <BrowserRouter> 导致两个路由*/}
								<Route path="/about" component={About} />
								<Route path="/home" component={Home} />
								{/* </BrowserRouter> */}
							</div>
						</div>
					</div>
				</div>
				{/* </BrowserRouter> */}
			</div>
		)
	}
}
