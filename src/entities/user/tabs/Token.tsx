import { Form, InputNumber } from 'antd';
import { useAppSelector } from 'app/config/store';
import { ITenant } from 'app/shared/model/tenant.model';
import React from 'react';

export const Token: React.FC = () => {
  // const user: ITenant = useAppSelector(state => state.gateway.entity);

  // const updateSuccess: boolean = useAppSelector(state => state.gateway.updateSuccess);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item name="licenceCount" label={'License Count'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
    </div>
  );
};
