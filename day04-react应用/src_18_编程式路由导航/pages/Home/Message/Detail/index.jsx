// import React, { Component } from 'react'

// const DetailData = [
//     { id: '01', content: '你好，中国' },
//     { id: '02', content: '你好_<*.*>_' },
//     { id: '03', content: '你好，未来的自己' }
// ]
// export default class Detail extends Component {
//     render() {
//         console.log(this.props);
//         // 接收params参数 
//         const { id, title } = this.props.match.params
//         const findResult = DetailData.find((detailObj) => {
//             return detailObj.id === id
//         })
//         return (
//             <ul>
//                 <li>ID:{id}</li>
//                 <li>TITLE:{title}</li> 
//                 <li>CONTENT:{findResult.content}</li>
//             </ul>
//         )
//     }
// }
import React, { Component } from 'react'
// import url from 'url'
const DetailData = [
    { id: '01', content: 'GGBOUND' },
    { id: '02', content: 'DCG' },
    { id: '03', content: 'FYC' }
]
export default class Detail extends Component {
    render() {
        console.log(this.props);
        // 接收search参数
        // const { search } = this.props.location
        // console.log(search)
        // const parsedUrl = url.parse(search, true);
        // console.log(parsedUrl)
        // const queryObject = parsedUrl.query;
        // const { id, title } = queryObject
        // console.log(queryObject);

        // 接收params参数
        const {id,title} = this.props.match.params 

        // 接收search参数
        // const {search} = this.props.location
        // const {id,title} = qs.parse(search.slice(1))

        // 接收state参数
        // const { id, title } = this.props.location.state || {}
        const findResult = DetailData.find((detailObj) => {
            return detailObj.id === id
        }) || {}
        return (
            <ul>
                <li>ID:{id}</li>
                <li>TITLE:{title}</li>
                <li>CONTENT:{findResult.content}</li>
            </ul>
        )
    }
}
