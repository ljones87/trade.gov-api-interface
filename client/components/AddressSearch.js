import React from 'react'
import { connect } from 'react-redux';
import { fetchAddressResultsThunk, submitAddressListThunk, resetAddressSearchThunk } from '../store';
import SearchComponent from './SearchComponent';

class AddressSearch extends React.Component {

  componentDidUpdate() {
    const numRun = this.props.addressResults.length
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
      <div className="query__container">
        <div className="query__contents">
          <h1>Address Query</h1>
          <h3>Searches against fields in the addresses array.</h3>
          <SearchComponent
            {...this.props}
            searchResults={this.props.addressResults}
            searchType="Address"
          />
        </div>
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
    submitSpreadsheet(e) {
      e.preventDefault();
      let file = document.querySelector('input').files[0];
      dispatch(submitAddressListThunk({ spreadsheet }));
    }
  };
};

export default connect(mapState, mapDispatch)(AddressSearch);
