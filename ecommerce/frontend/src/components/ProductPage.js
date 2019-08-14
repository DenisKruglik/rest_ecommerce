import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {fetchProductIfNeeded} from "../actions";
import Spinner from "./Spinner";

class ProductPage extends Component {
    componentDidMount() {
        const { dispatch, match: { params: { product } } } = this.props;
        dispatch(fetchProductIfNeeded(product*1));
    }

    render() {
        const product = this.props.product;
        const isFetching = this.props.isFetching;

        return isFetching ? <Spinner/> : (
            (product ? (
                <Fragment>
                    <h1>{product.name}</h1>
                    <div><span>SKU:</span> <span>{product.sku}</span></div>
                    <div><span>Price:</span> <span>{product.price} $</span></div>
                    <p>{product.description}</p>
                </Fragment>
            ) : null)
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        product: state.product,
        isFetching: state.isProductFetching
    };
};

export default connect(mapStateToProps)(ProductPage);
