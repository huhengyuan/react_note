import React, { Component } from 'react'

const DetailData = [
	{id:'01',content:'GGBOUND'},
	{id:'02',content:'DCG'},
	{id:'03',content:'FYC'}
]
export default class Detail extends Component {
	render() {
		console.log(this.props);
		// 接收params参数
		const {id,title} = this.props.match.params
		const findResult = DetailData.find((detailObj)=>{
			return detailObj.id === id
		})
		return (
			<ul>
				<li>ID:{id}</li>
				<li>TITLE:{title}</li>
				<li>CONTENT:{findResult.content}</li>
			</ul>
		)
	}
}
