import React from 'react';
import { connect } from 'react-redux';
import { fetchKeywordResultsThunk, submitKeywordListThunk, resetKeywordSearchThunk } from '../store';
import SearchComponent from './SearchComponent';

class KeywordSearch extends React.Component {

  componentDidUpdate() {
    const numRun = this.props.keywordResults.length
    const total = this.props.spreadsheetEntries
    const { spreadsheetReady } = this.props;
    const listNotComplete = numRun < total
    const runList = document.querySelector('.run-list')
    if (spreadsheetReady && listNotComplete) {
      setTimeout(() => (
        runList.click()
      ), 8000)
    } else return;
  }

  render() {

    return (
      <div className="excel-container">
      <div>
        <h1>Keyword Query</h1>
        <h3> Searches for a match within the name, alt_names, remarks, and title fields from all eleven lists.</h3>
      </div>
      <SearchComponent
        {...this.props}
        searchResults={this.props.keywordResults}
        searchType="Keyword"
      />
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    spreadsheetReady: state.keywordSearch.spreadsheetReady,
    spreadsheetEntries: state.keywordSearch.spreadsheetEntries,
    keywordResults: state.keywordSearch.results,
    loading: state.keywordSearch.loading
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
    submitSpreadsheet(event) {
      event.preventDefault();
      const e = event.target;
      let spreadsheet = e.spreadsheet.value;
      spreadsheet = spreadsheet.replace("C:\\fakepath\\", "");
      dispatch(submitKeywordListThunk({ spreadsheet }));
    }
  };
};

export default connect(mapState, mapDispatch)(KeywordSearch);

