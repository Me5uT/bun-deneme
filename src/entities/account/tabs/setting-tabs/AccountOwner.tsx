import { Form, FormInstance, Input, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import { ITenantDetail } from 'app/shared/model/tenant.model';
import React from 'react';
interface IAccountOwnerProps {
  form: FormInstance<any>;
}
export const AccountOwner: React.FC<IAccountOwnerProps> = ({ form }) => {
  const tenant: ITenantDetail = useAppSelector(state => state.account.entity);
  const loading = useAppSelector(state => state.account.loading);

  React.useEffect(() => {
    form.resetFields();
  }, [tenant]);

  if (loading || !tenant) {
    return <Spin fullscreen spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', marginBottom: '20px' }}>
      <Form.Item
        name="mail"
        label={'Account Owner'}
        labelCol={{ xl: 4, lg: 5, md: 6, sm: 9, xs: 9 }}
        wrapperCol={{ xl: 6, lg: 7, md: 9, sm: 15, xs: 15 }}
      >
        <Input placeholder="Account Owner" style={{ width: '100%' }} />
      </Form.Item>
    </div>
  );
};
