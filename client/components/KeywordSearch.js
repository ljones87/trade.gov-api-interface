import React from 'react';
import { connect } from 'react-redux';
import { fetchKeywordResultsThunk, submitKeywordListThunk } from '../store';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';

class KeywordSearch extends React.Component {

   componentDidUpdate(){
    const listNotComplete = this.props.keywordResults.length !== this.props.spreadsheetEntries
    const runListButton = document.querySelector('.btn-run-list')
    if(this.props.spreadsheetReady && listNotComplete) {
      setTimeout(() => (
        runListButton.click()
      ), 0)
    } else return;
  }

  render() {
    const {
      keywordResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      submitSpreadsheet
    } = this.props;

    //console.log('===============',keywordResults)
    // console.log('===============',spreadsheetEntries)
    return (
      <div className="excel-container">
        {
          loading ?
          <div>
            <h1>Loading results</h1>
            <h3>{`Current list length: ${keywordResults.length} out of: ${spreadsheetEntries}`}</h3>
          </div>
            :
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
              <button
                className="btn-run-list"
                onClick={
                  () => loadResults(keywordResults.length)
                }
                disabled={!spreadsheetReady}
              >Run list
              </button>
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
