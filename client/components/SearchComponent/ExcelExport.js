import React from 'react';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelExport = (props) => {
  const { searchResults, searchType } = props;
  const results = searchResults;
  const searchTerm = searchType;
  const firstColumn = searchType;
  let lowerCaseType = searchType.slice(0,1)
  .toLowerCase()
  .concat(searchType.slice(1, searchType.length))
  const firstColumnValue = `${lowerCaseType}Searched`

  return (
    <ExcelFile>
      <ExcelSheet data={results} name={` Query Results`}>
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
