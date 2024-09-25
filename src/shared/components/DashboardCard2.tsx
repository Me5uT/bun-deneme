import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Space } from 'antd';
import React from 'react';

interface IDashboardCard2 {
  items: {
    key: string;
    label: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }[];
  title: string;
  loading?: boolean;
}
export const DashboardCard2: React.FC<IDashboardCard2> = ({ title, items, loading }) => (
  <Card title={<span className="dashboard-card-title">{title}</span>} className="dashboard-card" loading={loading}>
    <Space
      direction="horizontal"
      size="middle"
      style={{ width: '100%', height: '100%', justifyContent: 'space-between', alignContent: 'center' }}
      wrap
    >
      {items.map(item => (
        <Space direction="vertical" key={item.key} style={{ width: '100%' }}>
          <Space align="end">
            <div className="dasboard-card-value" style={{ color: '#0d2b51', fontWeight: '600' }}>
              {item?.children}
            </div>
            {item?.icon}
          </Space>
          <b className="dasboard-card-label">{item?.label}</b>
        </Space>
      ))}
    </Space>
  </Card>
);
