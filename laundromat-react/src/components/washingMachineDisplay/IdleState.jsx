import React from 'react';

const IdleState = ({ washTypes, handleWashTypeButtonClick, handleEnterMaintenanceButtonClick }) => {
  return (
    <div>
      <button onClick={() => handleEnterMaintenanceButtonClick()}>Enter Maintenance Mode</button>
      <br></br>
      {washTypes.map((washType) => (
        <button key={washType.value} onClick={() => handleWashTypeButtonClick(washType.type)}>
          {washType.type}: ${(washType.priceCent / 100).toFixed(2)} {washType.durationSecond / 60} minutes
        </button>
      ))}
    </div>
  );
};

export default IdleState;