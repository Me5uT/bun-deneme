import { Descriptions, DescriptionsProps, Spin, Tag } from 'antd';
import { useAppSelector } from 'app/config/store';
import { ITenantDetail, LicenceStatusInt, LicenceType, LicenceTypeInt, StatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import { formatDate } from 'app/shared/util/date-utils';
import React from 'react';

export const LicenseTab: React.FC = () => {
  const tenantDetail: ITenantDetail = useAppSelector(state => state.account.entity);
  const updateSuccess: boolean = useAppSelector(state => state.account.updateSuccess);
  const loading: boolean = useAppSelector(state => state.account.loading);

  const items: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        label: 'License Type',
        children: (
          <Tag color={getColorByType(LicenceTypeInt, tenantDetail?.licenceHistory?.licenceType)}>
            {`${Object.values(LicenceType)[tenantDetail?.licenceHistory?.licenceType]}`}
          </Tag>
        ),
      },
      {
        label: 'Licence Status',
        children: (
          <Tag color={getColorByType(LicenceStatusInt, tenantDetail?.licenceHistory?.licenceStatus)}>
            {`${Object.values(LicenceStatusInt)[tenantDetail?.licenceHistory?.licenceStatus]}`}
          </Tag>
        ),
      },
      {
        label: 'Licence Expire Date',
        children: formatDate(tenantDetail?.licenceHistory?.expireDate),
      },
      {
        label: 'Licence Count',
        children: tenantDetail?.licenceHistory?.totalUser,
      },
      {
        label: 'Current User',
        children: tenantDetail?.licenceHistory?.usedTotalUser,
      },
      {
        label: 'Mentis',
        children: (
          <Tag color={getColorByType(Boolean, tenantDetail?.tenant?.mentis)}>
            {`${tenantDetail?.tenant?.mentis ? 'Active' : 'Passive'}`}
          </Tag>
        ),
      },
    ],
    [updateSuccess, tenantDetail]
  );

  if (!tenantDetail || loading) {
    return <Spin fullscreen />;
  }

  return <Descriptions bordered className="my-descriptions" items={items} column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} />;
};
