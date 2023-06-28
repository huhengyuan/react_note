import React, { Component } from 'react'
import { Button } from 'antd';
import {
	WechatOutlined,
	SyncOutlined,
	LoadingOutlined,
	TwitterOutlined,
	QqOutlined,
	DingtalkOutlined
} from '@ant-design/icons'

export default class App extends Component {
	render() {
		return (
			<div>
				App...antd
				<br />
				<br />
				<WechatOutlined />
				<Button type="primary">Primary Button</Button>
				<br />
				<br />
				<SyncOutlined spin />
				<Button>默认按钮</Button>
				<br />
				<br />
				<LoadingOutlined />
				<Button type='link'>链接按钮</Button>
				<br />
				<br />
				<TwitterOutlined />
				<Button type='ghost'>ghost 按钮</Button>
				<br />
				<br />
				<QqOutlined />
				<Button type='dashed'>dashed 按钮</Button>
				<br />
				<br />
				<DingtalkOutlined />
				<Button type='text'>text 按钮</Button>
			</div>
		)
	}
}
