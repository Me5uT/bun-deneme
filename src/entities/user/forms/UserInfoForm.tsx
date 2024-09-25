import { Form, Input, Switch } from 'antd';
import { getPhoneCountryFromLocal } from 'app/shared/util/LocalStorage';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

export const UserInfoForm: React.FC = () => {
  const [phoneCountryCode, setPhoneCountryCode] = React.useState<string>('gb');
  const { control } = useFormContext();

  React.useEffect(() => {
    setPhoneCountryCode(prev => getPhoneCountryFromLocal());
  }, []);

  return (
    <div>
      <Form.Item label="Display Name :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="displayName" control={control} render={({ field }) => <Input {...field} placeholder={'Display Name'} />} />
      </Form.Item>

      <Form.Item label="Username :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="username" control={control} render={({ field }) => <Input {...field} placeholder={'Username'} />} />
      </Form.Item>

      <Form.Item label="Phone :" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              specialLabel=""
              inputClass="add-user-phone"
              searchClass="add-user-phone-search"
              containerClass="add-user-phone-container"
              country={phoneCountryCode}
              preferredCountries={['gb']}
              onChange={onChange}
              value={value}
              placeholder="Phone"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Mail :" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} rules={[{ type: 'email', required: true }]}>
        <Controller
          name="mail"
          control={control}
          render={({ field }) => <Input {...field} placeholder={'Mail'} style={{ width: '100%' }} type="email" />}
        />
      </Form.Item>

      <Form.Item label="SAM Value:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} required>
        <Controller name="sam" control={control} render={({ field }) => <Input {...field} placeholder={'SAM Value'} />} />
      </Form.Item>
      <Form.Item hidden label="Passless:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="isExternal"
          control={control}
          render={({ field: { value, onChange } }) => <Switch onChange={onChange} checked={value} />}
        />
      </Form.Item>
    </div>
  );
};
