import {addError, addSuccess} from "redux-flash-messages/lib";

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const REQUEST_PRODUCT = 'REQUEST_PRODUCT';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const REQUEST_USER_FAIL = 'REQUEST_USER_FAIL';
export const LOGOUT = 'LOGOUT';

function requestCategories() {
    return { type: REQUEST_CATEGORIES };
}

function receiveCategories(json) {
    return {
        type: RECEIVE_CATEGORIES,
        categories: json,
        receivedAt: Date.now()
    };
}

function shouldFetchCategories(state) {
    if (!state.productsData.categories || !state.productsData.categories.length) {
        return true;
    } else if (state.productsData.areCategoriesFetching) {
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
        totalPages: json.total_pages,
        products: json.results,
        receivedAt: Date.now()
    }
}

function fetchProducts(category, page) {
    return dispatch => {
        dispatch(requestProducts(category, page));
        let params = new URLSearchParams({
            category,
            page
        });
        return fetch(`/products/${params ? `?${params.toString()}` : ''}`, )
            .then(response => response.json())
            .then(json => dispatch(receiveProducts(category, page, json)));
    };
}

function shouldFetchProducts(state, id, page) {
    const category = state.productsData.categories.find(item => item.id === id);

    if (category) {
        if (!category.products || !category.products.length || category.page !== page) {
            return true;
        } else if (category.areProductsFetching) {
            return false;
        }
    }
    return false;
}

export function fetchProductsIfNeeded(category, page = 1) {
    return (dispatch, getState) => {
        if (shouldFetchProducts(getState(), category, page)) {
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
    if (!state.productsData.product || state.productsData.product.id !== id) {
        return true;
    } else if (state.productsData.isProductFetching) {
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

export function login(username, password) {
    return dispatch => {
        dispatch(loginAction());
        let fd = new FormData();
        fd.append('username', username);
        fd.append('password', password);
        return fetch('/token-auth/', {
            method: 'POST',
            body: fd
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Invalid credentials provided for login');
        }).then(json => {
            dispatch(loginSuccess(json));
            addSuccess({ text: 'You logged in successfully!' });
        }).catch(error => {
            dispatch(loginFail(error));
            addError({ text: error.message });
        });
    };
}

function shouldLogin(state) {
    return !!state.auth.user;
}

export function loginIfNeeded(username, password) {
    return (dispatch, getState) => {
        if (shouldLogin(getState())) {
            return dispatch(login(username, password));
        }
    };
}

function loginAction() {
    return {
        type: LOGIN
    };
}

function loginSuccess(json) {
    return {
        type: LOGIN_SUCCESS,
        user: json.user,
        token: json.token
    }
}

function loginFail(error) {
    return {
        type: LOGIN_FAIL,
        message: error.message
    }
}

function requestUser() {
    return {
        type: REQUEST_USER
    };
}

function receiveUser(json, token) {
    return {
        type: RECEIVE_USER,
        user: json,
        token
    };
}

function shouldFetchUser(state) {
    return !state.auth.user && (!!state.auth.token || !!localStorage.getItem('authToken'));
}

function requestUserFail() {
    return {
        type: REQUEST_USER_FAIL
    };
}

function fetchUser(token) {
    return dispatch => {
        dispatch(requestUser());
        return fetch('/current_user/', {
            headers: {
              Authorization: `JWT ${token}`
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to get user data');
        }).then(json => dispatch(receiveUser(json, token)))
            .catch(error => dispatch(requestUserFail()));
    };
}

export function fetchUserIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();
        if (shouldFetchUser(state)) {
            const token = state.auth.token || localStorage.getItem('authToken');
            return dispatch(fetchUser(token));
        }
    };
}

export function logout() {
    return {
        type: LOGOUT
    };
}
