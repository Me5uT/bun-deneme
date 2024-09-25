import { Menu, MenuProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderUserMenu: React.FC = () => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      label: (
        <img
          alt="Logo"
          src={"assets/images/blank.png"}
          style={{ width: "50px", height: "50px", borderRadius: "0.475rem" }}
        />
      ),
      key: "headerusermenu",

      children: [
        {
          label: (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "15px 5px",
              }}
            >
              <img
                alt="Logo"
                src={"/assets/images/blank.png"}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0.475rem",
                }}
              />

              <div
                style={{
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: "-15px",
                }}
              >
                <div
                  style={{
                    maxHeight: "15px",
                    padding: "0px !important",
                    margin: "0px !important",
                    fontWeight: "700",
                    fontSize: "1.15rem",
                  }}
                >
                  {"displayName"}
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    padding: "0px !important",
                    margin: "0px !important",
                    maxHeight: "15px",
                    color: "#99a1b7",
                  }}
                >
                  {"domain"}
                </div>
              </div>
            </div>
          ),
          key: "profile",
          style: {
            height: "auto",
          },
        },
        {
          type: "divider",
        },
        {
          label: "My Profile",
          key: "myprofile",
          disabled: true,
        },

        {
          label: "Language",
          key: "language",
          disabled: true,
        },
        {
          label: (
            <div
              onClick={() => {
                navigate("/settings");
              }}
            >
              {"Settings"}
            </div>
          ),
          key: "settings",
        },
        {
          label: (
            <p style={{ border: "none" }} onClick={() => {}}>
              {"Logout"}
            </p>
          ),
          key: "logout",
        },
      ],
    },
  ];

  return (
    <Menu items={items} mode="horizontal" triggerSubMenuAction="click"></Menu>
  );
};

export default HeaderUserMenu;
