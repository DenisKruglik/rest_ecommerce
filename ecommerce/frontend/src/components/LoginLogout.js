import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import Spinner from "./Spinner";
import {logout} from "../actions";
import { Redirect } from 'react-router-dom';

class LoginLogout extends Component {
    constructor(props) {
        super(props);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {
            toHome: false
        };
    }

    handleLogoutClick() {
        this.props.dispatch(logout());
        this.setState({
            toHome: true
        });
    }

    render() {
        if (this.state.toHome) {
            return <Redirect to="/"/>;
        }
        const { user, isFetching } = this.props;
        if (user) {
            return (
                <div>
                    <span className="greeting p-2">Hi, {user.username}!</span>
                    <button type="button" onClick={this.handleLogoutClick} className="btn btn-dark m-2">LOGOUT</button>
                </div>
            );
        } else if (isFetching) {
            return <Spinner/>;
        }
        return (
            <ul className="login-logout-links nav">
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Create Account</Link></li>
            </ul>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        isFetching: state.auth.isUserFetching
    }
};

export default connect(mapStateToProps)(LoginLogout);
