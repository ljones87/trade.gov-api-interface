import React from 'react';
import { connect } from 'react-redux';
import { fetchScreeningResultsThunk, submitScreeningListThunk } from '../store';
import ExcelExport from './ExcelExport';

class Main extends React.Component {

  render() {
    const {
      companyResults,
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
              <h1>Company Query Results</h1>
            <form onSubmit={submitSpreadsheet}>
              <input
                type="file"
                accept=".xls,.xlsx,.ods"
                name="spreadsheet"
//                fileread opts="vm.gridOptions"
                multiple="false"
              />

              <button
                type="submit"
              >
              Submit Spreadsheet
              </button>
              </form>
              <button
                onClick={loadResults}
              >Run list</button>
              <h3>{`Current list length: ${companyResults.length}`}
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
    companyResults: state.screeningListResults.searchedCompanies,
    loading: state.screeningListResults.loading
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadResults() {
      Promise.all([
        dispatch(fetchScreeningResultsThunk())
      ])
      .then(() => {
      console.log('===============COMPLETED RETURN');
      });
    },
    submitSpreadsheet(event) {
      event.preventDefault();
      const e = event.target;
      const spreadsheet = e.spreadsheet.value;
      //debugger;
      console.log('===============input values ', spreadsheet);
      dispatch(submitScreeningListThunk({spreadsheet}));
    }
  };

};
export default connect(mapState, mapDispatch)(Main);
