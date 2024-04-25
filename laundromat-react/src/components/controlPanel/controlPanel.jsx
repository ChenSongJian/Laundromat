import React, { useState, useEffect } from 'react';
import CoinButton from './coinButton';
import PowerButton from './powerButton';

const ControlPanel = ({ washingMachineInfo, onControlPanelUpdate, setRefundAmount, setRemainingAmount }) => {
  const [coinTypes, setcoinTypes] = useState([]);

  const fetchCoinTypes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/coin_types');
      if (response.ok) {
        const data = await response.json();
        setcoinTypes(data);
      } else {
        console.error('Error fetching coin types:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching coin types:', error);
    }
  };

  useEffect(() => {
    fetchCoinTypes();
  }, []);

  const handleCoinButtonClick = async (value) => {
    try {
      const response = await fetch('http://localhost:8080/api/washing_machine/1/insert_coin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin_value_cent: value }),
      });
      if (response.ok) {
        const data = await response.json();
        setRemainingAmount(data.remaining_value_cent);
        await onControlPanelUpdate();
      } else {
        console.error('Error inserting coin:', response.statusText);
      }
    } catch (error) {
      console.error('Error inserting coin:', error);
    }
  };

  const handleTogglePower = async (newState) => {
    try {
      const response = await fetch(`http://localhost:8080/api/washing_machine/1/power_${newState === 0 ? 'on' : 'off'}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setRefundAmount(data.refund_value_cent);
        setRemainingAmount(0);
        await onControlPanelUpdate();
      } else {
        console.error('Error toggling power:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling power:', error);
    }
  };

  return (
    <div className="control-panel">
      <h2>Control Panel</h2>
      <PowerButton washingMachineInfo={washingMachineInfo} onTogglePower={handleTogglePower} />
      <br></br>
      {coinTypes.length > 0 && (
        coinTypes.map((coinType) => (
          <CoinButton
            key={coinType.value}
            coinType={coinType}
            disabled={washingMachineInfo.state !== 2}
            onClick={() => handleCoinButtonClick(coinType.value)}
          />
        ))
      )}
    </div>
  );
};

export default ControlPanel;
