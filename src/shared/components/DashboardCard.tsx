import "../../shared/styles/dashboard.css";

import { Card, Col, Row, Space } from "antd";
import React from "react";
interface IDashboardCardProps {
  title: string;
  items: {
    key: string;
    label: string;
    children: React.ReactNode;
  }[];
  loading?: boolean;
}
export const DashboardCard: React.FC<IDashboardCardProps> = ({
  title,
  items,
  loading,
}) => (
  <Card
    title={<span className="dashboard-card-title">{title}</span>}
    className="dashboard-card"
    loading={loading}
  >
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {items.map((item) => (
        <Row key={item.key} align="middle" className="dashboard-card-row">
          <Col span={8} className="dashboard-card-label">
            <strong>{item.label}</strong>
          </Col>
          <Col span={16} style={{ display: "flex", alignItems: "center" }}>
            {typeof item.children === "string" ? (
              <span className="dashboard-card-text">{item.children}</span>
            ) : (
              item.children
            )}
          </Col>
        </Row>
      ))}
    </Space>
  </Card>
);
