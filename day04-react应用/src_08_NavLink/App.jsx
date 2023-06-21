import React, { Component } from 'react'
import { NavLink, Route, BrowserRouter } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'

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
								<NavLink activeClassName='active' className="list-group-item" to="/about">About</NavLink>
								<NavLink activeClassName='active' className="list-group-item" to="/home">Home</NavLink>
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
