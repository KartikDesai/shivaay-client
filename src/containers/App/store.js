import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {themeReducer, rtlReducer, customizerReducer, sidebarReducer, authReducer } from '../../redux/reducers/index';
import { reducer as reduxFormReducer } from 'redux-form';
import thunk from 'redux-thunk';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const reducer = combineReducers({
    theme: themeReducer,
    rtl: rtlReducer,
    customizer: customizerReducer,
    sidebar: sidebarReducer,
    user: authReducer,
    form: reduxFormReducer, // mounted under "form",
});
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
));

export default store;
