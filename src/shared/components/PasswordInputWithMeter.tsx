import { Col, Input, InputRef, Row } from 'antd';
import { PasswordProps } from 'antd/es/input/Password';
import React, { FC, useState } from 'react';

interface IPasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: 'large' | 'middle' | 'small';
  placeholder?: string;
  visibilityToggle: boolean;
}

const Bar: FC<{ active: boolean; color: string }> = ({ active, color }) => (
  <div
    style={{
      height: '8px',
      width: '100%',
      backgroundColor: active ? color : 'rgba(211, 211, 211, 0.5)',
      borderRadius: '4px',
      boxShadow: active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
    }}
  />
);

export const PasswordInputWithMeter: FC<IPasswordInputProps> = props => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (password: string) => {
    let strength = 0;

    // 1- Büyük harf bulunması +1 puan
    if (/[A-Z]/.test(password)) strength += 1;

    // 2- Küçük harf bulunması +1 puan
    if (/[a-z]/.test(password)) strength += 1;

    // 3- Sayı bulunması +1 puan
    if (/\d/.test(password)) strength += 1;

    // 4- Minimum 8 karakter, maksimum 15 karakter olması +1 puan
    if (password.length >= 8 && password.length <= 15) strength += 1;

    // 5- Belirtilen özel karakterlerden en az 1 adet olması +1 puan
    if (/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    calculateStrength(newPassword);
    if (props.onChange) props.onChange(newPassword);
  };

  return (
    <div>
      <Input.Password
        placeholder={props.placeholder}
        value={props.value}
        onChange={handlePasswordChange}
        visibilityToggle={props.visibilityToggle}
        style={{
          backgroundColor: 'white',
        }}
      />

      <div
        style={{
          margin: '8px 0px 0px 5px',
          color: 'lightgray',
          fontWeight: 'bold',
        }}
      >
        {'Password Power'}
      </div>

      <Row gutter={8}>
        <Col span={3}>
          <Bar active={passwordStrength > 0} color="#F64E60" />
        </Col>
        <Col span={4}>
          <Bar active={passwordStrength > 1} color="#FFA800" />
        </Col>
        <Col span={5}>
          <Bar active={passwordStrength > 2} color="yellow" />
        </Col>
        <Col span={6}>
          <Bar active={passwordStrength > 3} color="#1BC5BD" />
        </Col>
        <Col span={6}>
          <Bar active={passwordStrength > 4} color="#3699FF" />
        </Col>
      </Row>
    </div>
  );
};
