import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, FormInstance, Input, Spin, Switch } from 'antd';
import { useAppSelector } from 'app/config/store';
import { IGateway } from 'app/shared/model/gateway.model';
import React from 'react';

interface IGatewaySettingsProps {
  form: FormInstance<any>;
}
export const GatewaySettings: React.FC<IGatewaySettingsProps> = ({ form }) => {
  const loading = useAppSelector(state => state.gatewayLdap.loading);
  const gateway: IGateway = useAppSelector(state => state.gatewayLdap.entity);

  React.useEffect(() => {
    form.resetFields();
  }, []);

  if (loading || !gateway) {
    return <Spin spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '20px' }}>
      <Form.Item
        name="name"
        label={'Name'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="description" label={'Description'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>

      {/* <Form.Item name={'isLdapSecure'} label={'LDAP Secure'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} loading={loading} />
      </Form.Item> */}
    </div>
  );
};
