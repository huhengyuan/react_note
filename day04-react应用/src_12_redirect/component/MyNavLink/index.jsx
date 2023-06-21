import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.css'
export default class MyNavLink extends Component {
    
    render() {
        // const { title } = this.props
        return (
            <NavLink activeClassName="gaoliang" className="list-group-item" {...this.props}></NavLink> 
        )
    }
}
