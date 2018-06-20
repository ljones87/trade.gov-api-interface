import React from 'react';
import { connect } from 'react-redux';
import { fetchScreeningResults } from '../store';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class Main extends React.Component {

  componentDidMount() {
    this.props.loadResults();
  }
  render() {
    const { companyResults, loading } = this.props;
    console.log('=============== Company Resulsts', companyResults);

    return (
      <div className="excel-container">
        {
          loading ?
            <h1>Loading results</h1>
            :
            <div>
              <h1>Company Query Results</h1>
              <ExcelFile>
                <ExcelSheet data={companyResults} name="Company Name Results">
                  <ExcelColumn label="Name" value="company" />
                  <ExcelColumn label="Query result" value={(col) => col.error ? col.error.status : col.data.total} />
                  <ExcelColumn label="Error url" value={(col) => col.error ? col.error.url : null} />
                  <ExcelColumn label="Results Api" value={(col) => col.data && col.data.total > 0 ? col.api : null} />
                </ExcelSheet>
              </ExcelFile>
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
      //Promise.all([
      dispatch(fetchScreeningResults());
      // ])
      // .then(() => {
      // console.log('===============COMPLETED RETURN')
      // });
    }
  };
};
export default connect(mapState, mapDispatch)(Main);
