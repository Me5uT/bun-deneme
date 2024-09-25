/* eslint-disable object-shorthand */
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DatePicker, Form, FormInstance, InputNumber, Select, Spin, Switch } from 'antd';
import { useAppSelector } from 'app/config/store';
import { ITenantDetail, LicenceType, LicenceTypeInt } from 'app/shared/model/tenant.model';
import dayjs from 'dayjs';
import React from 'react';
interface ILicenceFormProps {
  form: FormInstance<any>;
}

export const LicenseForm: React.FC<ILicenceFormProps> = ({ form }) => {
  const isDemo = Form.useWatch('licenceType', form) === LicenceTypeInt.Demo;
  const tenant: ITenantDetail = useAppSelector(state => state.account.entity);
  const loading = useAppSelector(state => state.account.loading);

  React.useEffect(() => {
    form.resetFields();
  }, [tenant]);

  if (loading || !tenant) {
    return <Spin fullscreen spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item
        name="licenceType"
        label={'License Type'}
        labelCol={{ xl: 4, lg: 5, md: 6, sm: 9, xs: 9 }}
        wrapperCol={{ xl: 6, lg: 7, md: 9, sm: 15, xs: 15 }}
      >
        <Select
          options={[
            { value: LicenceTypeInt.Demo, label: LicenceType.Demo },
            { value: LicenceTypeInt.MFA, label: LicenceType.MFA },
            { value: LicenceTypeInt.SSO, label: LicenceType.SSO },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="licenceCount"
        label={'License Count'}
        labelCol={{ xl: 4, lg: 5, md: 6, sm: 9, xs: 9 }}
        wrapperCol={{ xl: 6, lg: 7, md: 9, sm: 15, xs: 15 }}
        rules={[
          {
            validator: (_, value) => {
              if (value < tenant?.licenceHistory?.usedTotalUser) {
                return Promise.reject(new Error('License Count must be greater than used license count'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} disabled={isDemo} />
      </Form.Item>

      <Form.Item
        name="expireDate"
        label={'Expire Date'}
        labelCol={{ xl: 4, lg: 5, md: 6, sm: 9, xs: 9 }}
        wrapperCol={{ xl: 6, lg: 7, md: 9, sm: 15, xs: 15 }}
      >
        <DatePicker
          allowClear={false}
          style={{ width: '100%' }}
          format={'DD.MM.YYYY'}
          placeholder="Expire Date"
          disabled={isDemo}
          disabledDate={current => {
            // Disable dates before today
            return current && current.isBefore(dayjs().startOf('day') as any);
          }}
        />
      </Form.Item>
      <Form.Item
        name="mentis"
        label={'Mentis'}
        rules={[
          {
            type: 'boolean',
          },
        ]}
        labelCol={{ xl: 4, lg: 5, md: 6, sm: 9, xs: 9 }}
        wrapperCol={{ xl: 6, lg: 7, md: 9, sm: 15, xs: 15 }}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </div>
  );
};
