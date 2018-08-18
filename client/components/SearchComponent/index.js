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
    resetSearch,
    searchType
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
        loadResults={loadResults}
        entriesProcessed={entriesProcessed}
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
        searchType={searchType}
      />

      <LoadingDisplay
        entriesProcessed={entriesProcessed} spreadsheetEntries={spreadsheetEntries}
      />
    </div>
  );
}

export default SearchComponent;
