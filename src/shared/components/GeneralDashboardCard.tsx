import Icon, {
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Space } from "antd";
import React from "react";
interface IGeneralDashboardCardProps {
  title: string;
  items: {
    key: string;
    label: string;
    children: React.ReactNode;
  }[];
  loading?: boolean;
}
export const GeneralDashboardCard: React.FC<IGeneralDashboardCardProps> = ({
  title,
  items,
  loading,
}) => (
  <Card
    // title={<span className="dashboard-card-title">{title}</span>}
    title={null}
    className="dashboard-card"
    loading={loading}
    styles={{ header: { textAlign: "center" } }}
  >
    <div className="card-header">
      <img
        src={"/assets/images/logo.png"}
        alt="company-logo"
        className="card-logo"
      />
      <span className="card-title">{items[0].children}</span>
    </div>
    <div className="card-content">
      <div className="card-row">
        <Icon component={UserOutlined} className="card-icon" />
        <b className="dasboard-card-label">Account Type :</b>
        <span className="card-value">{items[1].children}</span>
      </div>
      <div className="card-row">
        <Icon component={DollarOutlined} className="card-icon" />
        <b className="dasboard-card-label">Version :</b>
        <span className="card-value">{items[2].children}</span>
      </div>
      <div className="card-row">
        <Icon component={ClockCircleOutlined} className="card-icon" />
        <b className="dasboard-card-label">Time Zone :</b>
        <span className="card-value">{items[3].children}</span>
      </div>
    </div>
  </Card>
);
