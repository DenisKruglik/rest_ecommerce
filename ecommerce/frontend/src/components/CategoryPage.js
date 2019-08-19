import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {fetchProductsIfNeeded} from "../actions";
import ProductList from "./ProductList";
import Spinner from "./Spinner";
import ReactPaginate from 'react-paginate';

class CategoryPage extends Component {
    constructor(props) {
        super(props);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        const { dispatch, match: { params: { category } } } = this.props;
        dispatch(fetchProductsIfNeeded(category*1));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.category
                || this.props.category.id !== prevProps.category.id) {
            const { dispatch, match: { params: { category } } } = this.props;
            dispatch(fetchProductsIfNeeded(category*1));
        }
    }

    handlePageClick(data) {
        this.props.dispatch(fetchProductsIfNeeded(this.props.category.id, data.selected + 1));
    }

    render() {
        const category = this.props.category;

        return category ? (
            <Fragment>
                <h1>{category.name}</h1>
                {category.areProductsFetching ?
                <Spinner/> : <ProductList products={category.products}/>}
                <nav>
                    <ReactPaginate
                      previousLabel={'Previous'}
                      nextLabel={'Next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={category.totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                      activeClassName={'active'}
                      disabledClassName={'disabled'}
                      previousClassName={'page-item'}
                      nextClassName={'page-item'}
                      previousLinkClassName={'page-link'}
                      nextLinkClassName={'page-link'}
                      forcePage={category.page - 1}
                    />
                </nav>
            </Fragment>
        ) : <Spinner/>;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        category: state.productsData.categories.find(item => item.id === ownProps.match.params.category*1)
    }
};

export default connect(mapStateToProps)(CategoryPage);
