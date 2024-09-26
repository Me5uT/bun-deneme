import { animated, useSpring } from "@react-spring/web";
import { Divider, Form, Space } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { login } from "app/shared/reducers/authentication";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PasswordResetInit from "../account/password-reset/init/password-reset-init";
import { PreLogin } from "../pre-login/PreLogin";
import { LoginForm } from "./loginForm";
import "../../shared/styles/login.css";
export const Login = () => {
  const [isFlipped, setIsFlipped] = React.useState<
    "login" | "reset" | "prelogin"
  >("login");

  const [loginInfo, setLoginInfo] = React.useState({
    username: "",
    password: "",
  });
  const [mirketCode, setMirketCode] = React.useState("");
  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated
  );
  const loginSuccess = useAppSelector(
    (state) => state.authentication.loginSuccess
  );
  const loginError = useAppSelector((state) => state.authentication.loginError);
  const location = useLocation();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const { transform, opacity } = useSpring({
    opacity: isFlipped !== "login" ? 1 : 0,
    transform: `rotateY(${isFlipped !== "login" ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const onSubmit = (v: any) => {
    dispatch(login(v.username, v.password, mirketCode, v.keepMeSignedIn));
    setMirketCode("");
  };

  React.useEffect(() => {
    if (loginError) setIsFlipped("login");
  }, [loginError]);

  if (location.pathname === "/") return <Navigate to={"/login"} />;

  const { from } = (location.state as any) || {
    from: { pathname: "/", search: location.search },
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="login-container">
      <Form
        layout="vertical"
        onFinish={onSubmit}
        form={form}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <animated.div
          style={{
            opacity: opacity.to((o) => 1 - o),
            transform,
            display: isFlipped !== "login" ? "none" : "flex",
            height: "450px",
          }}
        >
          <LoginForm
            setIsFlipped={setIsFlipped}
            mirketCode={mirketCode}
            setLoginInfo={setLoginInfo}
          />
        </animated.div>

        <animated.div
          style={{
            opacity,
            transform: transform.to((t) => `${t} rotateY(180deg)`),
            display: isFlipped === "login" ? "none" : "flex",
            height: "450px",
          }}
        >
          {isFlipped === "reset" && (
            <PasswordResetInit cardFlipped={setIsFlipped} />
          )}
          {isFlipped === "prelogin" && (
            <PreLogin setMirketCode={setMirketCode} mirketCode={mirketCode} />
          )}
        </animated.div>

        <div className="login-footer">
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <a
              href="https://mirketsecurity.com/end-user-licence-agreement/"
              rel="noreferrer"
              target="_blank"
            >
              Terms of service
            </a>
          </Space>
          <Divider />
          <Space style={{ width: "100%", justifyContent: "center" }}>
            Looking for help with your Mirket user account?
          </Space>
          <Space
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: "smaller",
            }}
          >
            <a
              style={{
                textDecoration: "underline",
              }}
              href="mailto:support@mirketsecurity.com"
            >
              Contact Support Team
            </a>
            or
            <a
              style={{
                textDecoration: "underline",
              }}
              href="https://docs.mirketsecurity.com/mirket-help-center"
              rel="noreferrer"
              target="_blank"
            >
              Check out our self-service help resources.
            </a>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default Login;
