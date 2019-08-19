import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    fetchCategoriesIfNeeded
} from "../actions";

class CategoryNav extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchCategoriesIfNeeded());
    }

    render() {
        const navItems = this.props.categories.map(
            category => <li key={category.id} className="nav-item">
                <NavLink
                    to={`/category/${category.id}`}
                    activeClassName="active"
                    className="nav-link">{category.name}</NavLink>
            </li>
        );
        return (
            <nav className="flex-grow-1">
                <ul className="nav">{navItems}</ul>
            </nav>
        );
    }
}

CategoryNav.propTypes = {
    categories: PropTypes.array.isRequired
};

const mapStateToProps = state => {
    const { categories } = state.productsData;
    return { categories };
};

export default connect(mapStateToProps)(CategoryNav);
