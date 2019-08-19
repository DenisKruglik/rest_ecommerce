import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {fetchProductIfNeeded} from "../actions";
import Spinner from "./Spinner";

class ProductPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qty: 1
        };
        this.decrementQty = this.decrementQty.bind(this);
        this.incrementQty = this.incrementQty.bind(this);
    }

    componentDidMount() {
        const { dispatch, match: { params: { product } } } = this.props;
        dispatch(fetchProductIfNeeded(product*1));
    }

    incrementQty() {
        this.setState({
            qty: this.state.qty + 1
        });
    }

    decrementQty() {
        if (this.state.qty > 1) {
            this.setState({
                qty: this.state.qty - 1
            });
        }
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
                    <form>
                        <div className="mb-2">
                            <label htmlFor="qty" className="mr-2">Qty:</label>
                            <fieldset className="d-inline-block">
                                <button
                                    className="decrement-qty btn btn-primary"
                                    type="button"
                                    onClick={this.decrementQty}>
                                    <span>-</span>
                                </button>
                                <input type="number"
                                       id="qty"
                                       className="form-control d-inline-block text-center"
                                       readOnly={true}
                                       value={this.state.qty}/>
                                <button
                                    className="increment-qty btn btn-primary"
                                    type="button"
                                    onClick={this.incrementQty}>
                                    <span>+</span>
                                </button>
                            </fieldset>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Add to cart</button>
                    </form>
                </Fragment>
            ) : null)
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        product: state.productsData.product,
        isFetching: state.productsData.isProductFetching
    };
};

export default connect(mapStateToProps)(ProductPage);
