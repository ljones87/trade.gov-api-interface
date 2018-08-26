import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const LoadingDisplay = (props) => {
  const {
    spreadsheetEntries,
    entriesProcessed,
    listProcessing,
    timeRemaining,
  } = props;

  const value = (entriesProcessed / spreadsheetEntries) * 100;
  //
  return listProcessing ? (
    <div>
      <h3 className="heading--processing">
        {`Processed: ${entriesProcessed} out of: ${spreadsheetEntries}`}
      </h3>
      <br />
      <LinearProgress
        variant="determinate"
        value={value}
      />
      <br />
      <h5>Est. time remaining:</h5>
      <h5>{`${timeRemaining}`}</h5>
    </div>

  ) : null
}

export default LoadingDisplay;
