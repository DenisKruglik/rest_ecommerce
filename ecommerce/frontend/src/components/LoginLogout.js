import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

function LoginLogout(props) {
    const user = props.user;
    if (user) {
        return <span className="greeting">Hi, {user.username}!</span>;
    }
    return (
        <ul className="login-logout-links nav">
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Create Account</Link></li>
        </ul>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

export default connect(mapStateToProps)(LoginLogout);
