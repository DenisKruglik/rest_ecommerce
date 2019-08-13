import {
    REQUEST_CATEGORIES,
    RECEIVE_CATEGORIES
} from "./actions";

const initialState = {
  categories: [],
  areCategoriesFetching: false,
  categoriesLastUpdated: null
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_CATEGORIES:
            return Object.assign({}, state, { areCategoriesFetching: true });
        case RECEIVE_CATEGORIES:
            return Object.assign({}, state, {
                    categories: action.categories,
                    areCategoriesFetching: false,
                    categoriesLastUpdated: action.receivedAt
                }
            );
        default:
            return state;
    }
};

export default rootReducer;
