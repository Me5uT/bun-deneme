import { Form, FormInstance, Input, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import { IParticipant } from 'app/shared/model/participant.model';
import { getPhoneCountryFromLocal } from 'app/shared/util/LocalStorage';
import React from 'react';
import PhoneInput from 'react-phone-input-2';

interface IUserSettingsProps {
  form: FormInstance<any>;
}
export const UserSettings: React.FC<IUserSettingsProps> = ({ form }) => {
  const loading: boolean = useAppSelector(state => state.userTemp.loading);
  const participant: IParticipant = useAppSelector(state => state.userTemp.entity);

  React.useEffect(() => {
    form.resetFields();
  }, [participant]);

  if (loading || !participant) {
    return <Spin fullscreen spinning={loading} />;
  }
  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '20px' }}>
      <Form.Item
        name="displayName"
        label={'Display Name'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="username"
        label={'Username'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="sam"
        label={'Sam Value'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="phone" label={'Phone Number'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <PhoneInput
          dropdownClass="phone-input-dropdown-up"
          country={!participant?.phone ? getPhoneCountryFromLocal() : 'gb'}
          preferredCountries={['gb', 'us', 'tr']}
          placeholder="Phone"
        />
      </Form.Item>
    </div>
  );
};
