import { Form, FormInstance, Input, Select, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfile, AdminProfileInt, AdminType, AdminTypeInt, IAdminModel } from 'app/shared/model/AdminModel';
import { TenantTypeInt, VerificationStatusInt } from 'app/shared/model/tenant.model';
import React from 'react';
import { useParams } from 'react-router-dom';

interface IAdminSettingsProps {
  form: FormInstance<any>;
}
export const AdminSettings: React.FC<IAdminSettingsProps> = ({ form }) => {
  const [baseObj] = useMirketPortal();
  const loading: boolean = useAppSelector(state => state.admin.loading);
  const admin: IAdminModel = useAppSelector(state => state.admin.entity);
  const { id } = useParams<'id'>();

  const canNotOwner =
    admin?.verificationStatus !== VerificationStatusInt.Verified ||
    baseObj?.tenantType === TenantTypeInt.ENDUSER ||
    baseObj?.adminType !== AdminTypeInt.OWNER;

  React.useEffect(() => {
    form.resetFields();
  }, [admin]);

  if (loading || !admin) {
    return <Spin spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '20px' }}>
      <Form.Item name="firstName" label={'First Name'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="lastName" label={'Last Name'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>

      {baseObj?.adminType === AdminTypeInt.OWNER && baseObj?.ownerAdminId !== id && baseObj?.tenantType !== TenantTypeInt.ENDUSER && (
        <Form.Item name="adminType" label={'Admin Type'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
          <Select
            options={[
              { value: AdminTypeInt.MASTER_ADMIN, label: AdminType.MASTER_ADMIN },
              { value: AdminTypeInt.ACCOUNT_ADMIN, label: AdminType.ACCOUNT_ADMIN },
            ]}
          />
        </Form.Item>
      )}
      {baseObj?.adminType === AdminTypeInt.OWNER && baseObj?.ownerAdminId !== id && (
        <Form.Item name="adminProfile" label={'Admin Profile'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
          <Select
            options={[
              { value: AdminProfileInt.FullControl, label: AdminProfile.FullControl },
              { value: AdminProfileInt.ReadOnly, label: AdminProfile.ReadOnly },
            ]}
          />
        </Form.Item>
      )}
    </div>
  );
};
