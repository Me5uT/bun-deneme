import {
  Button,
  Card,
  Divider,
  Form,
  Space,
  Spin,
  Tabs,
  TabsProps,
} from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { getEntities as getSmsProvider } from "app/entities/sms-provider/sms-provider.reducer";
import { ProfileCard } from "app/shared/components/ProfileCard";
import { WarnDialog } from "app/shared/components/WarnDialog";
import useMirketPortal from "app/shared/hooks/useMirketPortal";
import { AdminProfileInt } from "app/shared/model/AdminModel";
import { IDashboardDetail } from "app/shared/model/DashboardModel";
import {
  IRequestTenantSettings,
  ITenantSetting,
} from "app/shared/model/tenant-setting.model";
import { StatusInt, TenantTypeInt } from "app/shared/model/tenant.model";
import {
  PORTAL,
  setPhoneCountryToLocal,
  setPortalToLocal,
} from "app/shared/util/LocalStorage";
import {
  convertObjectToSettingsArray,
  getColorByType,
} from "app/shared/util/UtilityService";
import React from "react";
import { getDashboardDetail } from "../dashboard/dashboard.reducer";
import { GeneralSettingsForm } from "./forms/GeneralSettingsForm";
import {
  changeRemoteSupportStatus,
  getEntities,
  updateGeneralSettings,
} from "./tenant-setting.reducer";
import { DeleteDialog } from "app/shared/components/DeleteDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ILocalStoragePortalModel } from "app/shared/model/LocalStorage.model";
import { Storage } from "app/shared/util/LocalStorage";

