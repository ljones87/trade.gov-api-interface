
/* -----------------    IMPORTS     ------------------ */

import axios from 'axios';
import { success } from './stateFunctions';

/* -----------------    ACTION TYPES     ------------------ */
const SUBMIT_KEYWORD_LIST = 'SUBMIT_KEYWORD_LIST';
const SUBMIT_KEYWORD_LIST_SUCCESS = 'SUBMIT_KEYWORD_LIST_SUCCESS';
const GET_KEYWORD_LIST_RESULT = 'GET_KEYWORD_LIST_RESULT';
const GET_KEYWORD_LIST_RESULT_SUCCESS = 'GET_KEYWORD_LIST_RESULT_SUCCESS';
const SUBMIT_KEYWORD_LIST_ERROR = 'SUBMIT_KEYWORD_LIST_ERROR';
const GET_KEYWORD_LIST_RESULT_ERROR = 'GET_KEYWORD_LIST_RESULT_ERROR';
const FETCH_STATE = 'FETCH_STATE';

/* ------------   ACTION CREATORS     ------------------ */

const submitKeywordList = () => (
  { type: SUBMIT_KEYWORD_LIST }
);

const submitKeywordListSuccess = (listlength) => (
  { type: SUBMIT_KEYWORD_LIST_SUCCESS, listlength }
);

const submitKeywordListError = (err) => (
  { type: SUBMIT_KEYWORD_LIST_ERROR, err }
);

const getKeywordListResult = () => (
  { type: GET_KEYWORD_LIST_RESULT }
);

const getKeywordListResultSuccess = (companyResults) => (
  { type: GET_KEYWORD_LIST_RESULT_SUCCESS, companyResults }
);

const getKeywordListResultError = (err) => (
  { type: GET_KEYWORD_LIST_RESULT_ERROR, err}
);

export const fetchState = () => (
  { type: FETCH_STATE }
);

/* ------------       THUNK CREATORS     ------------------ */

export const submitKeywordListThunk = (spreadsheet) => {

  return dispatch => {
    dispatch(submitKeywordList());
    axios.post('/api/keyword/spreadsheet', spreadsheet)
      .then(res => {
        dispatch(submitKeywordListSuccess(res.data.listlength));
      })
      .catch(err => submitKeywordListError(err));
  };
};

export const fetchKeywordResultsThunk = (currListLength) => {
   return dispatch => {
    dispatch(getKeywordListResult());
    console.log('===============',currListLength)
    axios.post('/api/keyword', currListLength)
      .then(res => (
        dispatch(getKeywordListResultSuccess(res.data))
      ))
      .catch(err => getKeywordListResultError(err));
     };
};

/* ------------       REDUCERS     ------------------ */
const initialState = {
  spreadsheetReady: false,
  spreadsheetEntries: null,
  loading: false,
  results: [],
  error: null
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SUBMIT_KEYWORD_LIST:
    case GET_KEYWORD_LIST_RESULT: {
       return Object.assign({}, state, {loading: true});
    }
    case SUBMIT_KEYWORD_LIST_SUCCESS: {
      return {
        ...state,
        spreadsheetReady: true,
        spreadsheetEntries: action.listlength,
        loading: false,
        error: null
      };
    }
    case GET_KEYWORD_LIST_RESULT_SUCCESS:{
      return success(state, 'results', action.companyResults)
  }
    case GET_KEYWORD_LIST_RESULT_ERROR:
    case SUBMIT_KEYWORD_LIST_ERROR: {
      return  Object.assign({}, state, {error: action.err});
    }
    default:
      return state;
  }
}
