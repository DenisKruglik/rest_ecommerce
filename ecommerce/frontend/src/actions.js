export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const REQUEST_PRODUCT = 'REQUEST_PRODUCT';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';

function requestCategories() {
    return { type: REQUEST_CATEGORIES };
}

function receiveCategories(json) {
    return {
        type: RECEIVE_CATEGORIES,
        categories: json.results,
        receivedAt: Date.now()
    };
}

function shouldFetchCategories(state) {
    if (!state.categories || !state.categories.length) {
        return true;
    } else if (state.areCategoriesFetching) {
        return false;
    }
}

function fetchCategories() {
    return dispatch => {
        dispatch(requestCategories());
        return fetch('/categories/')
            .then(response => response.json())
            .then(json => dispatch(receiveCategories(json)));
    }
}

export function fetchCategoriesIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchCategories(getState())) {
            return dispatch(fetchCategories());
        }
    };
}

function requestProducts(category, page) {
    return {
        type: REQUEST_PRODUCTS,
        category: category,
        page: page
    };
}

function receiveProducts(category, page, json) {
    return {
        type: RECEIVE_PRODUCTS,
        category,
        page,
        products: json.products,
        receivedAt: Date.now()
    }
}

function fetchProducts(category, page) {
    return dispatch => {
        dispatch(requestProducts(category, page));
        return fetch(`/categories/${category}/${page ? `?page=${page}` : ''}`, )
            .then(response => response.json())
            .then(json => dispatch(receiveProducts(category, page, json)));
    };
}

function shouldFetchProducts(state, id) {
    const category = state.categories.find(item => item.id === id);

    if (category) {
        if (!category.products || !category.products.length) {
            return true;
        } else if (category.areProductsFetching) {
            return false;
        }
    }
    return false;
}

export function fetchProductsIfNeeded(category, page = 1) {
    return (dispatch, getState) => {
        if (shouldFetchProducts(getState(), category)) {
            return dispatch(fetchProducts(category, page));
        }
    };
}

function requestProduct(id) {
    return {
        type: REQUEST_PRODUCT,
        id: id
    };
}

function receiveProduct(json) {
    return {
        type: RECEIVE_PRODUCT,
        product: json
    };
}

function fetchProduct(id) {
    return dispatch => {
        dispatch(requestProduct(id));
        return fetch(`/products/${id}/`)
            .then(response => response.json())
            .then(json => dispatch(receiveProduct(json)));
    };
}

function shouldFetchProduct(state, id) {
    if (!state.product || state.product.id !== id) {
        return true;
    } else if (state.isProductFetching) {
        return false;
    }
    return false;
}

export function fetchProductIfNeeded(id) {
    return (dispatch, getState) => {
        if (shouldFetchProduct(getState(), id)) {
            return dispatch(fetchProduct(id));
        }
    };
}
