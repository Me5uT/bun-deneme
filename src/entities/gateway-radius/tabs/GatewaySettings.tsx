import { Form, FormInstance, Input, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import { InputIPAddressV4 } from 'app/shared/components/InputIPAddressV4';
import { IGateway } from 'app/shared/model/gateway.model';
import { validateIP } from 'app/shared/util/regex';
import React from 'react';

interface IGatewaySettingsProps {
  form: FormInstance<any>;
}
export const GatewaySettings: React.FC<IGatewaySettingsProps> = ({ form }) => {
  const loading = useAppSelector(state => state.gatewayRadius.loading);
  const gateway: IGateway = useAppSelector(state => state.gatewayRadius.entity);

  React.useEffect(() => {
    form.resetFields();
  }, []);

  if (loading || !gateway) {
    return <Spin />;
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
      <Form.Item
        name="samName"
        label={'Sam'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name={'gatewayIp'}
        label="Gateway IP Address"
        rules={[{ required: true }, { validator: validateIP }]}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <InputIPAddressV4 />
      </Form.Item>
      <Form.Item
        name="authenticationPort"
        label={'Authentication Port'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        rules={[{ required: true }]}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name={'accountingPort'}
        rules={[{ required: true }]}
        label={'Accounting Port'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
    </div>
  );
};
