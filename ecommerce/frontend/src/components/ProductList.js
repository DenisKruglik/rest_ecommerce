import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ProductList extends Component {
    render() {
        if (!this.props.products) {
            return null;
        }

        let products = this.props.products.map(product => (
            <li key={product.id} className="product mb-3">
                <Link to={`/product/${product.id}`}><h5 className="name">{product.name}</h5></Link>
                <small className="sku">{product.sku}</small>
                <p className="price">{product.price}$</p>
                <button className="btn btn-primary btn-sm">Add to cart</button>
            </li>
        ));

        return (
            <ul className="product-list">{products}</ul>
        );
    }
}

export default ProductList;
