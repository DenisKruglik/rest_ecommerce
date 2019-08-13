import React, { Component } from 'react';
import CategoryNav from "./CategoryNav";

class Header extends Component {
    render() {
        return (
            <header>
                <CategoryNav/>
            </header>
        );
    }
}

export default Header;
