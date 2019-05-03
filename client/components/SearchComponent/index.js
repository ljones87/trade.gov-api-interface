import React from 'react';
import Button from '@material-ui/core/Button';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';
import RunList from './RunList';
import LoadingDisplay from './LoadingDisplay';

const formatTime = (decimaltime) => {
  var min = Math.floor(Math.abs(decimaltime));
  var sec = Math.floor(((Math.abs(decimaltime) * 60)) % 60);
  return `${min} min ${sec} sec`;
}

class SearchComponent extends React.Component {
  constructor() {
    super()
    this.state ={
      spreadsheetUploaded: false
    }
    this.fileAdded = this.fileAdded.bind(this);
    this.fileCleared = this.fileCleared.bind(this);
  }

  fileAdded(e) {
    e.preventDefault();
    const input = document.querySelector('input');
    if(input.value) this.setState({spreadsheetUploaded: true});
  }

  fileCleared() {
    this.setState({spreadsheetUploaded: false});
    const form = document.querySelector('[name="spreadsheet-input"]');
    if(form !==null) form.reset();
  }

  render() {
    const {
      searchResults,
      spreadsheetReady,
      spreadsheetEntries,
      loading,
      loadResults,
      submitSpreadsheet,
      resetSearch,
      error,
      searchType,
    } = this.props;

    const entriesProcessed = searchResults.length;
    const listProcessing = entriesProcessed < spreadsheetEntries
    const buttonText = listProcessing ? 'Cancel Search' : 'Reset Search'
    const entriesRemaining = spreadsheetEntries - searchResults.length;
    const decimalTime = Math.floor((entriesRemaining / 100) * 8) / 60;
    const timeRemaining = formatTime(decimalTime)

    return (
      <div>
        <SpreadsheetEntry
          fileAdded={this.fileAdded}
          spreadsheetUploaded={this.state.spreadsheetUploaded}
          submitSpreadsheet={submitSpreadsheet}
          spreadsheetReady={spreadsheetReady}
        />
        <RunList
          loading={loading}
          spreadsheetReady={spreadsheetReady}
          loadResults={loadResults}
          entriesProcessed={entriesProcessed}
        />
        <div className="btn__container">
          <ExcelExport
            searchResults={searchResults}
            searchType={searchType}
            listProcessing={listProcessing}
            spreadsheetReady={spreadsheetReady}
          />
          <Button
            size="small"
            color="secondary"
            onClick={() => {
              resetSearch(),
              this.fileCleared()
            }}
            disabled={!spreadsheetReady && !error}
          >{buttonText}
          </Button>
        </div>
        <LoadingDisplay
          error={error}
          entriesProcessed={entriesProcessed}
          listProcessing={listProcessing}
          spreadsheetEntries={spreadsheetEntries}
          timeRemaining={timeRemaining}
        />
      </div>
    )
  }
}

export default SearchComponent;
