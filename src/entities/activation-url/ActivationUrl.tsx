import "../../shared/styles/activationpage.css";

import { WarningFilled } from "@ant-design/icons";
import { useSetState } from "ahooks";
import { Button, QRCode, Result, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { AppGalleryBadge } from "app/shared/components/AppGalleryBadge";
import { AppStoreBadge } from "app/shared/components/AppStoreBadge";
import { PlayStoreBadge } from "app/shared/components/PlayStoreBadge";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkVerify } from "../tenant-setting/tenant-setting.reducer";
import { logout } from "app/shared/reducers/authentication";

const ActivationUrl = () => {
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

  React.useEffect(() => {
    // dispatch(logout());

    dispatch(checkVerify({ id: states?.id, recordtype: states?.recordtype }));
  }, []);

  if (loading) return <Spin fullscreen />;

  return (
    <div className="activation-page">
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
        ></Result>
      ) : (
        <div className="activation-container">
          <div className="activation-logo-container">
            <img
              className="activation-logo"
              src={"/assets/images/mirket2020_Logotype-Dark.png"}
              alt="mirket-logo"
            />
          </div>

          <div className="activation-title1">{"Welcome to Mirket"}</div>

          <div className="activation-desc1">
            {
              "Your user account has been set up to use the Mirket Mobile App. To begin, install the Mirket App and activate the service."
            }
          </div>

          <div className="activation-title2">{"Get the Mirket App"}</div>

          <div className="activation-desc2">
            {
              "If you do not have installed, click one of these links and download the Mirket app appropriate for your mobile phone's operating system."
            }
          </div>

          <div className="activation-badges-container">
            <AppStoreBadge />
            <PlayStoreBadge />
            <AppGalleryBadge />
          </div>

          <div className="activation-title3">{"Activate Your App"}</div>

          <div className="activation-desc3">
            {
              "If the Mirket app is installed, you can click the 'Activate' link directly from your mobile device to start authenticating with Mirket."
            }
          </div>

          <div className="activation-active-button-container">
            <Button
              style={{
                backgroundColor: "#0f6480",
                color: "white",
                textAlign: "center",
                fontSize: "16px",
                margin: "4px 2px",
                padding: "10px 30px",
                height: "auto",
              }}
              type="link"
              href={verifyUrl}
              target="_blank"
            >
              {"ACTIVATE"}
            </Button>
          </div>

          <div className="activation-desc4">
            {
              "You can also complete the activation process by scanning the QR code through the Mirket mobile application."
            }
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
              {`This link and QR code are only valid for ${states?.timeout} hours, so make sure you activate as soon as possible. If you have questions, contact your IT department.`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivationUrl;
