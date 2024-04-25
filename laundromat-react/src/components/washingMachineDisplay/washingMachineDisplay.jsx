import React, { useState, useEffect, useRef } from 'react';
import PowerOffState from './powerOffState';
import IdleState from './IdleState';
import WashTypeSelectedState from './washTypeSelectedState';
import PendingStartState from './pendingStartState';
import WashingInProgressState from './washingInProgressState';
import PendingContinueState from './pendingContinueState';
import MaintenanceState from './MaintenanceState';

const WashingMachineDisplay = (
  {
    washingMachineInfo, 
    onDisplayUpdate, 
    setRefundAmount, 
    remainingAmount, 
    setRemainingAmount,
    setDoorErrorMessage
  }
) => {
  const [washTypes, setWashTypes] = useState([]);
  const [totalEarningCent, setTotalEarningCent] = useState(0);
  const [totalDurationSecond, setTotalDurationSecond] = useState(0);
  const timeoutRef = useRef(null);

  const fetchWashTypes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/wash_types');
      if (response.ok) {
        const data = await response.json();
        setWashTypes(data);
      } else {
        console.error('Error fetching wash types:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching wash types:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/statistics');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTotalDurationSecond(data.total_duration_second);
        setTotalEarningCent(data.total_earning_cent);
        console.log(totalEarningCent);
        console.log(totalDurationSecond);
      } else {
        console.error('Error fetching statistics:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchWashTypes();
    fetchStatistics();
  }, []);

  const handleWashTypeButtonClick = async (value) => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/select_wash_type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wash_type: value }),
      });
      if (response.ok) {
        const data = await response.json();
        setRemainingAmount(data.remaining_value_cent);
        await onDisplayUpdate();
      } else {
        console.error('Error selecting wash type:', response.statusText);
      }
    } catch (error) {
      console.error('Error selecting wash type:', error);
    }
  };

  const handleStartButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/start_wash', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json()
        setRefundAmount(data.refund_value_cent);
        await onDisplayUpdate();
      } else {
        console.error('Error start wash:', response.statusText);
        const data = await response.json()
        setDoorErrorMessage(data.message);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setDoorErrorMessage(null), 10000);
      }
    } catch (error) {
      console.error('Error start wash:', error);
    }
  };

  const handleCancelButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/cancel_wash', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setRefundAmount(data.refund_value_cent);
        await onDisplayUpdate();
      } else {
        console.error('Error cancel wash:', response.statusText);
      }
    } catch (error) {
      console.error('Error cancel wash:', error);
    }
  };

  const handleContinueButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/continue_wash', {
        method: 'POST'
      });
      if (response.ok) {
        await onDisplayUpdate();
      } else {
        console.error('Error continue wash:', response.statusText);
      }
    } catch (error) {
      console.error('Error continue wash:', error);
    }
  };

  const handleEnterMaintenanceButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/enter_maintenance_mode', {
        method: 'POST'
      });
      if (response.ok) {
        await fetchStatistics();
        await onDisplayUpdate();
      } else {
        console.error('Error enter maintenance mode:', response.statusText);
      }
    } catch (error) {
      console.error('Error enter maintenance mode:', error);
    }
  };

  const handleExitMaintenanceButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/exit_maintenance_mode', {
        method: 'POST'
      });
      if (response.ok) {
        await onDisplayUpdate();
      } else {
        console.error('Error exit maintenance mode:', response.statusText);
      }
    } catch (error) {
      console.error('Error exit maintenance mode:', error);
    }
  };

  const handleResetStatisticsButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/reset_statistics', {
        method: 'POST'
      });
      if (response.ok) {
        await fetchStatistics();
        await onDisplayUpdate();
      } else {
        console.error('Error reset statistics:', response.statusText);
      }
    } catch (error) {
      console.error('Error reset statistics:', error);
    }
  };

  const getStateDisplay = () => {
    switch (washingMachineInfo.state) {
      case 0:
        return <PowerOffState />;
      case 1:
        return (
          <IdleState 
            washTypes={washTypes}
            handleWashTypeButtonClick={handleWashTypeButtonClick}
            handleEnterMaintenanceButtonClick={handleEnterMaintenanceButtonClick}
          />
        );
      case 2:
        return (
          <WashTypeSelectedState
            washingMachineInfo={washingMachineInfo}
            remainingAmount={remainingAmount}
            handleCancelButtonClick={handleCancelButtonClick}
          />
        );
      case 3:
        return (
          <PendingStartState
            washingMachineInfo={washingMachineInfo}
            handleStartButtonClick={handleStartButtonClick}
            handleCancelButtonClick={handleCancelButtonClick}
          />
        );
      case 4:
        return (
          <WashingInProgressState
            washingMachineInfo={washingMachineInfo}
          />
        );
      case 5:
        return (
          <MaintenanceState 
            totalDurationSecond={totalDurationSecond}
            totalEarningCent={totalEarningCent}
            handleResetStatisticsButtonClick={handleResetStatisticsButtonClick}
            handleExitMaintenanceButtonClick={handleExitMaintenanceButtonClick}
          />
        );
      case 6:
        return (
          <PendingContinueState 
            washingMachineInfo={washingMachineInfo}
            handleContinueButtonClick={handleContinueButtonClick}
            handleCancelButtonClick={handleCancelButtonClick}
          />
        );
      default:
        return <p>Loading...</p>;
    }
    
  }
  return (
    <div>
      <h1>Washing Machine Display</h1>
      {getStateDisplay()}
    </div>
  );
};

export default WashingMachineDisplay;
