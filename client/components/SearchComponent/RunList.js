import React from 'react';

const RunList = (props) => {

  const {
    loading,
    spreadsheetReady,
    loadResults,
    entriesProcessed
  } = props;
  const show = !loading && spreadsheetReady

  return show ?
    <div
      className="run-list"
      onClick={() => loadResults(entriesProcessed)}
    />
    : null
}

export default RunList;
