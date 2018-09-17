import React from 'react'
import { connect } from 'react-redux';
import { fetchAddressResultsThunk, submitAddressListThunk, resetAddressSearchThunk } from '../store';
import SearchComponent from './SearchComponent';

class AddressSearch extends React.Component {

  componentDidUpdate() {
    const numRun = this.props.addressResults.length
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
              <h1>Address Query</h1>
              <h3>Sorry, there was an error processing the list, please refresh and try again.</h3>
            </React.Fragment>
            :
            <React.Fragment>
              <h1>Address Query</h1>
              <h3>Searches against fields in the addresses array.</h3>
            </React.Fragment>
          }
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
    error: state.addressSearch.error,
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
      dispatch(submitAddressListThunk(file));
    }
  };
};

export default connect(mapState, mapDispatch)(AddressSearch);
