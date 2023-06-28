//引入react核心库
import React from 'react'
//引入ReactDOM
// import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
//
import { BrowserRouter } from 'react-router-dom'
//引入App
import App from './App'

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<BrowserRouter>
	<App />
</BrowserRouter>);


// ReactDOM.render(
// 	<BrowserRouter>
// 		<App/>
// 	</BrowserRouter>,
// 	document.getElementById('root')
// )