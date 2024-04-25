import React from 'react';

const WashTypeSelectedState = ({ washingMachineInfo, remainingAmount, handleCancelButtonClick }) => {
  return (
    <div>
      <h2>Wash type selected: {washingMachineInfo.currentJobName}</h2>
      <h2>Insufficient fund, need ${(remainingAmount / 100).toFixed(2)} more</h2>
      <button onClick={handleCancelButtonClick}>Cancel wash</button>
    </div>
  );
};

export default WashTypeSelectedState;