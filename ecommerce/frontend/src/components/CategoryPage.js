import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {fetchProductsIfNeeded} from "../actions";
import ProductList from "./ProductList";
import Spinner from "./Spinner";

class CategoryPage extends Component {
    componentDidMount() {
        const { dispatch, match: { params: { category } } } = this.props;
        dispatch(fetchProductsIfNeeded(category*1));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.category
                || this.props.category.id !== prevProps.category.id
                || this.props.category.page !== prevProps.category.page) {
            const { dispatch, match: { params: { category } } } = this.props;
            dispatch(fetchProductsIfNeeded(category*1));
        }
    }

    render() {
        const category = this.props.category;

        return category ? (
            <Fragment>
                <h1>{category.name}</h1>
                {category.areProductsFetching ?
                <Spinner/> : <ProductList products={category.products}/>}
            </Fragment>
        ) : <Spinner/>;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        category: state.categories.find(item => item.id === ownProps.match.params.category*1)
    }
};

export default connect(mapStateToProps)(CategoryPage);
