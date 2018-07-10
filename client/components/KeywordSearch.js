import React from 'react';
import { connect } from 'react-redux';
import { fetchKeywordResultsThunk, submitKeywordListThunk, fetchState } from '../store';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';

class KeywordSearch extends React.Component {

  render() {
    const {
      keywordResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      submitSpreadsheet
    } = this.props;

    // console.log('===============',keywordResults)
    // console.log('===============',spreadsheetEntries)
    return (
      <div className="excel-container">
        {
          loading ?
            <h1>Loading results</h1>
            :
            <div>
              <h1>Keyword Query</h1>
              {
                !spreadsheetReady ?
                  <SpreadsheetEntry
                    submitSpreadsheet={submitSpreadsheet}
                  />
                : null
              }
              <button
                onClick={
                  () => loadResults(keywordResults.length)
                }
                disabled={!spreadsheetReady}
              >Run list</button>
              <h3>{`Current list length: ${keywordResults.length} out of: ${spreadsheetEntries}`}
              </h3>
             <ExcelExport
              keywordResults={keywordResults}
             />
            </div>
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
    fetchState() {
      dispatch(fetchState());
    },
    loadResults(currListLength) {
      dispatch(fetchKeywordResultsThunk({count: currListLength}));
    },
    submitSpreadsheet(event) {
      event.preventDefault();
      const e = event.target;
      let spreadsheet = e.spreadsheet.value;
      spreadsheet = spreadsheet.replace("C:\\fakepath\\", "");
      //debugger;
      dispatch(submitKeywordListThunk({spreadsheet}));
    }
  };
};

export default connect(mapState, mapDispatch)(KeywordSearch);
