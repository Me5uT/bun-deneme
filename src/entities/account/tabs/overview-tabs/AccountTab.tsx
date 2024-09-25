import { Descriptions, DescriptionsProps, Spin, Tag } from 'antd';
import { useAppSelector } from 'app/config/store';
import { ITenantDetail, TenantStatusInt, TenantTypeInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const AccountTab: React.FC = () => {
  const tenantDetail: ITenantDetail = useAppSelector(state => state.account.entity);
  const loading: boolean = useAppSelector(state => state.account.loading);
  const updateSuccess: boolean = useAppSelector(state => state.account.updateSuccess);

  const itemsForOthers: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        key: '1',
        label: 'Name',
        children: tenantDetail?.tenant?.name,
      },
      {
        key: '2',
        label: 'Alias',
        children: tenantDetail?.tenant?.alias,
      },
      {
        key: '3',
        label: 'Type',
        children: (
          <Tag color={getColorByType(TenantTypeInt, tenantDetail?.tenant?.tenantType)}>
            {`${Object.values(TenantTypeInt)[tenantDetail?.tenant?.tenantType]}`}
          </Tag>
        ),
      },
      {
        key: '4',
        label: 'Status',
        children: (
          <Tag color={getColorByType(TenantStatusInt, tenantDetail?.tenant?.tenantStatus)}>
            {`${Object.values(TenantStatusInt)[tenantDetail?.tenant?.tenantStatus]}`}
          </Tag>
        ),
      },
      {
        key: '5',
        label: 'Remote Support',
        children: (
          <Tag color={getColorByType(Boolean, tenantDetail?.tenant?.isSupportActive)}>
            {`${tenantDetail?.tenant?.isSupportActive ? 'Active' : 'Passive'}`}
          </Tag>
        ),
      },
    ],
    [updateSuccess, tenantDetail]
  );
  const itemsForEndUsers: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        key: '11',
        label: 'Name',
        children: tenantDetail?.tenant?.name,
      },
      {
        key: '12',
        label: 'Alias',
        children: tenantDetail?.tenant?.alias,
      },
      {
        key: '13',
        label: 'Type',
        children: (
          <Tag color={getColorByType(TenantTypeInt, tenantDetail?.tenant?.tenantType)}>
            {`${Object.values(TenantTypeInt)[tenantDetail?.tenant?.tenantType]}`}
          </Tag>
        ),
      },
      {
        key: '16',
        label: 'Partner',
        children: tenantDetail?.tenant?.partnerName,
      },
      {
        key: '14',
        label: 'Status',
        children: (
          <Tag color={getColorByType(TenantStatusInt, tenantDetail?.tenant?.tenantStatus)}>
            {`${Object.values(TenantStatusInt)[tenantDetail?.tenant?.tenantStatus]}`}
          </Tag>
        ),
      },
      {
        key: '15',
        label: 'Remote Support',
        children: (
          <Tag color={getColorByType(Boolean, tenantDetail?.tenant?.isSupportActive)}>
            {`${tenantDetail?.tenant?.isSupportActive ? 'Active' : 'Passive'}`}
          </Tag>
        ),
      },
    ],
    [updateSuccess, tenantDetail]
  );

  if (!tenantDetail || loading) {
    return <Spin />;
  }

  return (
    <Descriptions
      className="my-descriptions"
      bordered
      items={tenantDetail?.tenant?.tenantType === TenantTypeInt.ENDUSER ? itemsForEndUsers : itemsForOthers}
      column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
    />
  );
};
