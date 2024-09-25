import { useAppSelector } from 'app/config/store';
import React from 'react';
import { Button, Input } from 'antd';

const { TextArea } = Input;
export const ConfigModal = () => {
  const radiusConfigSTR = useAppSelector(state => state.gatewayRadius.radiusConfigSTR);
  console.log('🚀 ~ ConfigModal ~ radiusConfigSTR:', radiusConfigSTR);

  return (
    <div>
      <TextArea readOnly rows={15} value={radiusConfigSTR} />
    </div>
  );
};
