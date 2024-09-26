import "../../shared/styles/card.css";
import { Avatar, Space, Tag, Tooltip } from "antd";
import React from "react";
import { GatewayStatusInt } from "../model/gateway.model";
import { StatusInt, VerificationStatusInt } from "../model/tenant.model";
import { StatusIcon } from "./StatusIcon";
interface IProfileCardProps {
  avatarImg?: string;
  title?: string;
  tagText?: string;
  tagColor?: string;
  backgroundColor?: string;
  avatarColor?: string;
  statusIcon?: boolean | StatusInt | VerificationStatusInt | GatewayStatusInt;
  description?: string;
  statusIconTooltip?: boolean | string | StatusInt;
}

const ProfileCardComponent: React.FC<IProfileCardProps> = ({
  title,
  tagText,
  tagColor,
  backgroundColor,
  avatarColor,
  statusIcon,
  description,
  statusIconTooltip,
  avatarImg,
}) => {
  return (
    <div className="profile-card-container">
      <div className="content">
        <div className="card">
          <div className="card-decor" style={{ background: backgroundColor }} />
          <div className="firstinfo">
            <Avatar
              icon={avatarImg || title?.charAt(0).toUpperCase()}
              size={86}
              style={{ backgroundColor: avatarColor }}
            ></Avatar>
            <div className="profileinfo">
              <Space direction="horizontal">
                <h1>{title}</h1>
                <Tooltip title={statusIconTooltip}>
                  <label>
                    <StatusIcon status={statusIcon} size="lg" />
                  </label>
                </Tooltip>
              </Space>
              {tagText && <Tag color={tagColor || "blue"}>{tagText}</Tag>}
              <p className="bio">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const ProfileCard = React.memo(ProfileCardComponent);
