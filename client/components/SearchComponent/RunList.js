import React from 'react';

const RunList = (props) => {

  const {
    loading,
    spreadsheetReady,
    runNextBatch
  } = props;

  return !loading && spreadsheetReady ?
    <div
      className="run-list"
      onClick={runNextBatch}
    />
    : null
}

export default RunList;
