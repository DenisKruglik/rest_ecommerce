import React, { Component } from 'react';
import CategoryNav from "./CategoryNav";
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <header className="d-flex flex-row align-items-center">
                <Link to="/" className="home-link">Home</Link>
                <CategoryNav/>
            </header>
        );
    }
}

export default Header;
