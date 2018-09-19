import React from 'react';
import ReactExport from 'react-data-export';
import Button from '@material-ui/core/Button'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelExport = (props) => {
  const {
    spreadsheetReady,
    listProcessing,
    searchResults,
    searchType
  } = props;

  const firstColumn = searchType;
  const firstColumnValue = `searchedFor`

  return listProcessing || !spreadsheetReady ?
    null
    : <ExcelFile element={
      <Button variant="outlined" size="small">Download Results</Button>
    }>
      <ExcelSheet
        data={searchResults}
        name={`${searchType} Query Results`}
      >
        <ExcelColumn
          label={firstColumn}
          value={firstColumnValue}
        />
        <ExcelColumn
          label="Results"
          value={
            (col) => col.error ? col.error.message : col.data.total}
        />
        <ExcelColumn
          label="Error url"
          value={(col) => col.error ? col.error.url : null}
        />
        <ExcelColumn
          label="Positive Result url"
          value={(col) => col.data && col.data.total > 0 ? col.api : null}
        />
      </ExcelSheet>
    </ExcelFile>
};

export default ExcelExport;
