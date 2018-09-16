import React from "react";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

const SpreadsheetEntry = props => {
  const { submitSpreadsheet, spreadsheetReady } = props;
  return !spreadsheetReady ? (
    <form onSubmit={submitSpreadsheet} method="post" encType="multipart/form-data">
      <Input
        type="file"
        accept=".xls,.xlsx,.ods"
        name="spreadsheet"
        multiple="false"
        id="spreadsheet"
      />
      <br />
      <Button
        variant="outlined"
        size="small"
        color="primary"
        type="submit"
        id="btn--submit"
      >Submit & Run
      </Button>
    </form>
  ) : null;
};

export default SpreadsheetEntry;
