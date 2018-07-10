'use strict'

/* -----------------    IMPORTS     ------------------ */

import axios from 'axios';
import { success } from './stateFunctions';

/* -----------------    ACTION TYPES     ------------------ */
const SUBMIT_ADDRESS_LIST = 'SUBMIT_ADDRESS_LIST';
const SUBMIT_ADDRESS_LIST_SUCCESS = 'SUBMIT_ADDRESS_LIST_SUCCESS';
const GET_ADDRESS_LIST_RESULT = 'GET_ADDRESS_LIST_RESULT';
const GET_ADDRESS_LIST_RESULT_SUCCESS = 'GET_ADDRESS_LIST_RESULT_SUCCESS';
const SUBMIT_ADDRESS_LIST_ERROR = 'SUBMIT_ADDRESS_LIST_ERROR';
const GET_ADDRESS_LIST_RESULT_ERROR = 'GET_ADDRESS_LIST_RESULT_ERROR';

/* ------------   ACTION CREATORS     ------------------ */

const submitAddressList = () => (
  { type: SUBMIT_ADDRESS_LIST }
);

const submitAddressListSuccess = (listlength) => (
  { type: SUBMIT_ADDRESS_LIST_SUCCESS, listlength }
);

const submitAddressListError = (err) => (
  { type: SUBMIT_ADDRESS_LIST_ERROR, err }
);

const getAddressListResult = () => (
  { type: GET_ADDRESS_LIST_RESULT }
);

const getAddressListResultSuccess = (companyResults) => (
  { type: GET_ADDRESS_LIST_RESULT_SUCCESS, companyResults }
);

const getAddressListResultError = (err) => (
  { type: GET_ADDRESS_LIST_RESULT_ERROR, err}
);

/* ------------       THUNK CREATORS     ------------------ */

export const submitAddressListThunk = (spreadsheet) => {

  return dispatch => {
    dispatch(submitAddressList());
    axios.post('/api/address/spreadsheet', spreadsheet)
      .then(res => {
        dispatch(submitAddressListSuccess(res.data.listlength));
      })
      .catch(err => submitAddressListError(err));
  };
};

export const fetchAddressResultsThunk = (currListLength) => {
   return dispatch => {
    dispatch(getAddressListResult());
    console.log('===============',currListLength)
    axios.post('/api/address', currListLength)
      .then(res => (
        dispatch(getAddressListResultSuccess(res.data))
      ))
      .catch(err => getAddressListResultError(err));
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
    case SUBMIT_ADDRESS_LIST:
    case GET_ADDRESS_LIST_RESULT: {
       return Object.assign({}, state, {loading: true});
    }
    case SUBMIT_ADDRESS_LIST_SUCCESS: {
      return {
        ...state,
        spreadsheetReady: true,
        spreadsheetEntries: action.listlength,
        loading: false,
        error: null
      };
    }
    case GET_ADDRESS_LIST_RESULT_SUCCESS:{
      return success(state, 'results', action.companyResults)
  }
    case GET_ADDRESS_LIST_RESULT_ERROR:
    case SUBMIT_ADDRESS_LIST_ERROR: {
      return  Object.assign({}, state, {error: action.err});
    }
    default:
      return state;
  }
}
