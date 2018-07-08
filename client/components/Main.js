import React from 'react';
import { connect } from 'react-redux';
import { fetchScreeningResultsThunk, submitScreeningListThunk, fetchState } from '../store';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';

class Main extends React.Component {

  render() {
    const {
      companyResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      submitSpreadsheet
    } = this.props;

    console.log('===============',companyResults)
    console.log('===============',spreadsheetEntries)
    return (
      <div className="excel-container">
        {
          loading ?
            <h1>Loading results</h1>
            :
            <div>
              <h1>Company Query Results</h1>
              {
                !spreadsheetReady ?
                  <SpreadsheetEntry
                    submitSpreadsheet={submitSpreadsheet}
                  />
                : null
              }
              <button
                onClick={
                  () => loadResults(companyResults.length)
                }
                disabled={!spreadsheetReady}
              >Run list</button>
              <h3>{`Current list length: ${companyResults.length} out of: ${spreadsheetEntries}`}
              </h3>
             <ExcelExport
              companyResults={companyResults}
             />
            </div>
        }
      </div>

    );
  }
}

const mapState = (state) => {
  return {
    spreadsheetReady: state.screeningListResults.spreadsheetReady,
    spreadsheetEntries: state.screeningListResults.spreadsheetEntries,
    companyResults: state.screeningListResults.searchedCompanies,
    loading: state.screeningListResults.loading
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchState() {
      dispatch(fetchState());
    },
    loadResults(currListLength) {
      dispatch(fetchScreeningResultsThunk({count: currListLength}));
    },
    submitSpreadsheet(event) {
      event.preventDefault();
      const e = event.target;
      let spreadsheet = e.spreadsheet.value;
      spreadsheet = spreadsheet.replace("C:\\fakepath\\", "");
      //debugger;
      dispatch(submitScreeningListThunk({spreadsheet}));
    }
  };
};

export default connect(mapState, mapDispatch)(Main);
