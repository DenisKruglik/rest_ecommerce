export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';

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

    }
}