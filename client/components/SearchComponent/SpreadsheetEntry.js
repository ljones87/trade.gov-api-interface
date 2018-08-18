import React from "react";

const SpreadsheetEntry = props => {
  const { submitSpreadsheet, spreadsheetReady } = props;
  return !spreadsheetReady ? (
    <form onSubmit={submitSpreadsheet}>
      <input
        type="file"
        accept=".xls,.xlsx,.ods"
        name="spreadsheet"
        multiple="false"
      />
      <button type="submit">Submit Spreadsheet</button>
    </form>
  ) : null;
};

export default SpreadsheetEntry;
