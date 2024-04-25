import React from 'react';

const CoinButton = ({ coinType, disabled, onClick }) => {
    return (
      <button disabled={disabled} onClick={onClick}>
        Insert {coinType.label}
      </button>
    );
  };

  export default CoinButton;
