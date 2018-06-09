
/* -----------------    IMPORTS     ------------------ */

import axios from 'axios'

/* -----------------    ACTION TYPES     ------------------ */

const GET_SCREENING_LIST_RESULT = 'GET_SCREENING_LIST_RESULT';
const GET_SCREENING_LIST_RESULT_SUCCESS = "GET_SCREENING_LIST_RESULT_SUCCESS";
const GET_SCREENING_LIST_RESULT_ERROR = "GET_SCREENING_LIST_RESULT_ERROR";

/* ------------   ACTION CREATORS     ------------------ */

const getScreeningListResult = () => (
  { type: GET_SCREENING_LIST_RESULT }
)

const getScreeningListResultSuccess = (companyResult) => (
  { type: GET_SCREENING_LIST_RESULT_SUCCESS, companyResult }
)

const getScreeningListResultError = (err) => (
  { type: GET_SCREENING_LIST_RESULT_ERROR, err}
)
/* ------------       THUNK CREATORS     ------------------ */


export const fetchScreeningResults = () => {
   return dispatch => {
    dispatch(getScreeningListResult());
    axios.get('/data')
      .then(res => (
        console.log('===============STORE DATA', res.data),
        dispatch(getScreeningListResultSuccess(res.data.companyResult))
      ))
      .catch(err => getScreeningListResultError(err));
  }
}

/* ------------       REDUCERS     ------------------ */
const initialState = {
  loading: false,
  searchedCompanies: [],
  error: null
}
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SCREENING_LIST_RESULT: {
       return Object.assign({}, state, {loading: true});
    }
    case GET_SCREENING_LIST_RESULT_SUCCESS:{
      return  [...state.searchedCompanies, action.companyResult];
    }
    case GET_SCREENING_LIST_RESULT_ERROR: {
      return  Object.assign({}, state, {error: action.err});
    }
    default:
      return state;
  }
}
