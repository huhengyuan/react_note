import React, { useState } from 'react';
import { Layout, theme, Button } from 'antd';
import { Dropdown, Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LoadingOutlined,
  SettingOutlined,
  SolutionOutlined,
  CloseOutlined
} from '@ant-design/icons';
import PubSub from 'pubsub-js'
const { Header } = Layout;

export default function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false);
  // const menu = (
  //   <Menu>
  //     <Menu.Item>
  //       <span>欢迎<span style={{ color: "#1890ff" }}>admin</span>回来!</span>
  //     </Menu.Item>
  //     <Menu.Item danger onClick={() => {
  //       // localStorage.removeItem("token")
  //       // // console.log(props.history)
  //       // props.history.replace("/login")
  //     }}>退出</Menu.Item>
  //   </Menu>
  // );
  const items = [
    {
      key: 'welcome',
      label: (
        <span>欢迎<span style={{ color: "#1890ff" }}>admin</span>回来!</span>
      ),
      icon: <LoadingOutlined />,
      disabled: true,
    },
    {
      key: 'updatePassword',
      label: '修改密码',
      icon: <SettingOutlined />,
      disabled: false,
    },
    {
      key: 'detail',
      label: '详细信息',
      icon: <SolutionOutlined />,
      disabled: false,
    },
    {
      key: 'exit',
      danger: true,
      label: '退出',
      icon: <CloseOutlined />,
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const clickSetCollapsed = (collapsed) => {
    setCollapsed(!collapsed)
    PubSub.publish('collapsed', { collapsed: !collapsed })
  }

  return (

    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => clickSetCollapsed(collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right", marginRight: "20px" }}>
        <Dropdown menu={{
          items,
        }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>

  )
}
