import React from 'react';
import ExcelExport from './ExcelExport';
import SpreadsheetEntry from './SpreadsheetEntry';
import RunList from './RunList';
import LoadingDisplay from './LoadingDisplay';

const SearchComponent = (props) => {
  const {
    searchResults,
    spreadsheetReady,
    spreadsheetEntries,
    loading,
    loadResults,
    submitSpreadsheet,
    resetSearch
  } = props;

  const entriesProcessed = searchResults.length;

  return (
    <div>
      <SpreadsheetEntry
        submitSpreadsheet={submitSpreadsheet}
        spreadsheetReady={spreadsheetReady}
      />
      <RunList
        loading={loading}
        spreadsheetReady={spreadsheetReady}
        runNextBatch={loadResults(entriesProcessed)}
      />
      <button
        onClick={resetSearch}
        disabled={!spreadsheetReady}
      >Reset Search
          </button>
      <h3>{`Current list length: ${entriesProcessed} out of: ${spreadsheetEntries}`}
      </h3>
      <ExcelExport
        searchResults={searchResults}
      />

      <LoadingDisplay
        entriesProcessed={entriesProcessed} spreadsheetEntries={spreadsheetEntries}
      />
    </div>
  );
}

export default SearchComponent;