export const GeneralSettings: React.FC = () => {
  const [resultModalOpenClose, setResultModalOpenClose] =
    React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);
  const [remoteSupportWarnModal, setRemoteSupportWarnModal] =
    React.useState<boolean>(false);
  const [remoteSupportValue, setRemoteSupportValue] =
    React.useState<boolean>(null);

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [baseObj] = useMirketPortal();

  const tenantSettingList: ITenantSetting[] = useAppSelector(
    (state) => state.tenantSetting.entities
  );
  const tenantSettings: IRequestTenantSettings = useAppSelector(
    (state) => state.tenantSetting.tenantSettings
  );
  const dashboardDetail: IDashboardDetail = useAppSelector(
    (state) => state.dashboard.dashboardDetail
  );
  const errorMessage: string = useAppSelector(
    (state) => state.tenantSetting.errorMessage
  );
  const loading = useAppSelector((state) => state.tenantSetting.loading);
  const remoteSupportLoading = useAppSelector(
    (state) => state.tenantSetting.remoteSupportLoading
  );

  const inputsReadOnly = React.useMemo(
    () => baseObj?.adminProfile === AdminProfileInt.ReadOnly,
    [baseObj]
  );

  // localdeki portal verileri
  const portals: ILocalStoragePortalModel[] = React.useMemo(
    () => Storage.local.get(PORTAL) || [],
    [location]
  );

  // location.pathname'i içeren portal objesini bul
  const matchingPortal: ILocalStoragePortalModel | undefined = React.useMemo(
    () => portals.find((p) => location.pathname.includes(p.portal)),
    []
  );

  const tabs: TabsProps["items"] = [
    {
      label: "Settings",
      children: <GeneralSettingsForm form={form} />,
      key: "settings",
    },
  ];

  const onFinish = async (values: IRequestTenantSettings) => {
    const { passwordPolicyMinChar, regex1, regex2, ...args } = values;

    const valueObj = {
      ...args,
      passwordPolicyRegex: `${values?.passwordPolicyMinChar},${values?.regex1},${values?.regex2}`,
      defaultOtpProvider: !values?.defaultOtpProvider
        ? null
        : values?.defaultOtpProvider,
    };

    const serializedValues = {
      accountId: baseObj?.accountId,
      settings: convertObjectToSettingsArray(valueObj, tenantSettingList),
    };

    await dispatch(updateGeneralSettings(serializedValues));
    // set country code to local
    setPhoneCountryToLocal(values?.phoneCountryCode);
    setShowSaveButton(false);
    setResultModalOpenClose((prev) => true);
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  React.useEffect(() => {
    dispatch(getDashboardDetail(baseObj?.accountId));
    dispatch(getSmsProvider({ accountId: baseObj?.accountId }));
    dispatch(getEntities({ accountId: baseObj?.accountId }));
  }, []);

  React.useEffect(() => {
    if (dashboardDetail)
      setRemoteSupportValue(dashboardDetail?.tenant?.isSupportActive);
  }, [dashboardDetail]);

  React.useEffect(() => {
    form.resetFields();
  }, [tenantSettingList]);

  if (!tenantSettings || loading) return <Spin fullscreen />;

  return (
    <div style={{ width: "100%" }}>
      <ProfileCard
        avatarColor={getColorByType(TenantTypeInt, baseObj.tenantType)}
        backgroundColor={getColorByType(TenantTypeInt, baseObj.tenantType)}
        statusIcon={Object.values(StatusInt)[baseObj.tenantStatus] as StatusInt}
        description={baseObj?.domain}
        tagText={Object.values(TenantTypeInt)[baseObj?.tenantType] as string}
        title={baseObj?.fullname}
      />

      <Divider style={{ margin: "10px 0px" }} />
      <Card>
        <Form
          form={form}
          layout={"horizontal"}
          onFinish={onFinish}
          onFieldsChange={onFieldsChange}
          initialValues={{
            companyName: tenantSettings?.companyName,
            adminSetPasswordTimeoutTime:
              tenantSettings?.adminSetPasswordTimeoutTime,
            adminVerificationTimeoutTime:
              tenantSettings?.adminVerificationTimeoutTime,
            userSetPasswordTimeoutTime:
              tenantSettings?.userSetPasswordTimeoutTime,
            userVerificationTimeoutTime:
              tenantSettings?.userVerificationTimeoutTime,
            bruteForceProtectionTime: tenantSettings?.bruteForceProtectionTime,
            language: tenantSettings?.language,
            timeZone: tenantSettings?.timeZone,
            phoneCountryCode: tenantSettings?.phoneCountryCode,
            defaultOtpProvider: tenantSettings?.defaultOtpProvider,
            manuelProvision: tenantSettings?.manuelProvision,

            passwordPolicyMinChar:
              tenantSettings?.passwordPolicyRegex?.split(",")[0],
            regex1:
              tenantSettings?.passwordPolicyRegex?.split(",")[1] === "true",
            regex2:
              tenantSettings?.passwordPolicyRegex?.split(",")[2] === "true",
          }}
        >
          <Tabs
            defaultActiveKey="overview"
            items={tabs}
            tabBarExtraContent={
              <Space direction="horizontal" align="center">
                {!inputsReadOnly && showSaveButton && (
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                )}
                {/* {!inputsReadOnly && (
                  <Form.Item noStyle>
                    <Button type="default" disabled>
                      Reset to Default
                    </Button>
                  </Form.Item>
                )} */}
                {!inputsReadOnly && (
                  <Form.Item noStyle>
                    <Button
                      icon={<FontAwesomeIcon icon={"headset"} />}
                      type={
                        dashboardDetail?.tenant?.isSupportActive
                          ? "default"
                          : "primary"
                      }
                      danger={dashboardDetail?.tenant?.isSupportActive}
                      onClick={() => {
                        setRemoteSupportWarnModal((prev) => true);
                      }}
                    >
                      {`Turn ${
                        dashboardDetail?.tenant?.isSupportActive ? "Off" : "On"
                      } Remote Support`}
                    </Button>
                  </Form.Item>
                )}
              </Space>
            }
          />
        </Form>
        <Divider />
      </Card>
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(prev => false);
        }}
      /> */}

      <DeleteDialog
        message={
          dashboardDetail?.tenant?.isSupportActive
            ? `If you confirm, the Remote Support feature will be turned off and your browser tab will be close!`
            : `If you confirm, the Remote Support feature will be turned on.`
        }
        type="danger"
        title={`Are You Sure You Want to Turn ${
          dashboardDetail?.tenant?.isSupportActive ? "Off" : "On"
        } Remote Support`}
        open={remoteSupportWarnModal}
        okText={"Confirm"}
        okType={"primary"}
        iconType={"warning"}
        iconFade={true}
        confirmLoading={remoteSupportLoading}
        onOk={async () => {
          if (dashboardDetail?.tenant?.isSupportActive) {
            // remote supportu kapat ve browser tabından çık
            await dispatch(
              changeRemoteSupportStatus({
                accountId: baseObj?.accountId,
                status: false,
              })
            );
            // await dispatch(getEntities({ size: 10, page: 0, accountId: baseObj?.accountId }));
            setRemoteSupportWarnModal((prev) => false);

            if (matchingPortal) {
              const mp: ILocalStoragePortalModel = {
                ...matchingPortal,
                remoteSupport: false,
              };
              setPortalToLocal(mp);
              window.close();
            }
          } else {
            await dispatch(
              changeRemoteSupportStatus({
                accountId: baseObj?.accountId,
                status: true,
              })
            );

            setRemoteSupportWarnModal((prev) => false);
          }
        }}
        onCancel={() => {
          form.resetFields();
          setRemoteSupportWarnModal((prev) => false);
        }}
      />
    </div>
  );
};
