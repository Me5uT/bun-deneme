import React from 'react';

export const Loader = () => {
  return (
    <div className="app-loading" style={{ margin: '40vh auto auto auto', height: '250px', width: '250px' }}>
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
