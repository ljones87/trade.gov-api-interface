
import keywordSearch from './keywordSearch';
import addressSearch from './addressSearch';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

const reducer = combineReducers({
  keywordSearch,
  addressSearch
});

const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
);

const store = createStore(reducer, middleware);

export default store;

export * from './keywordSearch';
export * from './addressSearch';
