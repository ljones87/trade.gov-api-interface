import React from 'react';

const LoadingDisplay = (props) => {
  const {
    listProcessing
   } = props;


  return listProcessing ?
    <div className="loading-container">
      <h1>Loading results</h1>
    </div>
    : null
}

export default LoadingDisplay;
