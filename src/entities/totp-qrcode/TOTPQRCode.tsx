import { WarningFilled } from "@ant-design/icons";
import { useSetState } from "ahooks";
import { Button, QRCode, Result, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkTOTPID } from "../user/usertemp.reducer";

const TOTPQRCode = () => {
  const [searchParams, setSearchparams] = useSearchParams();
  const [states, setStates] = useState({
    id: searchParams.get("id"),
    recordtype: searchParams.get("recordtype"),
    timeout: searchParams.get("timeout"),
  });
  console.log("🚀 ~ TOTPQRCode ~ states:", states);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const verifyUrl: string = useAppSelector((state) => state.userTemp.verifyUrl);
  console.log("🚀 ~ TOTPQRCode ~ verifyUrl:", verifyUrl);

  const loading: boolean = useAppSelector((state) => state.userTemp.loading);
  const verfiyErrorMessage: string = useAppSelector(
    (state) => state.userTemp.verfiyErrorMessage
  );

  React.useEffect(() => {
    if (states?.id) dispatch(checkTOTPID(states?.id));
  }, [states?.id]);

  if (loading) return <Spin fullscreen />;

  return (
    <div className="activation-page">
      {verfiyErrorMessage && !verifyUrl && !loading ? (
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
        <div className="activation-container">
          <div className="activation-logo-container">
            <img
              className="activation-logo"
              src={"src/assets/images/mirket2020_Logotype-Dark.png"}
              alt="mirket-logo"
            />
          </div>

          <div className="qr-code-container">
            <QRCode
              errorLevel="L"
              value={`${verifyUrl}`}
              status={loading ? "loading" : "active"}
              size={333}
            />
          </div>

          <div className="activation-warning-section">
            <div className="activation-warning-icon">
              <WarningFilled
                rev=""
                style={{ fontSize: "25px", color: "red" }}
              />
            </div>
            <div className="activation-desc5">
              {`This QR code are only valid for ${states?.timeout} hours, so make sure you activate as soon as possible. If you have questions, contact your IT department.`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TOTPQRCode;
