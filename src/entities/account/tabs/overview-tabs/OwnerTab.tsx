import { Descriptions, DescriptionsProps, Spin, Tag } from 'antd';
import { useAppSelector } from 'app/config/store';
import { ITenantDetail, VerificationStatusInt } from 'app/shared/model/tenant.model';
import { formatDate } from 'app/shared/util/date-utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const OwnerTab: React.FC = () => {
  const tenantDetail: ITenantDetail = useAppSelector(state => state.account.entity);
  const updateSuccess: boolean = useAppSelector(state => state.account.updateSuccess);
  const loading: boolean = useAppSelector(state => state.account.loading);

  const items: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Status',
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
    ],
    [updateSuccess, tenantDetail]
  );

  if (!tenantDetail || loading) {
    return <Spin fullscreen />;
  }

  return <Descriptions className="my-descriptions" bordered items={items} column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} />;
};
