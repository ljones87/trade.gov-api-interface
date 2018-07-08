
/* -----------------    IMPORTS     ------------------ */

import axios from 'axios';

/* -----------------    ACTION TYPES     ------------------ */
const SUBMIT_SCREENING_LIST = 'SUBMIT_SCREENING_LIST';
const SUBMIT_SCREENING_LIST_SUCCESS = 'SUBMIT_SCREENING_LIST_SUCCESS';
const GET_SCREENING_LIST_RESULT = 'GET_SCREENING_LIST_RESULT';
const GET_SCREENING_LIST_RESULT_SUCCESS = "GET_SCREENING_LIST_RESULT_SUCCESS";
const GET_SCREENING_LIST_RESULT_ERROR = "GET_SCREENING_LIST_RESULT_ERROR";

/* ------------   ACTION CREATORS     ------------------ */

const submitScreeningList = () => (
  { type: SUBMIT_SCREENING_LIST }
);

const submitScreeningListSuccess = (message) => (
  { type: SUBMIT_SCREENING_LIST_SUCCESS, message }
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
/* ------------       THUNK CREATORS     ------------------ */

export const submitScreeningListThunk = (spreadsheet) => {
  return dispatch => {
    axios.post('/spreadsheet', spreadsheet)
      .then(res => {
        dispatch(submitScreeningListSuccess);
        console.log('===============thunk put', res);
      });
  };
};

export const fetchScreeningResultsThunk = () => {
   return dispatch => {
    dispatch(getScreeningListResult());
    axios.get('/data')
      .then(res => (
        dispatch(getScreeningListResultSuccess(res.data))
      ))
      .catch(err => getScreeningListResultError(err));
    };
};

/* ------------       REDUCERS     ------------------ */
const initialState = {
  loading: false,
  searchedCompanies: [],
  error: null
};
export default function (state = initialState, action) {
  switch (action.type) {
    case
    SUBMIT_SCREENING_LIST,
    GET_SCREENING_LIST_RESULT: {
       return Object.assign({}, state, {loading: true});
    }
    case GET_SCREENING_LIST_RESULT_SUCCESS:{
      return  {
       loading: false,
       searchedCompanies: action.companyResults,
       error: null
    };
  }
    case GET_SCREENING_LIST_RESULT_ERROR: {
      return  Object.assign({}, state, {error: action.err});
    }
    default:
      return state;
  }
}
