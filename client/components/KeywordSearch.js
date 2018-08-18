import React from 'react';
import { connect } from 'react-redux';
import { fetchKeywordResultsThunk, submitKeywordListThunk, resetKeywordSearchThunk } from '../store';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';

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
      ), 5000)
    } else null;
  }

  render() {
    const {
      keywordResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      submitSpreadsheet,
      resetSearch
    } = this.props;
    const keywordsProessed = keywordResults.length;
    return (
      <div className="excel-container">
        <div>
          <h1>Keyword Query</h1>
          <h3> Searches for a match within the name, alt_names, remarks, and title fields from all eleven lists.</h3>
          {
            !spreadsheetReady ?
              <SpreadsheetEntry
                submitSpreadsheet={submitSpreadsheet}
              />
              : null
          }
          {!loading && spreadsheetReady ?
            <div className="run-list"
              onClick={
                () => loadResults(keywordsProessed)
              } />
            : null
          }

          <button
            onClick={resetSearch}
            disabled={!spreadsheetReady}
          >Reset Search
          </button>
          <h3>{`Current list length: ${keywordsProessed} out of: ${spreadsheetEntries}`}
          </h3>
          <ExcelExport
            keywordResults={keywordResults}
          />
        </div>
        {
          keywordsProessed < spreadsheetEntries ?
            <div className="loading-container">
              <h1>Loading results</h1>
            </div>
            : null
        }
      </div>
    );
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
