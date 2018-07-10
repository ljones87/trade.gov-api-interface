
/* -----------------    IMPORTS     ------------------ */

import axios from 'axios';
import { success } from './stateFunctions';

/* -----------------    ACTION TYPES     ------------------ */
const SUBMIT_SCREENING_LIST = 'SUBMIT_SCREENING_LIST';
const SUBMIT_SCREENING_LIST_SUCCESS = 'SUBMIT_SCREENING_LIST_SUCCESS';
const GET_SCREENING_LIST_RESULT = 'GET_SCREENING_LIST_RESULT';
const GET_SCREENING_LIST_RESULT_SUCCESS = 'GET_SCREENING_LIST_RESULT_SUCCESS';
const SUBMIT_SCREENING_LIST_ERROR = 'SUBMIT_SCREENING_LIST_ERROR';
const GET_SCREENING_LIST_RESULT_ERROR = 'GET_SCREENING_LIST_RESULT_ERROR';
const FETCH_STATE = 'FETCH_STATE';

/* ------------   ACTION CREATORS     ------------------ */

const submitScreeningList = () => (
  { type: SUBMIT_SCREENING_LIST }
);

const submitScreeningListSuccess = (listlength) => (
  { type: SUBMIT_SCREENING_LIST_SUCCESS, listlength }
);

const submitScreeningListError = (err) => (
  { type: SUBMIT_SCREENING_LIST_ERROR, err }
);

const getScreeningListResult = () => (
  { type: GET_SCREENING_LIST_RESULT }
);

const getScreeningListResultSuccess = (companyResults) => (
  { type: GET_SCREENING_LIST_RESULT_SUCCESS, companyResults }
);

const getScreeningListResultError = (err) => (
  { type: GET_SCREENING_LIST_RESULT_ERROR, err}
);

export const fetchState = () => (
  { type: FETCH_STATE }
);

/* ------------       THUNK CREATORS     ------------------ */

export const submitScreeningListThunk = (spreadsheet) => {

  return dispatch => {
    dispatch(submitScreeningList());
    axios.post('/api/keyword/spreadsheet', spreadsheet)
      .then(res => {
        dispatch(submitScreeningListSuccess(res.data.listlength));
      })
      .catch(err => submitScreeningListError(err));
  };
};

export const fetchScreeningResultsThunk = (currListLength) => {
   return dispatch => {
    dispatch(getScreeningListResult());
    console.log('===============',currListLength)
    axios.post('/api/keyword', currListLength)
      .then(res => (
        dispatch(getScreeningListResultSuccess(res.data))
      ))
      .catch(err => getScreeningListResultError(err));
     };
};

/* ------------       REDUCERS     ------------------ */
const initialState = {
  spreadsheetReady: false,
  spreadsheetEntries: null,
  loading: false,
  searchedCompanies: [],
  error: null
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SUBMIT_SCREENING_LIST:
    case GET_SCREENING_LIST_RESULT: {
       return Object.assign({}, state, {loading: true});
    }
    case SUBMIT_SCREENING_LIST_SUCCESS: {
      return {
        ...state,
        spreadsheetReady: true,
        spreadsheetEntries: action.listlength,
        loading: false,
        error: null
      };
    }
    case GET_SCREENING_LIST_RESULT_SUCCESS:{
      return success(state, 'searchedCompanies', action.companyResults)
  }
    case GET_SCREENING_LIST_RESULT_ERROR:
    case SUBMIT_SCREENING_LIST_ERROR: {
      return  Object.assign({}, state, {error: action.err});
    }
    default:
      return state;
  }
}
