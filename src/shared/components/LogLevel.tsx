import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rate } from 'antd';
import React from 'react';
import { getRateColorForSuccess } from '../util/UtilityService';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ILogLevelProps {
  rate: number;
}

const LogLevel: React.FC<ILogLevelProps> = ({ rate }) => {
  return (
    <Rate
      disabled
      value={rate}
      character={({ index }) => (
        <FontAwesomeIcon
          icon={(index + 1).toString() as IconProp}
          color={getRateColorForSuccess(index)}
          style={{ fontSize: 13, margin: '0px -2px' }}
        />
      )}
    />
  );
};

export default React.memo(LogLevel);
