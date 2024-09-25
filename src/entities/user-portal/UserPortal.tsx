import { Button, Card, Checkbox, Form, Space, Switch, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import { useAppDispatch, useAppSelector } from "app/config/store";
import React from "react";
import { getEntities, updateEntity } from "./useerportal.reducer";
import { getEntities as getGeneralSettings } from "../tenant-setting/tenant-setting.reducer";
import useMirketPortal from "app/shared/hooks/useMirketPortal";
import { deserializeEnableMfaList } from "app/shared/util/UtilityService";
import { IRequestTenantSettings } from "app/shared/model/tenant-setting.model";

interface IFieldParams {
  errors: string[];
  name: [string];
  touched: boolean;
  validated: boolean;
  validating: boolean;
  value: boolean;
  warnings: string[];
}

const findRelatedEnableValue = (array, defaultName) => {
  const enableName = defaultName.replace("Default", "Enable");
  const enableItem = array.find((item) => item.name === enableName);
  return enableItem?.value;
};

const findRelatedDefaultValue = (array, defaultName) => {
  const enableName = defaultName.replace("Enable", "Default");
  const enableItem = array.find((item) => item.name === enableName);
  return enableItem?.value;
};

export const UserPortal: React.FC = () => {
  const [canSave, setCanSave] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const [form] = Form.useForm();
  const isOtpEnable = Form.useWatch("isOtpEnable", form);
  const isPushEnable = Form.useWatch("isPushEnable", form);
  const isSmsEnable = Form.useWatch("isSmsEnable", form);
  const isTokenEnable = Form.useWatch("isTokenEnable", form);
  const isTotpEnable = Form.useWatch("isTotpEnable", form);

  const tenantSettings: IRequestTenantSettings = useAppSelector(
    (state) => state.tenantSetting.tenantSettings
  );
  const enableMfaMethods = useAppSelector(
    (state) => state.userportal.enableMfaMethods
  );
  const loading = useAppSelector((state) => state.userportal.loading);

  const onFieldsChange = (
    changedFields: IFieldParams[],
    allFields: IFieldParams[]
  ) => {
    setCanSave(true);
    const { name, value } = changedFields[0];
    const allFieldsValues = allFields.map((af) => ({
      name: af.name[0],
      value: af.value,
    }));
    const anyEnable = allFields.some(
      (af) => af.name[0].includes("Enable") && af.value === true
    );

    switch (true) {
      // değişen enable ise en az 1 enable olmak zorunda
      case !anyEnable && name[0].includes("Enable"):
        form.setFieldsValue({ ...allFieldsValues, [name[0]]: true });
        break;

      // değişen default ise ve enable özelliği açık olmak zorunda ve diğer defaultları kapatır
      case findRelatedEnableValue(allFieldsValues, name[0]) &&
        name[0].includes("Default"):
        form.setFieldsValue({
          ...allFieldsValues,
          isOtpDefault: false,
          isPushDefault: false,
          isSmsDefault: false,
          isTokenDefault: false,
          isTotpDefault: false,
          [name[0]]: true,
        });
        break;

      // değişen enable ise ve defaultu false ise enable özelliği değiştirilebilir
      case anyEnable &&
        name[0].includes("Enable") &&
        !findRelatedDefaultValue(allFieldsValues, name[0]):
        form.setFieldsValue({ ...allFieldsValues, [name[0]]: value });
        break;

      // değişiklik yapma
      default:
        form.setFieldsValue({ ...allFieldsValues, [name[0]]: !value });
        break;
    }
  };

  const onFinish = () => {
    setCanSave(false);

    const v = form.getFieldsValue();
    const serializedValues = deserializeEnableMfaList(v);
    dispatch(
      updateEntity({
        enableMfaMethods: serializedValues,
        tenantId: baseObj?.accountId,
      })
    );
  };

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId }));
    dispatch(getGeneralSettings({ accountId: baseObj?.accountId }));
  }, []);

  console.log(
    "tenantSettings?.defaultOtpProvider",
    tenantSettings?.defaultOtpProvider
  );

  return (
    <Card
      loading={loading}
      style={{ minHeight: "100%", minWidth: "100%" }}
      title={"MFA Methods"}
      extra={
        canSave && (
          <Button type="primary" onClick={onFinish}>
            Save
          </Button>
        )
      }
    >
      <Form
        form={form}
        initialValues={enableMfaMethods}
        onFieldsChange={onFieldsChange}
      >
        <Space
          wrap
          direction="horizontal"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Card
            hoverable
            styles={{
              body: {
                width: 210,
              },
            }}
            style={{ margin: 10, padding: 10, opacity: isOtpEnable ? 1 : 0.3 }}
            actions={[
              <Form.Item
                style={{ fontWeight: "bold", marginBottom: "-10px" }}
                key={"mirtketotpisenable"}
                label={"Enable"}
                name={"isOtpEnable"}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>,
              <Form.Item
                style={{
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  marginBottom: "-10px",
                }}
                key={"mirtketotpisdefault"}
                valuePropName="checked"
                label={"Default"}
                name={"isOtpDefault"}
              >
                <Checkbox disabled={!isOtpEnable} />
              </Form.Item>,
            ]}
          >
            <Space
              direction="vertical"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                width={140}
                alt="example"
                loading="lazy"
                src={"src/assets/images/mirketOTP1.png"}
              />
              <Meta title="Mirket OTP" style={{ textAlign: "center" }} />
            </Space>
          </Card>
          <Card
            hoverable
            styles={{
              body: {
                width: 210,
              },
            }}
            style={{
              margin: 10,
              padding: 10,
              opacity: isPushEnable ? 1 : 0.3,
            }}
            actions={[
              <Form.Item
                style={{ fontWeight: "bold", marginBottom: "-10px" }}
                key={"mirtketpushisenable"}
                label={"Enable"}
                name={"isPushEnable"}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>,
              <Form.Item
                style={{
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  marginBottom: "-10px",
                }}
                key={"mirtketpushisdefault"}
                valuePropName="checked"
                label={"Default"}
                name={"isPushDefault"}
              >
                <Checkbox disabled={!isPushEnable} />
              </Form.Item>,
            ]}
          >
            <Space
              direction="vertical"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                width={140}
                alt="example"
                loading="lazy"
                src={"src/assets/images/mirketPush1.png"}
              />
              <Meta
                title="Mirket Push Notification"
                style={{ textAlign: "center" }}
              />
            </Space>
          </Card>
          <Card
            styles={{
              body: {
                width: 210,
              },
            }}
            hoverable
            style={{
              margin: 10,
              padding: 10,
              opacity:
                !isSmsEnable || !tenantSettings?.defaultOtpProvider ? 0.3 : 1,
            }}
            actions={[
              <Tooltip
                key={"smsisenabletooltip"}
                title={
                  !tenantSettings?.defaultOtpProvider &&
                  "You Need Default SMS Provider! You Can Set One on General Settings."
                }
              >
                <Form.Item
                  style={{ fontWeight: "bold", marginBottom: "-10px" }}
                  key={"smsisenable"}
                  label={"Enable"}
                  name={"isSmsEnable"}
                  valuePropName="checked"
                >
                  <Switch disabled={!tenantSettings?.defaultOtpProvider} />
                </Form.Item>
              </Tooltip>,
              <Form.Item
                style={{
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  marginBottom: "-10px",
                }}
                key={"smsisdefault"}
                label={"Default"}
                valuePropName="checked"
                name={"isSmsDefault"}
              >
                <Checkbox disabled={!isSmsEnable} />
              </Form.Item>,
            ]}
          >
            <Space
              direction="vertical"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                width={140}
                alt="example"
                loading="lazy"
                src={"src/assets/images/mirketSMS1.png"}
              />
              <Meta title="SMS" style={{ textAlign: "center" }} />
            </Space>
          </Card>
          <Card
            styles={{
              body: {
                width: 210,
              },
            }}
            hoverable
            style={{
              margin: 10,
              padding: 10,
              opacity: isTokenEnable ? 1 : 0.3,
            }}
            actions={[
              <Form.Item
                style={{ fontWeight: "bold", marginBottom: "-10px" }}
                key={"mirtkettokenisenable"}
                label={"Enable"}
                name={"isTokenEnable"}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>,
              <Form.Item
                style={{
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  marginBottom: "-10px",
                }}
                key={"mirtketotpisdefault"}
                label={"Default"}
                valuePropName="checked"
                name={"isTokenDefault"}
              >
                <Checkbox disabled={!isTokenEnable} />
              </Form.Item>,
            ]}
          >
            <Space
              direction="vertical"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                width={140}
                alt="example"
                loading="lazy"
                src={"src/assets/images/mirketToken1.png"}
              />
              <Meta title="Mirket Token" style={{ textAlign: "center" }} />
            </Space>
          </Card>
          <Card
            styles={{
              body: {
                width: 210,
              },
            }}
            hoverable
            style={{ margin: 10, padding: 10, opacity: isTotpEnable ? 1 : 0.3 }}
            actions={[
              <Form.Item
                style={{ fontWeight: "bold", marginBottom: "-10px" }}
                key={"mirtkettotpisenable"}
                label={"Enable"}
                name={"isTotpEnable"}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>,
              <Form.Item
                style={{
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  marginBottom: "-10px",
                }}
                key={"mirtketotpisdefault"}
                label={"Default"}
                valuePropName="checked"
                name={"isTotpDefault"}
              >
                <Checkbox disabled={!isTotpEnable} />
              </Form.Item>,
            ]}
          >
            <Space
              direction="vertical"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                width={140}
                alt="example"
                loading="lazy"
                src={"src/assets/images/mirketTOTP1.png"}
              />
              <Meta title="Mirket TOTP" style={{ textAlign: "center" }} />
            </Space>
          </Card>
        </Space>
      </Form>
    </Card>
  );
};
