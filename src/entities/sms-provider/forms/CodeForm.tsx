import { Form, Input } from 'antd';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
const { TextArea } = Input;

export const CodeForm: React.FC = () => {
  const { control } = useFormContext();
  const onFocus = (e: any) => {
    (e.target as HTMLTextAreaElement).removeAttribute('readonly');
  };

  return (
    <div>
      <Form.Item label="Username" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => <Input {...field} readOnly onFocus={onFocus} placeholder={'Username'} />}
        />
      </Form.Item>
      <Form.Item label={'Password'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} placeholder={'Password'} />} />
      </Form.Item>
      <Form.Item label={'Company Code'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="originator" control={control} render={({ field }) => <Input {...field} placeholder={'Company Code'} />} />
      </Form.Item>
      <Form.Item label={'Signature'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="companySignature" control={control} render={({ field }) => <Input {...field} placeholder={'Signature'} />} />
      </Form.Item>
      <Form.Item label={'User Code'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="userCode" control={control} render={({ field }) => <Input {...field} placeholder={'User Code'} />} />
      </Form.Item>
      <Form.Item label={'Account Code'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="accountCode" control={control} render={({ field }) => <Input {...field} placeholder={'Account Code'} />} />
      </Form.Item>
      <Form.Item label={'Message'} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="message"
          control={control}
          render={({ field }) => <TextArea {...field} showCount maxLength={100} style={{ resize: 'horizontal' }} placeholder={'Message'} />}
        />
      </Form.Item>
    </div>
  );
};
