import React from 'react';

const PendingContinueState = ({ washingMachineInfo, handleContinueButtonClick, handleCancelButtonClick }) => {
  const remainingTime = washingMachineInfo.currentJobRemainingTimeSecond;
  const jobTime = washingMachineInfo.currentJobTotalTimeSecond;
  const percentage = (remainingTime * 100 / jobTime).toFixed(2);
  const remainingMinutes = Math.floor(remainingTime / 60);
  const remainingSeconds = remainingTime % 60;
  return (
    <div>
      <h2>Wash type selected: {washingMachineInfo.currentJobName}</h2>
      <h2>Remaining Percentage: {percentage}%</h2>
      <h2>Remaining time (updated every 5 seconds): {remainingMinutes} minute(s) {remainingSeconds} second(s)</h2>      
      <button onClick={() => handleContinueButtonClick()}>Continue wash</button>
      <button onClick={() => handleCancelButtonClick()}>Cancel wash</button>
    </div>
  );
};

export default PendingContinueState;