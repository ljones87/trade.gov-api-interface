import React from 'react';
import { connect } from 'react-redux';
import {fetchScreeningResults} from '../store';

class Main extends React.Component {

 componentDidMount() {
  this.props.loadResults()
 }
  render () {
    console.log('=============== MAIN THIS.PROPS',this.props)
    const companyResults = this.props.companyResults;
    console.log('=============== Company Resulsts',companyResults)
    return (
      <div className="input-container">
        <h1>I live!</h1>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    companyResults: state.screeningListResults.searchedCompanies
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadResults() {
      Promise.all([
      dispatch(fetchScreeningResults())
      ])
      .then(() => {
        console.log('===============COMPLETED RETURN')
      });
    }
  }
}
export default connect(mapState, mapDispatch)(Main);
