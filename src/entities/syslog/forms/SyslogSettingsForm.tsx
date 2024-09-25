import { Form, FormInstance, InputNumber, Select, Spin, Switch } from 'antd';
import { useAppSelector } from 'app/config/store';
import { InputIPAddressV4 } from 'app/shared/components/InputIPAddressV4';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IRequestTenantSettings } from 'app/shared/model/tenant-setting.model';
import React from 'react';

interface ISyslogSettingsFormProps {
  form: FormInstance<any>;
}

export const SyslogSettingsForm: React.FC<ISyslogSettingsFormProps> = ({ form }) => {
  const [iputsEnabled, setInputsEnabled] = React.useState<boolean>(null);
  const [baseObj] = useMirketPortal();
  const ipRequired = Form.useWatch('status', form);

  const tenantSettings: IRequestTenantSettings = useAppSelector(state => state.tenantSetting.tenantSettings);
  const loading: boolean = useAppSelector(state => state.tenantSetting.loading);

  React.useEffect(() => {
    setInputsEnabled(tenantSettings?.status);
  }, [tenantSettings]);

  React.useEffect(() => {
    form.resetFields();
  }, []);

  if (!tenantSettings || loading) {
    return <Spin />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item
        name="status"
        initialValue={tenantSettings?.status}
        label={'Status'}
        labelCol={{ sm: 10, md: 10, xl: 6 }}
        wrapperCol={{ sm: 12, md: 12, xl: 8 }}
      >
        <Switch
          disabled={baseObj?.isReadOnly}
          checkedChildren={'Enable'}
          unCheckedChildren={'Disable'}
          onChange={v => {
            setInputsEnabled(prev => v);
            form.setFieldValue('status', v);
          }}
        />
      </Form.Item>
      <Form.Item
        name={'ipAddress'}
        initialValue={tenantSettings?.ipAddress}
        label={'IP Address'}
        labelCol={{ sm: 10, md: 10, xl: 6 }}
        wrapperCol={{ sm: 12, md: 12, xl: 8 }}
        rules={[
          {
            required: ipRequired,
            message: 'Please input a valid IP Address.',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!getFieldValue('ipAddress') || (value?.split('.').length === 4 && Number(value?.split('.')[3]) >= 1)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Invalid IP Address.'));
            },
          }),
        ]}
      >
        <InputIPAddressV4 readOnly={baseObj?.isReadOnly || !ipRequired} />
      </Form.Item>

      <Form.Item
        name="port"
        initialValue={tenantSettings?.port}
        label={'Port'}
        labelCol={{ sm: 10, md: 10, xl: 6 }}
        wrapperCol={{ sm: 12, md: 12, xl: 8 }}
      >
        <InputNumber tabIndex={5} style={{ width: '100%' }} readOnly={!iputsEnabled || baseObj?.isReadOnly} maxLength={4} />
      </Form.Item>
      <Form.Item
        name="messageFormat"
        initialValue={tenantSettings?.messageFormat}
        label={'Message Format'}
        labelCol={{ sm: 10, md: 10, xl: 6 }}
        wrapperCol={{ sm: 12, md: 12, xl: 8 }}
      >
        <Select
          disabled={!iputsEnabled || baseObj?.isReadOnly}
          style={{ width: '100%' }}
          tabIndex={6}
          options={[
            { label: 'RFC_3164', value: 0 },
            { label: 'RFC_5424', value: 1 },
            { label: 'RFC_5425', value: 2 },
          ]}
        />
      </Form.Item>
    </div>
  );
};
