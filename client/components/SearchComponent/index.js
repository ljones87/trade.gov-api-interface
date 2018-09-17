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

const SearchComponent = (props) => {
  const {
    searchResults,
    spreadsheetReady,
    spreadsheetEntries,
    loading,
    loadResults,
    submitSpreadsheet,
    resetSearch,

    searchType
  } = props;

  const entriesProcessed = searchResults.length;
  const listProcessing = entriesProcessed < spreadsheetEntries
  const buttonText = listProcessing ? 'Cancel Search' : 'Reset Search'
  const entriesRemaining = spreadsheetEntries - searchResults.length;
  const decimalTime = Math.floor((entriesRemaining / 100) * 8) / 60;
  const timeRemaining = formatTime(decimalTime)

  return (
    <div>
      <SpreadsheetEntry
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
          onClick={resetSearch}
          disabled={!spreadsheetReady}
        >{buttonText}
        </Button>
      </div>
      <LoadingDisplay
        entriesProcessed={entriesProcessed}
        listProcessing={listProcessing}
        spreadsheetEntries={spreadsheetEntries}
        timeRemaining={timeRemaining}
      />
    </div>
  );
}

export default SearchComponent;
