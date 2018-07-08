import React from "react";

const SpreadsheetEntry = props => {
  const { submitSpreadsheet } = props;
  return (
    <form onSubmit={submitSpreadsheet}>
      <input
        type="file"
        accept=".xls,.xlsx,.ods"
        name="spreadsheet"
        multiple="false"
      />
      <button type="submit">Submit Spreadsheet</button>
    </form>
  );
};

export default SpreadsheetEntry;
