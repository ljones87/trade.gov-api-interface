
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


export const fetchStateData = () => {
   return dispatch => {
    dispatch(getScreeningListResult());
    axios.get('/data')
      .then(res => res.data.forEach(companyResult =>
        dispatch(getScreeningListResultSuccess(companyResult))))
      .catch(err => console.log(err));
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
       return {...state, loading: true};
    }
    case GET_SCREENING_LIST_RESULT_SUCCESS:
      return  [...state.searchedCompanies, action.companyResult]
    default:
      return stateData
  }
}
