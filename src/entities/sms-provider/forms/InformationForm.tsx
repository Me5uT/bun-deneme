import { Form, Input, Select } from 'antd';
import { splittedDefaultProviderList } from 'app/shared/mockdata/ProviderList';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
const { TextArea } = Input;
export const InformationForm: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div>
      <Form.Item label="Provider Name" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller name="name" control={control} render={({ field }) => <Input {...field} placeholder={'Provider Name'} />} />
      </Form.Item>

      <Form.Item label="SMS Provider" required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="provider"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              style={{ width: '100%' }}
              allowClear
              suffixIcon={null}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={splittedDefaultProviderList}
              placeholder={'Select Provider'}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Description" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <TextArea {...field} placeholder={'Description'} cols={2} />}
        />
      </Form.Item>
    </div>
  );
};
