import { Button, Card, Divider, Form, Space, Spin, Tabs, TabsProps, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { ProfileCard } from 'app/shared/components/ProfileCard';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { systemSettings } from 'app/shared/mockdata/SystemSettings';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { ILocalStoragePortalModel } from 'app/shared/model/LocalStorage.model';
import { ITenantDetail, IUpdateAccount, LicenceTypeInt, TenantStatusInt, TenantTypeInt } from 'app/shared/model/tenant.model';
import { setPortalToLocal } from 'app/shared/util/LocalStorage';
import { getColorByType, openNewTab } from 'app/shared/util/UtilityService';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  changeEntityOwner,
  changeEntityStatus,
  deleteEntity,
  getEntity,
  resendSetPassword,
  resendVerification,
  updateEntityLicence,
  updatePartner,
} from './account.reducer';
import { AccountOverview } from './tabs/AccountOverview';
import { AccountSettings } from './tabs/AccountSettings';

export const AccountDetail = () => {
  const [settingTabs, setsettingTabs] = React.useState('licencesettings');
  const [mirketToken, setMirketToken] = React.useState<string>('');
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const [accountDetailStates, setAccoutDetailStates] = React.useState({
    generalTab: 'overview',
    infoModalOpenClose: false,
    resultModalOpenClose: false,
    infoModalHasMirketToken: false,
    infoModalMessage: '',
    infoModalTitle: '',
    infoModalConfirmButtonText: 'OK',
    infoModalType: 'success',
    infoModalConfirm() {},
  });

  const [form] = Form.useForm();
  const [baseObj] = useMirketPortal();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const tenant: ITenantDetail = useAppSelector(state => state.account.entity);
  const loading: boolean = useAppSelector(state => state.account.loading);
  const errorMessage: string = useAppSelector(state => state.account.errorMessage);

  const { id } = useParams<'id'>();
  const tabs: TabsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Overview',
        children: <AccountOverview />,
        key: 'overview',
      },
      {
        label: 'Settings',
        children: (
          <AccountSettings
            setShowSaveButton={setShowSaveButton}
            setsettingTabs={setsettingTabs}
            form={form}
            selectedSettingTab={settingTabs}
          />
        ),
        disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly || baseObj?.tenantType === TenantTypeInt.PARTNER,
        key: 'settings',
      },
    ],
    [tenant, settingTabs]
  );

  const onResendVerification = async () => {
    await dispatch(resendVerification(id));
    setAccoutDetailStates(prev => ({
      ...prev,
      infoModalConfirm() {},
      infoModalOpenClose: false,
    }));
  };

  const onResetPassword = async () => {
    await dispatch(resendSetPassword(id));
    setAccoutDetailStates(prev => ({
      ...prev,
      infoModalConfirm() {},
      infoModalOpenClose: false,
    }));
  };

  const onFinish = async (values: IUpdateAccount) => {
    switch (settingTabs) {
      case 'licencesettings': {
        const serializedValues = {
          ...values,
          accountId: tenant?.tenant?.uid,
          expireDate: dayjs(values.expireDate).valueOf(),
        };
        await dispatch(updateEntityLicence(serializedValues));
        setAccoutDetailStates(prev => ({ ...prev, resultModalOpenClose: true }));
        setShowSaveButton(false);
        form.resetFields();
        setsettingTabs('licencesettings');
        break;
      }

      case 'ownersettings': {
        const serializedValues = {
          ...values,
          accountId: tenant?.tenant?.uid,
        };

        await dispatch(changeEntityOwner(serializedValues));
        setAccoutDetailStates(prev => ({ ...prev, resultModalOpenClose: true }));
        setShowSaveButton(false);
        form.resetFields();
        setsettingTabs('ownersettings');
        break;
      }

      case 'partner': {
        const serializedValues = {
          uid: tenant?.tenant?.uid,
          partnerId: values?.partnerId,
        };

        await dispatch(updatePartner(serializedValues));
        setAccoutDetailStates(prev => ({ ...prev, resultModalOpenClose: true }));
        setShowSaveButton(false);
        form.resetFields();
        setsettingTabs('partner');
        break;
      }
      default:
        console.log("Can't find tab, onFinish");
        break;
    }
  };

  const onDelete = async () => {
    const a = await dispatch(deleteEntity({ id: tenant.tenant.uid, mirketToken, onDetail: true }));
    if (a.type.includes('rejected')) {
      setAccoutDetailStates(prev => ({ ...prev, infoModalOpenClose: false }));
    } else {
      setAccoutDetailStates(prev => ({ ...prev, infoModalOpenClose: false }));
      navigate(`/${baseObj?.basePath}/accounts`);
    }
  };

  const onFormValuesChange = (changedValues: any, allValues: any) => {
    setShowSaveButton(true);
    const licenceType = changedValues.licenceType;
    if (licenceType === LicenceTypeInt.Demo) {
      form.setFieldsValue({ expireDate: dayjs().add(systemSettings.demo_values.expire_days, 'day'), licenceCount: 5 });
    }
  };

  React.useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  if (!tenant || loading) return <Spin />;

  return (
    <div className="account-detail-container" style={{ width: '100%' }}>
      <ProfileCard
        avatarColor={getColorByType(TenantTypeInt, tenant?.tenant?.tenantType)}
        backgroundColor={getColorByType(TenantTypeInt, tenant?.tenant?.tenantType)}
        statusIcon={tenant?.tenant?.tenantStatus as any}
        statusIconTooltip={Object.values(TenantStatusInt)[tenant?.tenant?.tenantStatus] as string}
        description={tenant?.ownerAdmin?.email}
        tagText={tenant?.tenant?.alias}
        title={tenant?.tenant?.name}
      />

      <Divider style={{ margin: '10px 0px' }} />
      <Card loading={loading || !tenant}>
        <Form
          form={form}
          layout={'horizontal'}
          onFinish={onFinish}
          onValuesChange={onFormValuesChange}
          initialValues={{
            licenceType: tenant?.licenceHistory?.licenceType,
            licenceCount: tenant?.licenceHistory?.totalUser,
            expireDate: dayjs(tenant?.licenceHistory?.expireDate),
            mentis: tenant?.tenant?.mentis,
            mail: tenant?.ownerAdmin?.email,
            partnerId: tenant?.tenant?.partnerId,
          }}
        >
          <Tabs
            defaultActiveKey="overview"
            activeKey={accountDetailStates?.generalTab}
            onChange={(a: string) => {
              form.resetFields();
              setShowSaveButton(false);
              setAccoutDetailStates(prev => ({ ...prev, generalTab: a }));
            }}
            items={tabs}
            tabBarExtraContent={
              <Space direction="horizontal">
                {(accountDetailStates?.generalTab === 'settings' || accountDetailStates?.generalTab === 'owner') && showSaveButton && (
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                )}
                <ActionsDropdown className="account-detail-actions">
                  {baseObj?.adminProfile === AdminProfileInt.FullControl && (
                    <Button
                      type="link"
                      onClick={() => {
                        setAccoutDetailStates(prev => ({
                          ...prev,
                          infoModalOpenClose: true,
                          infoModalMessage: 'If you want to send resend verification, please click on the button below.',
                          infoModalHasMirketToken: false,
                          infoModalTitle: 'Are you sure to Resend Verification?',
                          infoModalType: 'success',
                          infoModalConfirmButtonText: 'OK',
                          infoModalConfirm() {
                            onResendVerification();
                          },
                        }));
                      }}
                    >
                      {'Resend Verification'}
                    </Button>
                  )}
                  {baseObj?.adminProfile === AdminProfileInt.FullControl && (
                    <Button
                      type="link"
                      onClick={() => {
                        setAccoutDetailStates(prev => ({
                          ...prev,
                          infoModalOpenClose: true,
                          infoModalMessage: 'If you want to set password, please click on the button below.',
                          infoModalHasMirketToken: false,
                          infoModalTitle: 'Are you sure to Set Password?',
                          infoModalType: 'success',
                          infoModalConfirmButtonText: 'OK',
                          infoModalConfirm() {
                            onResetPassword();
                          },
                        }));
                      }}
                    >
                      {'Set Password'}
                    </Button>
                  )}
                  <Tooltip title={!tenant?.tenant?.isSupportActive && "This account's Remote Support is off!"}>
                    <Button
                      type="link"
                      disabled={!tenant?.tenant?.isSupportActive}
                      onClick={() => {
                        setPortalToLocal({
                          portal: tenant?.tenant?.alias,
                          portalId: tenant?.tenant?.uid,
                          domain: tenant?.tenant?.domain,
                          tenantType: tenant?.tenant?.tenantType,
                          tenantStatus: tenant?.tenant?.tenantStatus,
                          expireDate: tenant?.licenceHistory?.expireDate,
                          licenceType: tenant?.licenceHistory?.licenceType,
                          licenceStatus: tenant?.licenceHistory?.licenceStatus,
                          licenceCount: tenant?.licenceHistory?.totalUser,
                          licenceUsage: tenant?.licenceHistory?.usedTotalUser,
                          tenantName: tenant?.tenant?.name,
                          adminProfile: tenant?.ownerAdmin?.adminProfile,
                          adminType: tenant?.ownerAdmin?.adminType,
                          remoteSupport: tenant?.tenant?.isSupportActive,
                          mentis: tenant?.tenant?.mentis,
                        } as ILocalStoragePortalModel);
                        openNewTab(`/${tenant?.tenant?.alias}`);
                      }}
                    >
                      {'Go to Portal'}
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={tenant?.tenant?.tenantStatus === TenantStatusInt.Pending && 'Can not change status when account is pending !'}
                  >
                    <Button
                      type="link"
                      disabled={tenant?.tenant?.tenantStatus === TenantStatusInt.Pending}
                      onClick={async () => {
                        const status = tenant?.tenant?.tenantStatus === TenantStatusInt.Active ? false : true;
                        await dispatch(
                          changeEntityStatus({
                            accountId: tenant?.tenant?.uid,
                            status,
                          })
                        );
                        setAccoutDetailStates(prev => ({ ...prev, resultModalOpenClose: true }));
                      }}
                    >{`${tenant?.tenant?.tenantStatus === TenantStatusInt.Active ? 'Disable' : 'Enable'}`}</Button>
                  </Tooltip>
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      setAccoutDetailStates(prev => ({
                        ...prev,
                        infoModalOpenClose: true,
                        infoModalMessage: 'If you want to delete this accout, please click on the button below.',
                        infoModalHasMirketToken: true,
                        infoModalTitle: 'Are you sure to Delete This Account?',
                        infoModalType: 'error',
                        infoModalConfirmButtonText: 'DELETE',
                        infoModalConfirm() {
                          onDelete();
                        },
                      }));
                    }}
                  >
                    {'Delete'}
                  </Button>
                </ActionsDropdown>
              </Space>
            }
          />
        </Form>
        <Divider />
      </Card>
      <DeleteDialog
        destroyOnClose
        message={accountDetailStates?.infoModalMessage}
        type={accountDetailStates?.infoModalType as any}
        title={accountDetailStates?.infoModalTitle}
        open={accountDetailStates?.infoModalOpenClose}
        okText={accountDetailStates?.infoModalConfirmButtonText}
        okType={accountDetailStates?.infoModalType === 'error' ? 'danger' : 'primary'}
        isToken={accountDetailStates?.infoModalHasMirketToken}
        setTokenValue={setMirketToken}
        iconFade={true}
        confirmLoading={loading}
        onOk={accountDetailStates?.infoModalConfirm}
        onCancel={() => {
          setAccoutDetailStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={accountDetailStates?.resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setAccoutDetailStates(prev => ({ ...prev, resultModalOpenClose: false }));
        }}
      /> */}
    </div>
  );
};
