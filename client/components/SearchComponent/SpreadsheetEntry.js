import React from "react";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

const SpreadsheetEntry = props => {
  const {
    submitSpreadsheet,
    spreadsheetReady,
    fileAdded,
    spreadsheetUploaded
  } = props;

  return !spreadsheetReady ? (
    <form onSubmit={submitSpreadsheet} encType="multipart/form-data" name="spreadsheet-input">
      <Input
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        name="spreadsheet"
        multiple="false"
        id="spreadsheet"
        onChange={fileAdded}
      />
      <br />
      <Button
        variant="outlined"
        size="small"
        color="primary"
        type="submit"
        id="btn--submit"
        disabled={!spreadsheetUploaded}
      >Submit & Run
      </Button>
    </form>
  ) : null;
};

export default SpreadsheetEntry;
