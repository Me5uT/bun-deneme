import { Button, Card, Divider, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { ProfileCard } from 'app/shared/components/ProfileCard';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfile, AdminProfileInt, AdminTypeInt, IAdminModel, IUpdateAdminRequest } from 'app/shared/model/AdminModel';
import { ERecordType } from 'app/shared/model/tenant-setting.model';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { changeEntityStatus, deleteEntity, getEntity, resetPassword, sendVerification, updateEntity } from './admin.reducer';
import { AdminOverview } from './tabs/AdminOverview';
import { AdminSettings } from './tabs/AdminSettings';

export const AdminDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('overview');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const [form] = Form.useForm();

  const admin: IAdminModel = useAppSelector(state => state.admin.entity);
  const loading: boolean = useAppSelector(state => state.admin.loading);
  const errorMessage: string = useAppSelector(state => state.admin.errorMessage);

  const { id } = useParams<'id'>();

  const tabs: TabsProps['items'] = [
    {
      label: 'Overview',
      children: <AdminOverview />,
      key: 'overview',
    },
    {
      label: 'Settings',
      disabled: admin?.adminType === AdminTypeInt.OWNER && baseObj?.adminType !== AdminTypeInt.OWNER,
      style: {
        height: '250px',
      },
      children: <AdminSettings form={form} />,
      key: 'settings',
    },
  ];

  const onFinish = async (values: any) => {
    const serializedValues: IUpdateAdminRequest = {
      ...values,
      accountId: baseObj?.accountId,
      adminId: id,
    };
    await dispatch(updateEntity(serializedValues));
    setShowSaveButton(false);
    setResultModalOpenClose(true);
    if (admin?.adminProfile === AdminProfileInt.ReadOnly) navigate(`/${baseObj?.basePath}/administration`);
  };

  const onFormValuesChange = (changedValues: any, allValues: any) => {
    setShowSaveButton(true);
    const adminType = changedValues.adminType;
    const adminProfile = changedValues.adminProfile;

    // AdmintType owner can not be readonly, and adminProfile readonly can not be owner
    if (adminType === AdminTypeInt.OWNER) form.setFieldValue('adminProfile', AdminProfileInt.FullControl);
    if (adminProfile === AdminProfileInt.ReadOnly) form.setFieldValue('adminType', AdminTypeInt.MASTER_ADMIN);
  };

  const onDelete = async () => {
    await dispatch(deleteEntity({ adminId: id, accountId: baseObj?.accountId, onDetail: true }));
    setInfoModalOpenClose(prev => false);
    navigate(`/${baseObj?.basePath}/administration`);
  };

  React.useEffect(() => {
    dispatch(getEntity({ adminId: id, accountId: baseObj?.accountId }));
  }, []);

  if (!admin || loading) return <Spin />;

  return (
    <div className="admin-detail-overview-container" style={{ width: '100%' }}>
      <ProfileCard
        avatarColor={getColorByType(AdminTypeInt, admin?.adminType)}
        backgroundColor={getColorByType(AdminTypeInt, admin?.adminType)}
        statusIcon={admin?.verificationStatus as number}
        statusIconTooltip={Object.values(VerificationStatusInt)[admin?.verificationStatus] as string}
        description={admin?.email}
        tagText={Object.values(AdminProfileInt)[admin?.adminProfile] as string}
        title={`${admin?.firstName} ${admin?.lastName}`}
      />
      <Divider style={{ margin: '10px 0px' }} />
      <Card>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onValuesChange={onFormValuesChange} initialValues={admin}>
          <Tabs
            defaultActiveKey="overview"
            items={tabs}
            activeKey={generalTab}
            onChange={(a: string) => {
              form.resetFields();
              setShowSaveButton(false);
              setgeneralTab(a);
            }}
            tabBarExtraContent={
              <Space direction="horizontal">
                {generalTab === 'settings' && showSaveButton && (
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                )}
                <ActionsDropdown className="admin-detail-actions">
                  {admin?.verificationStatus !== VerificationStatusInt.Pending && admin?.adminType !== AdminTypeInt.OWNER && (
                    <Button
                      type="link"
                      onClick={async () => {
                        await dispatch(
                          changeEntityStatus({
                            adminId: id,
                            accountId: baseObj?.accountId,
                            status: !admin?.isActive,
                          })
                        );
                        setResultModalOpenClose(prev => true);
                      }}
                    >{`${admin?.isActive ? 'Disable' : 'Enable'}`}</Button>
                  )}
                  {admin?.adminType !== AdminTypeInt.OWNER && (
                    <Button
                      type="link"
                      onClick={async () => {
                        await dispatch(
                          sendVerification({
                            adminUid: id,
                            accountId: baseObj?.accountId,
                          })
                        );
                        setResultModalOpenClose(prev => true);
                      }}
                    >{`Send Verification`}</Button>
                  )}
                  <Button
                    type="link"
                    onClick={async () => {
                      await dispatch(resetPassword({ uid: id, recordType: ERecordType.PortalAdmin }));
                      setResultModalOpenClose(prev => true);
                    }}
                  >{`Reset Password`}</Button>
                  {admin?.adminType !== AdminTypeInt.OWNER && (
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        setInfoModalOpenClose(prev => true);
                      }}
                    >
                      {'Delete'}
                    </Button>
                  )}
                </ActionsDropdown>
              </Space>
            }
          />
        </Form>
        <Divider />
      </Card>

      <DeleteDialog
        message="If you want to delete this admin, please click on the button below."
        type="danger"
        title="Do you want to delete this admin?"
        open={infoModalOpenClose}
        okText={'DELETE'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={onDelete}
        onCancel={() => {
          setInfoModalOpenClose(prev => false);
        }}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(prev => false);
        }}
      /> */}
    </div>
  );
};
