import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import React from 'react';

const OrientationAlert = () => {
  return (
    <div className="orientation-alert">
      <div className="orientation-alert-inner">
        <FontAwesomeIcon fade={true} color={'red'} fontSize={'35px'} icon="triangle-exclamation" />
        <Space direction="vertical">
          <div>The app does not support this device width!</div>
          <div>You can try turning your device sideways for a better visual experience.</div>
        </Space>
      </div>
    </div>
  );
};

export default React.memo(OrientationAlert);
