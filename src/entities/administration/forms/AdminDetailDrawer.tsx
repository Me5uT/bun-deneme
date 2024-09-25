import { Card, Descriptions, Space, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt, AdminType, AdminTypeInt, IAdminModel } from 'app/shared/model/AdminModel';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntity } from '../admin.reducer';
interface IAdminDetailDrawerFormProps {
  uid: string;
}
export const AdminDetailDrawer: React.FC<IAdminDetailDrawerFormProps> = ({ uid }) => {
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const adminDetail: IAdminModel = useAppSelector(state => state.admin.entity);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Display Name',
        span: 3,
        children: <> {`${adminDetail?.firstName} ${adminDetail?.lastName}`}</>,
      },
      {
        label: 'Email',
        span: 3,
        children: adminDetail?.email,
      },
      {
        label: 'Status',
        span: 3,
        children: <Tag color={getColorByType(Boolean, adminDetail?.isActive)}>{adminDetail?.isActive ? 'Active' : 'Passive'}</Tag>,
      },
      {
        label: 'Verification Status',
        span: 3,
        children: (
          <Space>
            <Tag color={getColorByType(VerificationStatusInt, adminDetail?.verificationStatus)}>
              {Object.values(VerificationStatusInt)[adminDetail?.verificationStatus]}
            </Tag>
          </Space>
        ),
      },
      {
        label: 'Admin Type',
        span: 3,
        children: (
          <Tag color={getColorByType(AdminTypeInt, adminDetail?.adminType)}>{Object.values(AdminType)[adminDetail?.adminType]}</Tag>
        ),
      },

      {
        label: 'Admin Profile',
        span: 3,
        children: (
          <Tag color={getColorByType(AdminProfileInt, adminDetail?.adminProfile)}>
            {Object.values(AdminProfileInt)[adminDetail?.adminProfile]}
          </Tag>
        ),
      },
    ],
    [adminDetail]
  );

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ adminId: uid, accountId: baseObj?.accountId }));
    }
  }, [uid]);

  return (
    <Card loading={!adminDetail}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
