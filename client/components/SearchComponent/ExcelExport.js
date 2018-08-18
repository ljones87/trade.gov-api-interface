import React from 'react';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelExport = (props) => {
  const { keywordResults, addressResults } = props;
  let results, searchTerm, firstColumn, firstColumnValue
  if(keywordResults) {
    results = keywordResults
    searchTerm = "Keyword"
    firstColumn = "Keyword"
    firstColumnValue = "keywordSearched"
  } else if(addressResults) {
    results = addressResults
    searchTerm = "Address"
    firstColumn = "Address"
    firstColumnValue = "addressSearched"
  }

  return (
    <ExcelFile>
      <ExcelSheet data={results} name={`${searchTerm} Query Results`}>
        <ExcelColumn label={firstColumn} value={firstColumnValue} />
        <ExcelColumn
          label="Query result"
          value={
            (col) => col.error ? col.error.message : col.data.total
          }
        />
        <ExcelColumn
          label="Error url"
          value={(col) => col.error ? col.error.url : null}
        />

        <ExcelColumn label="Results Api" value={(col) => col.data && col.data.total > 0 ? col.api : null} />
      </ExcelSheet>
    </ExcelFile>
  );
};

export default ExcelExport;
