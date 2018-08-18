import React from 'react';

const LoadingDisplay = (props) => {
  const {
    entriesProcessed,
    spreadsheetEntries
   } = props;

   const listProcessing = entriesProcessed < spreadsheetEntries

  return listProcessing ?
    <div className="loading-container">
      <h1>Loading results</h1>
    </div>
    : null
}

export default LoadingDisplay;
