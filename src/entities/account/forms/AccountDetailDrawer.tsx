import { Card, Descriptions, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  ITenantDetail,
  LicenceStatusInt,
  LicenceType,
  LicenceTypeInt,
  TenantStatusInt,
  TenantTypeInt,
  VerificationStatusInt,
} from 'app/shared/model/tenant.model';
import { formatDate } from 'app/shared/util/date-utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntity } from '../account.reducer';

interface IAccountDetailDrawerProps {
  uid: string;
}
export const AccountDetailDrawer: React.FC<IAccountDetailDrawerProps> = ({ uid }) => {
  const dispatch = useAppDispatch();

  const tenantDetail: ITenantDetail = useAppSelector(state => state.account.entity);

  const withPartneritems: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Name',
        children: tenantDetail?.tenant?.name,
      },
      {
        label: 'Alias',
        children: tenantDetail?.tenant?.alias,
      },
      {
        label: 'Partner',
        children: tenantDetail?.tenant?.partnerName,
        span: 0,
      },
      {
        label: 'Parent Account',
        children: tenantDetail?.tenant?.parentName,
        span: 0,
      },
      {
        label: 'Type',
        children: (
          <Tag color={getColorByType(TenantTypeInt, tenantDetail?.tenant?.tenantType)}>
            {`${Object.values(TenantTypeInt)[tenantDetail?.tenant?.tenantType]}`}
          </Tag>
        ),
      },
      {
        label: 'Account Status',
        children: (
          <Tag color={getColorByType(TenantStatusInt, tenantDetail?.tenant?.tenantStatus)}>
            {`${Object.values(TenantStatusInt)[tenantDetail?.tenant?.tenantStatus]}`}
          </Tag>
        ),
      },
      {
        label: 'Remote Support',
        children: (
          <Tag color={getColorByType(Boolean, tenantDetail?.tenant?.isSupportActive)}>
            {`${tenantDetail?.tenant?.isSupportActive ? 'Active' : 'Passive'}`}
          </Tag>
        ),
      },
      {
        label: 'Verification Status',
        children: (
          <Tag color={getColorByType(VerificationStatusInt, tenantDetail?.ownerAdmin?.verificationStatus)}>
            {`${Object.values(VerificationStatusInt)[tenantDetail?.ownerAdmin?.verificationStatus]}`}
          </Tag>
        ),
      },
      {
        label: 'Mail',
        children: tenantDetail?.ownerAdmin?.email,
      },
      // {
      //   label: 'Last Login IP',
      //   children: tenantDetail?.ownerAdmin?.lastLoginIp,
      // },
      // {
      //   label: 'Last Password Change',
      //   children: formatDate(tenantDetail?.ownerAdmin?.changePasswordDate),
      // },
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
    [tenantDetail]
  );
  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Name',
        children: tenantDetail?.tenant?.name,
      },
      {
        label: 'Alias',
        children: tenantDetail?.tenant?.alias,
      },
      {
        label: 'Parent Account',
        children: tenantDetail?.tenant?.parentName,
        span: 0,
      },
      {
        label: 'Type',
        children: (
          <Tag color={getColorByType(TenantTypeInt, tenantDetail?.tenant?.tenantType)}>
            {`${Object.values(TenantTypeInt)[tenantDetail?.tenant?.tenantType]}`}
          </Tag>
        ),
      },
      {
        label: 'Account Status',
        children: (
          <Tag color={getColorByType(TenantStatusInt, tenantDetail?.tenant?.tenantStatus)}>
            {`${Object.values(TenantStatusInt)[tenantDetail?.tenant?.tenantStatus]}`}
          </Tag>
        ),
      },
      {
        label: 'Remote Support',
        children: (
          <Tag color={getColorByType(Boolean, tenantDetail?.tenant?.isSupportActive)}>
            {`${tenantDetail?.tenant?.isSupportActive ? 'Active' : 'Passive'}`}
          </Tag>
        ),
      },
      {
        label: 'Verification Status',
        children: (
          <Tag color={getColorByType(VerificationStatusInt, tenantDetail?.ownerAdmin?.verificationStatus)}>
            {`${Object.values(VerificationStatusInt)[tenantDetail?.ownerAdmin?.verificationStatus]}`}
          </Tag>
        ),
      },
      {
        label: 'Mail',
        children: tenantDetail?.ownerAdmin?.email,
      },

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
    [tenantDetail]
  );
  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity(uid));
    }
  }, [uid]);

  return (
    <Card loading={!tenantDetail}>
      <Descriptions
        className="my-descriptions"
        column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
        items={tenantDetail?.tenant?.partnerName ? withPartneritems : items}
      />
    </Card>
  );
};
