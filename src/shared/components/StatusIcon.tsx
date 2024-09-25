import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { StatusInt, VerificationStatusInt } from '../model/tenant.model';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { GatewayStatusInt } from '../model/gateway.model';

interface IStatusIconProps {
  status: boolean | StatusInt | VerificationStatusInt | GatewayStatusInt;
  size?: SizeProp;
}

export const StatusIcon: React.FC<IStatusIconProps> = ({ status, size }) => {
  switch (status) {
    case true:
    case VerificationStatusInt.Verified:
    case GatewayStatusInt.Active:
    case StatusInt.Active:
      return <FontAwesomeIcon size={size} icon={'circle-check'} style={{ color: 'green', marginRight: '10px' }} />;

    case VerificationStatusInt.Pending:
    case GatewayStatusInt.Passive:
    case StatusInt.Pending:
      return <FontAwesomeIcon size={size} icon={'hourglass-end'} style={{ color: 'darkorange', marginRight: '10px' }} />;

    case false:
    case StatusInt.Passive:
    case GatewayStatusInt.Offline:
      return <FontAwesomeIcon size={size} icon={'xmark-circle'} style={{ color: 'red', marginRight: '10px' }} />;

    default:
      return null;
  }
};
