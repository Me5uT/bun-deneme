import "../../shared/styles/modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Input, Modal, ModalProps, Space, Typography } from "antd";
import React from "react";

interface IInformationDialogProps extends ModalProps {
  type?: "danger" | "success" | "warning";
  message?: string;
  iconFade?: boolean;
  iconType?: "danger" | "success" | "warning";
  isToken?: boolean;
  setTokenValue?: (v: string) => void;
  destroyOnClose?: boolean;
}

const DeleteDialogComponent: React.FC<IInformationDialogProps> = (
  props: IInformationDialogProps
) => {
  const icon = (iconType: "danger" | "success" | "warning") => {
    switch (iconType) {
      case "danger":
        return (
          <FontAwesomeIcon
            fade={props.iconFade}
            color={"red"}
            fontSize={"35px"}
            icon="triangle-exclamation"
          />
        );
      case "success":
        return (
          <FontAwesomeIcon
            fade={props.iconFade}
            color={"green"}
            fontSize={"35px"}
            icon="triangle-exclamation"
          />
        );
      case "warning":
        return (
          <FontAwesomeIcon
            fade={props.iconFade}
            color={"darkorange"}
            fontSize={"35px"}
            icon="triangle-exclamation"
          />
        );

      default:
        return (
          <FontAwesomeIcon
            fade={props.iconFade}
            color={"red"}
            fontSize={"35px"}
            icon="triangle-exclamation"
          />
        );
    }
  };
  const handleTokenInputChange = (e: string) => {
    const value = e.replace(/\D/g, ""); // Remove any non-digit characters
    props.setTokenValue?.(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault(); // Prevent any non-numeric keypress
    }
  };
  return (
    <Modal
      {...props}
      styles={{
        header: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-start",
        },
      }}
      title={
        <Space style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          {icon(props.iconType)}
          {props?.title}
        </Space>
      }
    >
      {props.message ? (
        <Typography.Text
          style={{ textAlign: "center", zIndex: 2, padding: "20px 0px" }}
        >
          {props.message}
        </Typography.Text>
      ) : (
        props.children
      )}

      {props.isToken && (
        <Space
          className="delete-modal-input-container"
          direction="vertical"
          size={20}
          style={{ width: "100%", padding: "20px 0px" }}
        >
          <Alert
            message="Please enter your Mirket Token"
            type="info"
            showIcon
          />
          <Input.OTP
            onChange={handleTokenInputChange}
            onKeyPress={handleKeyPress}
          />
        </Space>
      )}
    </Modal>
  );
};

export const DeleteDialog = React.memo(DeleteDialogComponent);
