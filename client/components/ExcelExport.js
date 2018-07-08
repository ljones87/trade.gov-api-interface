import React from 'react';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExcelExport = (props) => {
  const { companyResults } = props;

  return (
    <ExcelFile>
      <ExcelSheet data={companyResults} name="Company Name Results">
        <ExcelColumn label="Name" value="company" />
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
