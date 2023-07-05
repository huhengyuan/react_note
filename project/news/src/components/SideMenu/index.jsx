import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom'
import {
  IdcardOutlined,
  UserOutlined,
  KeyOutlined,
  SolutionOutlined,
  CheckOutlined,
  FileDoneOutlined,
  HomeOutlined,
  SendOutlined,
  CreditCardOutlined,
  EditOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  IssuesCloseOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios'
import PubSub from 'pubsub-js'

const { Sider } = Layout;

// const menuList = [
//   {
//     key: '/home',
//     icon: <HomeOutlined />,
//     label: '首页',
//   }, {
//     key: '/user-manage',
//     icon: <UserOutlined />,
//     label: '用户管理',
//     children: [
//       {
//         key: '/user-manage/list',
//         icon: <UsergroupAddOutlined />,
//         label: '用户列表',
//       }
//     ],
//   }, {
//     key: '/right-manage',
//     icon: <SolutionOutlined />,
//     label: '权限管理',
//     children: [
//       {
//         key: '/right-manage/role/list',
//         icon: <IdcardOutlined />,
//         label: '角色列表',
//       }, {
//         key: '/right-manage/right/list',
//         icon: <KeyOutlined />,
//         label: '权限列表',
//       }
//     ],
//   }, {
//     key: '/news_manage',
//     icon: <FileDoneOutlined />,
//     label: '新闻管理',
//     children: []
//   }, {
//     key: '/check_manage',
//     icon: <CheckOutlined />,
//     label: '审核管理',
//     children: []
//   }, {
//     key: '/publish_manage',
//     icon: <SendOutlined />,
//     label: '发布管理',
//     children: []
//   }
// ]
const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <IdcardOutlined />,
  '/right-manage': <SolutionOutlined />,
  '/right-manage/role/list': <IdcardOutlined />,
  '/right-manage/right/list': <KeyOutlined />,
  '/news-manage': <FileDoneOutlined />,
  '/news-manage/add': <EditOutlined />,
  '/news-manage/draft': <CreditCardOutlined />,
  '/news-manage/category': <CodeOutlined />,
  '/audit-manage': <CheckOutlined />,
  '/audit-manage/audit': <ClockCircleOutlined />,
  '/audit-manage/list': <CheckSquareOutlined />,
  '/publish-manage': <SendOutlined />,
  '/publish-manage/unpublished': <IssuesCloseOutlined />,
  '/publish-manage/published': <CheckCircleOutlined />,
  '/publish-manage/sunset': <CloseCircleOutlined />,
}

async function getMenus() {
  const res = await axios.get("http://localhost:5000/rights?_embed=children")
  // console.log(res)
  const modifiedData = res.data.map((item) => {
    item.icon = iconList[item.key]
    if (item.children.length === 0) {
      delete item.children
    }
    if (item.pagepermisson && item.pagepermisson === 1) {
      if (item.children) {
        item.children = item.children.filter(child => child.pagepermisson && child.pagepermisson === 1);
        item.children.map(item => {
          item.icon = iconList[item.key]
          delete item.rightId
          return item
        })
      }
      return item
    }
    return null
  }).filter(item => item !== null);
  return modifiedData
}
const list = await getMenus()


function SideMenu(props) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const collapsed = PubSub.subscribe('collapsed', (_, stateObj) => {
      // console.log('subscribe', stateObj)
      const { collapsed } = stateObj
      setCollapsed(collapsed)
    })

    return () => {
      PubSub.unsubscribe(collapsed);
    };
  }, []); // 空数组作为第二个参数表示只在组件挂载和卸载时执行
  // console.log(props.location.pathname)
  const selectKeys = [props.location.pathname]
  const openKeys = ['/' + props.location.pathname.split('/')[1]]
  // display: flex：将元素的布局模式设置为Flex布局，使其子元素能够按照弹性容器的规则排列。
  // height: 100 %：将元素的高度设置为父元素的100 % 高度，使其占据父元素的全部垂直空间。
  // flexDirection: column：指定子元素在Flex容器中按垂直方向排列，从上到下。
  // 综合起来，这个样式对象将应用于一个元素上，使其成为一个Flex容器，垂直方向排列子元素，并将高度设置为父元素的100 %。
  // 'flex': 1：将元素的 flex 属性设置为 1，这将使元素自动根据可用空间进行伸缩。这通常与 flex 容器一起使用，以使元素填充可用空间。
  // 'overflow': 'auto'：设置元素的溢出处理方式为自动。如果元素的内容超出了可视区域，将会显示滚动条以便用户滚动查看内容。
  // 综合起来，这个样式对象将应用于一个元素上，使其具有自动伸缩的 flex 属性，并在需要时显示滚动条。
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ 'display': 'flex', 'height': '100%', 'flexDirection': 'column' }}>
        <div style={{
          float: "top",
          background: "linear-gradient(to bottom, #0D86F7 , black)",
          height: "70px",
          textAlign: "center",
          paddingTop: "25px",
          fontWeight: "bold",
          fontSize: "20px",
          color: "#FA0505",
          textShadow: "0 0 5px white"
        }}>News</div>
        <div style={{ 'flex': 1, 'overflow': 'auto' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
            items={list}
            onClick={(item) => {
              //  console.log(props)
              props.history.push(item.key)
            }}
          />
        </div>
      </div>

    </Sider>
  )
}
export default withRouter(SideMenu)
