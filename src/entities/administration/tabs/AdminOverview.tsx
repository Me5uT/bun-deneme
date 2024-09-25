import { Descriptions, Space, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { AdminProfileInt, AdminType, AdminTypeInt, IAdminModel } from 'app/shared/model/AdminModel';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const AdminOverview: React.FC = () => {
  const adminDetails: IAdminModel = useAppSelector(state => state.admin.entity);
  const loading: boolean = useAppSelector(state => state.admin.loading);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Display Name',
        span: 3,
        children: <> {`${adminDetails?.firstName} ${adminDetails?.lastName}`}</>,
      },
      {
        label: 'Email',
        span: 3,
        children: adminDetails?.email,
      },
      {
        label: 'Status',
        span: 3,
        children: <Tag color={getColorByType(Boolean, adminDetails?.isActive)}>{adminDetails?.isActive ? 'Active' : 'Passive'}</Tag>,
      },
      {
        label: 'Verification Status',
        span: 3,
        children: (
          <Space>
            <Tag color={getColorByType(VerificationStatusInt, adminDetails?.verificationStatus)}>
              {Object.values(VerificationStatusInt)[adminDetails?.verificationStatus]}
            </Tag>
          </Space>
        ),
      },
      {
        label: 'Admin Type',
        span: 3,
        children: (
          <Tag color={getColorByType(AdminTypeInt, adminDetails?.adminType)}>{Object.values(AdminType)[adminDetails?.adminType]}</Tag>
        ),
      },

      {
        label: 'Admin Profile',
        span: 3,
        children: (
          <Tag color={getColorByType(AdminProfileInt, adminDetails?.adminProfile)}>
            {Object.values(AdminProfileInt)[adminDetails?.adminProfile]}
          </Tag>
        ),
      },
    ],
    [adminDetails]
  );

  if (!adminDetails || loading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" layout="horizontal" bordered items={items} />;
};
