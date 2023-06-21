import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <App />
    </div>
  </React.StrictMode>
);
/**
 * 功能界面的组件化编码流程（通用）
 *  1. 拆分组件: 拆分界面,抽取组件
 *  2. 实现静态组件: 使用组件实现静态页面效果
 *  3. 实现动态组件
 *    3.1 动态显示初始化数据
 *       3.1.1 数据类型
 *       3.1.2 数据名称
 *       3.1.2 保存在哪个组件?
 *    3.2 交互(从绑定事件监听开始)
 */
reportWebVitals();
