import { Descriptions, DescriptionsProps, Tag } from 'antd';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { RadiusStatus } from 'app/shared/model/LoggingModel';
import { formatDate } from 'app/shared/util/date-utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
interface DescriptionItemProps {
  logDetail: any;
}
export const LogDetailForm: React.FC<DescriptionItemProps> = ({ logDetail }) => {
  const items: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Time',
        children: <div>{formatDate(logDetail?.createdDate, APP_DATE_FORMAT)}</div>,
      },
      {
        label: 'Username',
        children: logDetail?.username,
      },
      {
        label: 'Sam Name ',
        children: logDetail?.samname,
      },
      {
        label: 'ENDUSER IP',
        children: logDetail?.sourceip,
      },
      {
        label: 'Souce Country',
        children: logDetail?.sourceCountryDescription,
      },
      {
        label: 'Radius Gateway',
        children: logDetail?.radiusGatewayName,
      },
      {
        label: 'Radius Client Ip',
        children: logDetail?.radiusClientIp,
      },
      {
        label: 'Rule Name',
        children: logDetail?.ruleName,
      },
      {
        label: 'Message ',
        children: logDetail?.message,
      },
      {
        label: 'Authenticaiton Result',

        children: (
          <Tag color={getColorByType(RadiusStatus, logDetail?.authenticationResult)}>
            {Object.values(RadiusStatus)[logDetail?.authenticationResult]}
          </Tag>
        ),
      },
      {
        label: 'First Authenticaiton Result',
        children: (
          <Tag color={getColorByType(RadiusStatus, logDetail?.firstAuthenticationResult)}>
            {Object.values(RadiusStatus)[logDetail?.firstAuthenticationResult]}
          </Tag>
        ),
      },
      {
        label: 'Second Authentication Result',
        children: (
          <Tag color={getColorByType(RadiusStatus, logDetail?.secondAuthenticationResult)}>
            {Object.values(RadiusStatus)[logDetail?.secondAuthenticationResult]}
          </Tag>
        ),
      },
      {
        label: 'Authenticaiton Method',
        children: logDetail?.providerDescription,
      },
    ],
    [logDetail]
  );

  return <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />;
};
