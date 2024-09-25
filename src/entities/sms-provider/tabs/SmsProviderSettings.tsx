import { Form, FormInstance, Input, Select, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import { providerList, splittedDefaultProviderList } from 'app/shared/mockdata/ProviderList';
import React from 'react';

interface ISmsProviderSettingsProps {
  form: FormInstance<any>;
}
export const SmsProviderSettings: React.FC<ISmsProviderSettingsProps> = ({ form }) => {
  const smsProvider = useAppSelector(state => state.smsProvider.entity);
  const loading = useAppSelector(state => state.smsProvider.loading);

  const onFocus = (e: any) => {
    (e.target as HTMLTextAreaElement).removeAttribute('readonly');
  };

  React.useEffect(() => {
    form.resetFields();
  }, [smsProvider]);

  if (loading || !smsProvider) {
    return <Spin spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item
        name="provider"
        label={'Provider Method'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Select allowClear options={splittedDefaultProviderList} />
      </Form.Item>
      <Form.Item
        name="name"
        label={'Name'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="originator" label={'Company Name'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="description" label={'Description'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="username" label={'Username'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input readOnly onFocus={onFocus} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="password" label={'Password'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input.Password autoComplete="off" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="message" label={'Message'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="companySignature" label={'Signature'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="userCode" label={'User Code'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input autoComplete="off" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="accountCode" label={'Account Code'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input autoComplete="off" style={{ width: '100%' }} />
      </Form.Item>
    </div>
  );
};
