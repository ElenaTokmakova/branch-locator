
import React, { Component } from 'react';
import './header.scss';
import {
    Link,
    withRouter
  } from "react-router-dom";

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            path: window.location.pathname
        }
    }

    componentDidMount() {
        this.unlisten = this.props.history.listen(location => {
            this.setState({
                path: location.pathname
            })
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return (
            <div className = "header-container">
                    <nav>
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className={this.state.path === '/branch-locator'  || this.state.path === '/' ? 'active' : ''}>
                                <Link to="/branch-locator" aria-controls="branch-locator" role="tab">
                                    <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>&nbsp;
                                    Find a Branch
                                </Link>
                            </li>
                            <li role="presentation" className={this.state.path === '/all-branches' ? 'active' : ''}>
                                <Link to="/all-branches" aria-controls="all-branches" role="tab">
                                    <span className="glyphicon glyphicon-th-list" aria-hidden="true"></span>&nbsp;
                                    All Branches
                                </Link>
                            </li>
                            <li role="presentation" className={ this.state.path.includes('branch-details') ? 'active' : 'hidden'}>
                                <Link to="/branch-details" aria-controls="branch-details" role="tab">
                                    <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;
                                    Branch Details
                                </Link>
                            </li>
                        </ul>
                    </nav>
            </div>
        );
    }
}

export default withRouter(Header);