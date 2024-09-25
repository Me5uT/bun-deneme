import { Input } from 'antd';
import React from 'react';

export const IpInput = props => {
  // Nokta ve sayı harici karakterlerin girişini engelleyen fonksiyon
  const handleKeyPress = event => {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode < 48 || charCode > 57) && // Rakamlar
      charCode !== 46 // Nokta
    ) {
      event.preventDefault();
    }
  };

  return <Input value={props.value} onChange={props.onChange} placeholder="Enter IP address" onKeyPress={handleKeyPress} />;
};
