import { Descriptions, DescriptionsProps } from 'antd';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { IAuditLogModel, LogLevel } from 'app/shared/model/LoggingModel';
import { formatDate } from 'app/shared/util/date-utils';
import { getBrowserInfo, serializeLogObject } from 'app/shared/util/LogMessage';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
interface DescriptionItemProps {
  logDetail: IAuditLogModel;
}
export const LogDetailForm: React.FC<DescriptionItemProps> = ({ logDetail }) => {
  const items: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Log Level',
        children: (
          <div
            style={{
              color: getColorByType(LogLevel, logDetail?.level),
            }}
          >
            {Object.values(LogLevel)[logDetail?.level]}
          </div>
        ),
      },
      {
        label: 'Log Type',
        children: logDetail?.logtype,
      },
      {
        label: 'User',
        children: logDetail?.user,
      },
      {
        label: 'Object',
        children: serializeLogObject(logDetail?.displayParams, logDetail?.apiname) || '',
      },

      {
        label: 'Message',
        children: logDetail?.message,
      },
      {
        label: 'Date',
        children: <div>{formatDate(logDetail?.createdDate, APP_DATE_FORMAT)}</div>,
      },
      {
        label: 'ENDUSER IP',
        children: logDetail?.sourceip,
      },
      {
        label: 'Response HTTP Status',
        children: logDetail?.responseStatus,
      },
      {
        label: 'Browser',
        children: getBrowserInfo(logDetail?.browserheader),
      },
    ],
    [logDetail]
  );

  if (!logDetail.uid) return <div />;

  return <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />;
};
