import { BarsOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu, MenuProps, Space, Tag, Tooltip } from "antd";
import { DotIcon } from "../../components/DotIcon";
import { MenuItemText } from "../../components/MenuItemText";
import useMirketPortal from "../..//hooks/useMirketPortal";
import { LicenceTypeInt, TenantTypeInt } from "../..//model/tenant.model";
import { getColorByType, openNewTab } from "../..//util/UtilityService";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
  isSideBarCollapsed: boolean;
}

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();

  const menuItems: MenuProps["items"] = React.useMemo(
    () => [
      {
        label: (
          <Link to={`/${baseObj?.basePath}`}>
            <MenuItemText text={"Dashboard"} />
          </Link>
        ),
        key: "home",
      },
      {
        label: <MenuItemText text={"Monitoring"} />,
        key: "monitoring",
        children: [
          {
            label: "Logging",
            type: "group",
            children: [
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/logging-audit`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Auidit Logs"} />
                    </Space>
                  </Link>
                ),
                key: "logging-audit",
              },
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/logging-radius`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Radius Logs"} />
                    </Space>
                  </Link>
                ),
                key: "logging-radius",
              },
            ],
          },
        ],
      },
      {
        label: <MenuItemText text={"Configuration"} />,
        key: "configuration",
        children: [
          {
            label: "User Profile",
            type: "group",
            children: [
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/user`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Users"} />
                    </Space>
                  </Link>
                ),
                key: "users",
              },
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/group`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Groups"} />
                    </Space>
                  </Link>
                ),
                key: "groups",
              },
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/external-source`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"External Source"} />
                    </Space>
                  </Link>
                ),
                key: "externalSource",
              },
            ],
          },
          {
            label: "Authentication",
            type: "group",
            children: [
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/radius-rules`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Radius Rules"} />
                    </Space>
                  </Link>
                ),
                key: "radius",
              },
              {
                label: (
                  <Tooltip
                    title={
                      baseObj?.licenceType !== LicenceTypeInt.SSO &&
                      "SSO Licence Required!"
                    }
                  >
                    <Button
                      className="disabled-button"
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                      disabled={baseObj?.licenceType !== LicenceTypeInt.SSO}
                      type="link"
                      onClick={() =>
                        navigate(`/${baseObj?.basePath}/user-portal`)
                      }
                    >
                      <Space direction="horizontal">
                        <DotIcon
                          disabled={baseObj?.licenceType !== LicenceTypeInt.SSO}
                        />

                        <MenuItemText
                          text={"User Portal"}
                          disabled={baseObj?.licenceType !== LicenceTypeInt.SSO}
                        />
                      </Space>
                    </Button>
                  </Tooltip>
                ),
                key: "ssorules",
              },
            ],
          },
          {
            label: "Connector",
            type: "group",
            children: [
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/gateway-radius`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Gateway"} />
                    </Space>
                  </Link>
                ),
                key: "gateway",
              },
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/sms-provider`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"SMS Provider"} />
                    </Space>
                  </Link>
                ),
                key: "smsProvider",
              },
            ],
          },
          {
            label: "Settings",
            type: "group",
            children: [
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/tenant-setting`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"General"} />
                    </Space>
                  </Link>
                ),
                key: "general",
              },
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/syslog`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Syslog"} />
                    </Space>
                  </Link>
                ),
                key: "syslog",
              },
              {
                label: (
                  <Link to={`/${baseObj?.basePath}/attribute-profile`}>
                    <Space direction="horizontal">
                      <DotIcon />
                      <MenuItemText text={"Attributes"} />
                    </Space>
                  </Link>
                ),
                key: "attributes",
              },
            ],
          },
        ],
      },
      {
        label: <MenuItemText text={"Mentis"} />,
        key: "mentis",
        children: [
          {
            label: "Mentis",
            type: "group",
            className: "mentis-manage-container",
            children: [
              {
                label: (
                  <Tooltip title={"Under Construction!"}>
                    <Button
                      disabled
                      type="link"
                      onClick={() =>
                        navigate(`/${baseObj?.basePath}/mentis-detection`)
                      }
                    >
                      <Space direction="horizontal">
                        <DotIcon disabled />
                        <MenuItemText disabled text={"Detection"} />
                      </Space>
                    </Button>
                  </Tooltip>
                ),
                key: "mentis-detection",
              },
              {
                label: (
                  <Tooltip
                    title={!baseObj?.mentis && "Mentis Licence Required!"}
                  >
                    <Button
                      disabled={!baseObj?.mentis}
                      type="link"
                      onClick={() =>
                        navigate(`/${baseObj?.basePath}/mentis-manage`)
                      }
                    >
                      <Space direction="horizontal">
                        <DotIcon disabled={!baseObj?.mentis} />
                        <MenuItemText
                          disabled={!baseObj?.mentis}
                          text={"Manage"}
                        />
                      </Space>
                    </Button>
                  </Tooltip>
                ),
                key: "mentis-manage",
              },
            ],
          },
        ],
      },
      {
        label: (
          <Link to={`/${baseObj?.basePath}/administration`}>
            <MenuItemText text={"Administration"} />
          </Link>
        ),
        key: "administration",
      },
    ],
    [baseObj?.basePath]
  );

  return (
    <div className="app-header">
      <div className="header-logo">
        <Link to={"/"}>
          <img
            alt="Logo"
            loading="lazy"
            width={115}
            src={"/assets/images/mirket2020_Logotype-Dark.png"}
          />
        </Link>
      </div>

      <Menu
        className="header-menu"
        triggerSubMenuAction="click"
        hidden={false}
        mode="horizontal"
        items={menuItems}
        style={{ minWidth: 0, flex: "auto" }}
        overflowedIndicator={<BarsOutlined style={{ fontSize: 20 }} />}
      />

      <div className="header-tag">
        <label
          className="header-tenant-label"
          onClick={() => {
            navigate(`${baseObj?.basePath}`);
          }}
        >
          {baseObj?.tenantType !== TenantTypeInt.ENDUSER && (
            <Tag color={getColorByType(TenantTypeInt, baseObj?.tenantType)}>
              {Object.values(TenantTypeInt)[baseObj?.tenantType]}
            </Tag>
          )}
          {baseObj?.tenantType !== TenantTypeInt.MIRKET && (
            <Tag color={getColorByType(TenantTypeInt, baseObj?.tenantType)}>
              {baseObj?.tenantName}
            </Tag>
          )}
        </label>

        <label
          className={
            baseObj?.isReadOnly ? "header-readonly-label" : "header-admin-label"
          }
          onClick={() => {
            if (baseObj?.isReadOnly) return;
            else
              openNewTab(
                `/${baseObj?.loginPath}/administration/${baseObj?.ownerAdminId}`
              );
          }}
        >
          <div style={{ color: "#252f4a" }}>{`${baseObj?.fullname}`}</div>
          <div style={{ color: "#78829d" }}>{`${baseObj?.email}`}</div>
        </label>
      </div>
      <div className="logout-btn-container">
        <Tooltip title={"Logout"}>
          <Button
            icon={
              <FontAwesomeIcon icon="arrow-right-from-bracket" size={"lg"} />
            }
            onClick={() => {
              navigate("/logout");
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default AppHeader;
