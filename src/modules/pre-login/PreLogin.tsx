import { Button, Card, Typography } from "antd";
import React from "react";
import VerificationInput from "react-verification-input";
interface PreLoginProps {
  setMirketCode: React.Dispatch<React.SetStateAction<string>>;
  mirketCode: string;
}
export const PreLogin: React.FC<PreLoginProps> = ({
  setMirketCode,
  mirketCode,
}) => {
  const otpInputRef = React.useRef(null);

  React.useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);

  return (
    <Card
      style={{
        width: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          justifyContent: "space-between",
        },
      }}
    >
      <img
        alt="pre-login-logo"
        width={80}
        src={"src/assets/images/mirket-mini-logo.jpg"}
      />
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Mirket Token
      </Typography.Title>
      <Typography.Text type="secondary">
        Enter token code in your mirket mobile app.
      </Typography.Text>

      {/* <Input.OTP size="large" formatter={str => str.toUpperCase()} onKeyDown={v => handleOtpChange(v.key)} value={mirketCode} /> */}

      <VerificationInput
        validChars="/0-9/"
        onChange={(v) => {
          setMirketCode(v);
        }}
        value={mirketCode}
      />
      <Button
        type="primary"
        htmlType="submit"
        style={{ width: "100%", marginTop: "5px" }}
      >
        Login
      </Button>
    </Card>
  );
};
