import React from 'react'
import { connect } from 'react-redux';
import { fetchAddressResultsThunk, submitAddressListThunk } from '../store';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';

class AddressSearch extends React.Component {
  render() {
    const {
      addressResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      submitSpreadsheet
    } = this.props;

    return (
      <div className="excel-container">
        {
          loading ?
            <h1>Loading results</h1>
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
                onClick={
                  () => loadResults(addressResults.length)
                }
                disabled={!spreadsheetReady}
              >Run list
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
    loadResults(currListLength) {
      dispatch(fetchAddressResultsThunk({ count: currListLength }));
    },
    submitSpreadsheet(event) {
      event.preventDefault();
      const e = event.target;
      let spreadsheet = e.spreadsheet.value;
      spreadsheet = spreadsheet.replace("C:\\fakepath\\", "");
      //debugger;
      dispatch(submitAddressListThunk({ spreadsheet }));
    }
  };
};

export default connect(mapState, mapDispatch)(AddressSearch);
