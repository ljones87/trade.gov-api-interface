import React from 'react';
import Button from '@material-ui/core/Button';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';
import RunList from './RunList';
import LoadingDisplay from './LoadingDisplay';

const formatMin = (minutes) => {
  var min = Math.floor(Math.abs(minutes));
  var sec = Math.floor((Math.abs(minutes) * 60) % 60) + 8;
  return `${min} minutes ${sec} seconds`;
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
  const minRemaining = Math.floor((entriesRemaining / 100) * 8) / 60;
  //const roundMin = minRemaining.toFixed(2)
  const timeRemaining = formatMin(minRemaining)

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
      <Button
        size="small"
        color="secondary"
        onClick={resetSearch}
        disabled={!spreadsheetReady}
      >{buttonText}
      </Button>
      <ExcelExport
        searchResults={searchResults}
        searchType={searchType}
        listProcessing={listProcessing}
        spreadsheetReady={spreadsheetReady}
      />
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
