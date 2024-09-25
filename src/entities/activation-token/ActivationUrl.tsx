import { WarningFilled } from "@ant-design/icons";
import { useSetState } from "ahooks";
import { Button, Card, QRCode, Result, Space, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ActivationToken = () => {
  const [searchParams, setSearchparams] = useSearchParams();
  const [states, setStates] = useSetState<any>({
    id: searchParams.get("id"),
    recordtype: searchParams.get("recordtype"),
    timeout: searchParams.get("timeout"),
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const verifyUrl: string = useAppSelector(
    (state) => state.tenantSetting.verifyUrl
  );

  const loading: boolean = useAppSelector(
    (state) => state.tenantSetting.loading
  );
  const verfiyErrorMessage: string = useAppSelector(
    (state) => state.tenantSetting.verfiyErrorMessage
  );

  if (loading) return <Spin fullscreen />;

  return (
    <Card
      styles={{
        body: {
          height: "99vh",
          border: "1px solid lightgray",
          borderRadius: "8px",
        },
      }}
    >
      {verfiyErrorMessage && !verifyUrl ? (
        <Result
          status="error"
          title={"Something went wrong!"}
          subTitle={verfiyErrorMessage}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          extra={[
            <Button
              key={"login-btn"}
              type="primary"
              onClick={() => navigate("/")}
            >
              Go to Login
            </Button>,
          ]}
        />
      ) : (
        <Space
          direction="vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            width={200}
            src={"/assets/images/mirket2020_Logotype-Dark.png"}
            alt="mirket-logo"
          />

          <QRCode
            errorLevel="L"
            value={`https://mirketsecurity.com/end-user-licence-agreement/`}
            status={loading ? "loading" : "active"}
            size={333}
          />

          <div className="activation-warning-section">
            <div className="activation-warning-icon">
              <WarningFilled
                rev=""
                style={{ fontSize: "25px", color: "red" }}
              />
            </div>
            <div className="activation-desc5">
              {`This link and QR code are only valid for ${
                states?.timeout || "some"
              } hours, so make sure you activate as soon as possible. If you have questions, contact your IT department.`}
            </div>
          </div>
        </Space>
      )}
    </Card>
  );
};
