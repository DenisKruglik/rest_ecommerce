import React, { Component } from 'react';
import CategoryNav from "./CategoryNav";
import { Link } from 'react-router-dom';
import LoginLogout from "./LoginLogout";

class Header extends Component {
    render() {
        return (
            <header className="d-flex flex-row align-items-center navbar navbar-expand-lg navbar-light bg-light">
                <Link to="/" className="home-link p-3">Home</Link>
                <CategoryNav/>
                <LoginLogout/>
            </header>
        );
    }
}

export default Header;
