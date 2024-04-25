import React, { useState, useEffect } from 'react';
import WashingMachineDisplay from './washingMachineDisplay/washingMachineDisplay';
import ControlPanel from './controlPanel/controlPanel';
import WashingMachineDoor from './washingMachineDoor';


const WashingMachine = () => {
  const [washingMachineInfo, setWashingMachineInfo] = useState({});
  const [refundAmount, setRefundAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [doorErrorMessage, setDoorErrorMessage] = useState(null);

  const fetchWashingMachineInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1');
      if (response.ok) {
        const data = await response.json();
        setWashingMachineInfo(data.washingMachine);
      } else {
        console.error('Error fetching data from server:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching washing machine info:', error);
    }
  };

  const handleComponentlUpdate = async () => {
    await fetchWashingMachineInfo();
  };

  useEffect(() => {
    // Fetch initial data and updates every 5 second
    fetchWashingMachineInfo();
    const intervalId = setInterval(fetchWashingMachineInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="washingMachine">
      <ControlPanel
        washingMachineInfo={washingMachineInfo}
        onControlPanelUpdate={handleComponentlUpdate}
        setRefundAmount={setRefundAmount}
        setRemainingAmount={setRemainingAmount}
      />
      {doorErrorMessage && <p style={{color:"red"}}>{doorErrorMessage}</p>}
      <WashingMachineDisplay
        washingMachineInfo={washingMachineInfo}
        onDisplayUpdate={handleComponentlUpdate}
        setRefundAmount={setRefundAmount}
        remainingAmount={remainingAmount}
        setRemainingAmount={setRemainingAmount}
        setDoorErrorMessage={setDoorErrorMessage}
      />
      {refundAmount > 0 && (
        <button onClick={() => setRefundAmount(0)}>
          collect refund ${(refundAmount / 100).toFixed(2)}
        </button>
      )}
      <WashingMachineDoor
        washingMachineInfo={washingMachineInfo}
        onDoorUpdate={handleComponentlUpdate}
        setDoorErrorMessage={setDoorErrorMessage}
      />
    </div>
  );
};

export default WashingMachine;