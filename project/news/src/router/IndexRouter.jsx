import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login'
import Sandbox from '../views/Sandbox'

export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}></Route>
                {/* <Route path='/' component={Sandbox}></Route> */}
                <Route path='/' render={() =>
                    localStorage.getItem("token") ?
                        <Sandbox ></Sandbox> :
                        <Redirect to="/login" />
                }></Route>
            </Switch>
        </HashRouter>
    )
}
