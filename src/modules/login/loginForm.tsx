import { animated, useSpring } from "@react-spring/web";
import { Alert, Button, Card, Checkbox, Form, Input, Row, Space } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";

interface ILoginFormProps {
  setIsFlipped: (v: any) => void;
  mirketCode: string;
  setLoginInfo: (v: any) => void;
}
export const LoginForm: React.FC<ILoginFormProps> = ({ setIsFlipped }) => {
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated
  );
  const loginError = useAppSelector((state) => state.authentication.loginError);
  const errorMessage = useAppSelector(
    (state) => state.authentication.errorMessage
  );
  const loginSuccess = useAppSelector(
    (state) => state.authentication.loginSuccess
  );
  const location = useLocation();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (loginSuccess) setIsFlipped("prelogin");
  }, [loginSuccess]);

  const alertAnimation = useSpring({
    marginTop: "15px",
    height: "56px",
    opacity: loginError ? 1 : 0,
    transform: loginError ? "translateY(0)" : "translateY(-20px)",
    config: { duration: 300 },
  });

  const goToReset = React.useCallback(() => setIsFlipped("reset"), []);

  if (location.pathname === "/") return <Navigate to={"/login"} />;

  const { from } = (location.state as any) || {
    from: { pathname: "/", search: location.search },
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Card
        style={{
          width: "450px",
        }}
      >
        <Row justify={"center"} style={{ margin: "24px 0px" }}>
          <img
            alt="login-logo"
            width={200}
            loading="lazy"
            src={"src/assets/images/mirket2020_Logotype-Dark.png"}
          />
        </Row>
        <Row justify={"center"} style={{ margin: "24px 0px" }}>
          <b className={"login-title"}>Enter your admin credentials</b>
        </Row>

        <Form.Item
          name={"username"}
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input placeholder="Mail" />
        </Form.Item>

        <Form.Item
          name={"password"}
          rules={[
            {
              required: true,
              message: "The password is required",
            },
          ]}
        >
          <Input.Password
            visibilityToggle={false}
            placeholder="Password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setIsFlipped("prelogin");
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name={"keepMeSignedIn"}
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox>Keep me signed in</Checkbox>
        </Form.Item>

        {loginError && errorMessage && (
          <Alert
            type="error"
            showIcon
            style={{ width: "100%", marginBottom: "15px" }}
            message={
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Space direction="vertical">
                  <strong>Failed to sign in!</strong>
                  <span>{`(${errorMessage})`}</span>
                </Space>

                <span className="forget-password" onClick={goToReset}>
                  Forget Password ?
                </span>
              </Space>
            }
          />
        )}
        {/* </animated.div> */}

        <Button
          className="login-continue"
          type="primary"
          onClick={() => {
            setIsFlipped("prelogin");
          }}
          style={{ width: "100%" }}
        >
          {"Continue"}
        </Button>
      </Card>
    </div>
  );
};
