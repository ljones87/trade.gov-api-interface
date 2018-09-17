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
    if (spreadsheetReady && listNotComplete) {
      setTimeout(() => (
        runList.click()
      ), timeout)
    } else return;
  }

  render() {

    return (
      <div className="query__container">
        <div className="query__contents">
          <h1>Keyword Query</h1>
          <h3> Searches for a match within the name, alt_names, remarks, and
           title fields from all eleven lists.
          </h3>
          <p className="reminder">
            To improve search performance, replace any ampersands (&) in spreadsheet
            query column with 'and'
         </p>
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
    submitSpreadsheet(e) {
      e.preventDefault();
      let file = document.querySelector('input').files[0];
      dispatch(submitKeywordListThunk(file));
    }
  };
};

export default connect(mapState, mapDispatch)(KeywordSearch);

/*attempts 1 and 2

const reader  = new FileReader()
      console.log('===============FIL',file)
      const loadedFile = reader.onload = ((f) => {
        // const data = new FormData(f);
        // data.append('f', f, f.name);
        var data = new Uint8Array(f);

        const blob = new Blob([f], {type: f.type} )

        return [data, blob]
      })(file)
      console.log('===============loadedfile', loadedFile)
      reader.readAsArrayBuffer(loadedFile[1])
      spreadsheet = loadedFile[0]
      console.log('===============sheet',spreadsheet)

      */
