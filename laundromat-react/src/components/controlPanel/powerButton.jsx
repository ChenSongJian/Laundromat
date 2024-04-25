import React from 'react';

const PowerButton = ({ washingMachineInfo, onTogglePower }) => {
  const handlePowerButtonClick = async () => {
    const newState = washingMachineInfo.state === 0 ? 0 : 1;
    await onTogglePower(newState);
  };

  return (
    <button onClick={handlePowerButtonClick}>
      {washingMachineInfo.state === 0 ? 'Power On' : 'Power Off'}
    </button>
  );
};

export default PowerButton;
