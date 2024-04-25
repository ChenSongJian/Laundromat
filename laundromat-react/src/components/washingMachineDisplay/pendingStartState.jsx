import React from 'react';

const PendingStartState = ({ washingMachineInfo, handleStartButtonClick, handleCancelButtonClick }) => {
  return (
    <div>
      <h2>Wash type selected: {washingMachineInfo.currentJobName}</h2>
      <p>Wash time: {washingMachineInfo.currentJobTotalTimeSecond / 60} minutes</p>
      <button onClick={() => handleStartButtonClick()}>Start wash</button>
      <button onClick={() => handleCancelButtonClick()}>Cancel wash</button>
    </div>
  );
};

export default PendingStartState;