
import screeningListResults from './screeningListResults';
import spreadshetInput from './spreadsheetInput';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

const reducer = combineReducers({
  screeningListResults,
  spreadshetInput
});

const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
);

const store = createStore(reducer, middleware);

export default store;

export * from './screeningListResults';
export * from './spreadsheetInput';
