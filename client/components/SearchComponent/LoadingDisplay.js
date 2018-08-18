import React from 'react';

const LoadingDisplay = (props) => {
  const {
    keywordsProessed,
    spreadsheetEntries
   } = props;

  return keywordsProessed < spreadsheetEntries ?
    <div className="loading-container">
      <h1>Loading results</h1>
    </div>
    : null
}

export default LoadingDisplay;
