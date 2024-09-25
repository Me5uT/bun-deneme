import { Form, Switch } from 'antd';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const OptionalForm: React.FC = () => {
  const { control } = useFormContext();

  return (
    <>
      <Form.Item label="Remote Support :" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="isSupportActive"
          control={control}
          render={({ field }) => (
            <Switch checkedChildren=" On " unCheckedChildren="Off" checked={field.value} onChange={e => field.onChange(e)} />
          )}
        />
      </Form.Item>
    </>
  );
};
