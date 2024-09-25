import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import React from 'react';

export const BackTopButton = () => {
  return <FloatButton.BackTop type="primary" icon={<ArrowUpOutlined />} />;
};
