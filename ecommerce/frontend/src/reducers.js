import {
    REQUEST_CATEGORIES,
    RECEIVE_CATEGORIES,
    REQUEST_PRODUCTS,
    RECEIVE_PRODUCTS,
    REQUEST_PRODUCT,
    RECEIVE_PRODUCT,
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from "./actions";
import { combineReducers } from "redux";
import { flashMessage } from "redux-flash-messages";

const products = (state = {
    areProductsFetching: false,
    page: 1,
    products: [],
    totalPages: 1
}, action) => {
    switch (action.type) {
        case REQUEST_PRODUCTS:
            return Object.assign({}, state, {
                areProductsFetching: true,
                page: action.page
            });
        case RECEIVE_PRODUCTS:
            return Object.assign({}, state, {
                areProductsFetching: false,
                totalPages: action.totalPages,
                products: action.products,
                page: action.page,
                productsLastUpdated: action.receivedAt
            });
        default:
            return state;
    }
};

const mergeArraysWithIdObjects = (arr1, arr2) => {
    let result = arr1.slice();
    for (let item of arr2) {
        let same = result.findIndex(i => i.id === item.id);
        if (same >= 0) {
            result[same] = item
        } else {
            result.push(item);
        }
    }
    return result;
};

const productsData = (state = {
  categories: [],
  areCategoriesFetching: false,
  categoriesLastUpdated: null
}, action) => {
    switch (action.type) {
        case REQUEST_CATEGORIES:
            return Object.assign({}, state, {areCategoriesFetching: true});
        case RECEIVE_CATEGORIES:
            return Object.assign({}, state, {
                    categories: action.categories.map(c => Object.assign(c, {totalPages: 0})),
                    areCategoriesFetching: false,
                    categoriesLastUpdated: action.receivedAt
                }
            );
        case REQUEST_PRODUCTS:
            return Object.assign({}, state, {
                categories: mergeArraysWithIdObjects(
                    state.categories,
                    [products(state.categories.find(i => i.id === action.category), action)]
                )
            });
        case RECEIVE_PRODUCTS:
            return Object.assign({}, state, {
                categories: mergeArraysWithIdObjects(
                    state.categories,
                    [products(state.categories.find(i => i.id === action.category), action)]
                )
            });
        case REQUEST_PRODUCT:
            return Object.assign({}, state, {
                isProductFetching: true
            });
        case RECEIVE_PRODUCT:
            return Object.assign({}, state, {
                product: action.product,
                isProductFetching: false
            });
        default:
            return state;
    }
};

const auth = (state = {
    user: null,
    isUserFetching: false
}, action) => {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                isUserFetching: true
            });
        case LOGIN_SUCCESS:
            localStorage.setItem('authToken', action.token);
            return Object.assign({}, state, {
                user: action.user,
                token: action.token,
                isUserFetching: false
            });
        case LOGIN_FAIL:
            return Object.assign({}, state, {
                isUserFetching: false
            });
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    productsData,
    auth,
    flashMessage
});

export default rootReducer;
