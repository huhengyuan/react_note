import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout  } from 'antd'
import Home from '../../components/Home'
import NoPermission from '../../components/NoPermission'
import RightList from '../../components/RightList'
import RoleList from '../../components/RoleList'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import UserList from '../../components/UserList'
import './index.css'

const { Content } = Layout;

export default function Sandbox() {
    
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:"auto"
                    }}
                >
                    <Switch>
                        <Route path="/home" component={Home}></Route>
                        <Route path="/user-manage/list" component={UserList}></Route>
                        <Route path="/right-manage/role/list" component={RoleList}></Route>
                        <Route path="/right-manage/right/list" component={RightList}></Route>
                        {/* <Route path="/" component={}></Route> */}
                        {/* 精准匹配 */}
                        <Redirect from='/' to='/home' exact></Redirect>
                        {/* 未匹配路由 */}
                        <Route path="*" component={NoPermission}></Route>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}
