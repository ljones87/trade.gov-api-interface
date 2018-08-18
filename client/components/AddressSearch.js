import React from 'react'
import { connect } from 'react-redux';
import { fetchAddressResultsThunk, submitAddressListThunk, resetAddressSearchThunk } from '../store';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';

class AddressSearch extends React.Component {

  componentDidUpdate() {
    const numRun = this.props.addressResults.length
    const total = this.props.spreadsheetEntries
    const listNotComplete = numRun < total
    const runListButton = document.querySelector('.btn-run-list')
    if (this.props.spreadsheetReady && listNotComplete) {
      setTimeout(() => (
        runListButton.click()
      ), 8000)
    } else return;
  }

  render() {
    const {
      addressResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      resetSearch,
      submitSpreadsheet
    } = this.props;

    return (
      <div className="excel-container">
        {
          loading ?
            <div>
              <h1>Loading results</h1>
              <h3> {`Current list length: ${addressResults.length} out of: ${spreadsheetEntries}`}</h3>
            </div>
            :
            <div>
              <h1>Address Query</h1>
              <h3>Searches against fields in the addresses array.</h3>
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
                  () => loadResults(addressResults.length)
                }
                disabled={!spreadsheetReady}
              >Run list
              </button>
              <button
                onClick={resetSearch}
                disabled={!spreadsheetReady}
              >
                Reset Search
              </button>
              <h3>
                {`Current list length: ${addressResults.length} out of: ${spreadsheetEntries}`}
              </h3>
              <ExcelExport
                addressResults={addressResults}
              />
            </div>
        }
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    spreadsheetReady: state.addressSearch.spreadsheetReady,
    spreadsheetEntries: state.addressSearch.spreadsheetEntries,
    addressResults: state.addressSearch.results,
    loading: state.addressSearch.loading
  };
};

const mapDispatch = (dispatch) => {
  return {
    resetSearch() {
      dispatch(resetAddressSearchThunk())
    },
    loadResults(currListLength) {
      dispatch(fetchAddressResultsThunk({ count: currListLength }));
    },
    submitSpreadsheet(event) {
      event.preventDefault();
      const e = event.target;
      let spreadsheet = e.spreadsheet.value;
      spreadsheet = spreadsheet.replace("C:\\fakepath\\", "");
      dispatch(submitAddressListThunk({ spreadsheet }));
    }
  };
};

export default connect(mapState, mapDispatch)(AddressSearch);
