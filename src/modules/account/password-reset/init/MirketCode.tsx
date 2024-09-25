import { Button, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import React from "react";
import VerificationInput from "react-verification-input";
import { handlePasswordResetInit } from "../password-reset.reducer";
import { WarnDialog } from "app/shared/components/WarnDialog";
import { useNavigate } from "react-router-dom";
const { Text, Title } = Typography;
interface MirketCodeProps {
  mail: string;
  errorMessage: string | null | undefined;
  setShowForm: (v: boolean) => void;
}
export const MirketCode: React.FC<MirketCodeProps> = ({
  mail,
  errorMessage,
  setShowForm,
}) => {
  const [mirketToken, setmirketToken] = React.useState("");
  const [resultModalOpenClose, setResultModalOpenClose] =
    React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.passwordReset.loading);

  const onSubmit = async () => {
    await dispatch(handlePasswordResetInit({ mail, mirketToken }));
    setResultModalOpenClose(true);
  };

  return (
    <div>
      <Space direction="vertical" align="center">
        <img alt="login-logo" width={60} src={"src/assets/images/phone.png"} />

        <Title level={4}> Multi-Factor Verification </Title>
        <Text type="secondary">
          Enter the verification code we sent your phone number.
        </Text>

        <VerificationInput
          length={6}
          value={mirketToken}
          onChange={(v) => setmirketToken(v)}
        />
        <Button
          style={{
            marginTop: "40px",
          }}
          loading={loading}
          type="primary"
          onClick={onSubmit}
        >
          Continue
        </Button>
      </Space>
      <WarnDialog
        destroyOnClose
        modalType={errorMessage ? "error" : "success"}
        open={resultModalOpenClose}
        message={
          errorMessage
            ? errorMessage
            : "We sent you an e-mail so you can change your password. Please Check Your Mail."
        }
        onClose={() => {
          if (errorMessage) {
            setResultModalOpenClose(false);
            setShowForm(true);
          } else {
            setResultModalOpenClose(false);
            window.location.reload();
          }
        }}
        onOk={() => {
          if (errorMessage) {
            setResultModalOpenClose(false);
            setShowForm(true);
          } else {
            setResultModalOpenClose(false);
            window.location.reload();
          }
        }}
      />
    </div>
  );
};
