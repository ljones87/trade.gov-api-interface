import React from 'react';
import { connect } from 'react-redux';
import { fetchKeywordResultsThunk, submitKeywordListThunk, resetKeywordSearchThunk } from '../store';
import SearchComponent from './SearchComponent';
import XLSX from 'xlsx';

class KeywordSearch extends React.Component {

  componentDidUpdate() {
    const numRun = this.props.keywordResults.length
    const total = this.props.spreadsheetEntries
    const { spreadsheetReady } = this.props;
    const listNotComplete = numRun < total;
    const timeout = numRun < 100 ? 0 : 8000;
    const runList = document.querySelector('.run-list')
    if (spreadsheetReady && listNotComplete && runList) {
      setTimeout(() => (
        runList.click()
      ), timeout)
    } else return;
  }

  render() {
    const { error } = this.props

    return (
      <div className="query__container">
        <div className="query__contents">
          {error ?
            <React.Fragment>
              <h1>Keyword Query</h1>
              <h3 style={{ color: 'red' }}> Sorry, there was an error processing the list, please refresh and try again.
            </h3>
            </React.Fragment>
            :
            <React.Fragment>
              <h1>Keyword Query</h1>
              <h3> Searches for a match within the name, alt_names, remarks, and
               title fields from all eleven lists.
              </h3>
              <p className="reminder">
                To improve search performance, replace any ampersands (&) in spreadsheet
                query column with 'and'
              </p>
            </React.Fragment>
          }
          <SearchComponent
            {...this.props}
            searchResults={this.props.keywordResults}
            searchType="Keyword"
          />
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    spreadsheetReady: state.keywordSearch.spreadsheetReady,
    spreadsheetEntries: state.keywordSearch.spreadsheetEntries,
    keywordResults: state.keywordSearch.results,
    loading: state.keywordSearch.loading,
    error: state.keywordSearch.error
  };
};

const mapDispatch = (dispatch) => {
  return {
    resetSearch() {
      dispatch(resetKeywordSearchThunk())
    },
    loadResults(currListLength) {
      dispatch(fetchKeywordResultsThunk({ count: currListLength }));
    },
    submitSpreadsheet(e) {
      e.preventDefault();
      let file = document.querySelector('input').files[0];
      dispatch(submitKeywordListThunk(file));
    }
  };
};

export default connect(mapState, mapDispatch)(KeywordSearch);
