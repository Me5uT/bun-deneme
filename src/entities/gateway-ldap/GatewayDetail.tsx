import { Button, Card, Dropdown, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { IGatewayLDAPDetailModel, LDAPGatewayDownloadOption } from 'app/shared/model/gateway.model';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEntity, downloadLDAPGateway, getEntity, updateEntity } from './gatewayLdap.reducer';
import { GatewayOverview } from './tabs/GatewayOverview';
import { GatewaySettings } from './tabs/GatewaySettings';
import useFirstRender from 'app/shared/hooks/useInitialRender';
import { CopyOutlined, DeleteOutlined, DownloadOutlined, WindowsFilled } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { goToDownloadLDAPGateway } from 'app/shared/util/ExportAndDownload';
import { FormDialog } from 'app/shared/components/FormDialog';
import { ConfigModal } from './forms/ConfigModal';
import { handleCopy } from 'app/shared/util/UtilityService';

export const GatewayDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('overview');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);
  const [configModalOpenClose, setConfigModalOpenClose] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const [form] = Form.useForm();

  const gatewayLdapDetail: IGatewayLDAPDetailModel = useAppSelector(state => state.gatewayLdap.entity);
  const loading: boolean = useAppSelector(state => state.gatewayLdap.loading);
  const errorMessage: string = useAppSelector(state => state.gatewayLdap.errorMessage);
  const downloadRadiusGatewayLoading = useAppSelector(state => state.gatewayLdap.downloadRadiusGatewayLoading);
  const radiusConfigSTR = useAppSelector(state => state.gatewayLdap.radiusConfigSTR);

  const { id } = useParams<'id'>();

  const tabs: TabsProps['items'] = [
    {
      label: 'Overview',
      key: 'overview',
      children: <GatewayOverview />,
    },
    {
      label: 'Settings',
      key: 'settings',
      children: <GatewaySettings form={form} />,
      disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly,
      style: {
        minHeight: '250px',
      },
    },
  ];

  const onFinish = async (values: IGatewayLDAPDetailModel) => {
    const serializedValues: IGatewayLDAPDetailModel = {
      ...values,
      uid: id,
    };
    await dispatch(updateEntity(serializedValues));
    setShowSaveButton(false);
    setResultModalOpenClose(true);
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  const onDelete = async () => {
    await dispatch(deleteEntity({ uid: id, accountId: baseObj?.accountId, onDetail: true }));
    setInfoModalOpenClose(prev => false);
    navigate(`/${baseObj?.basePath}/gateway-ldap`);
  };

  React.useEffect(() => {
    dispatch(getEntity({ uid: id, accountId: baseObj?.accountId }));
  }, []);

  if (!gatewayLdapDetail || loading) return <Spin fullscreen />;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onFieldsChange={onFieldsChange} initialValues={gatewayLdapDetail}>
          <Tabs
            defaultActiveKey="overview"
            items={tabs}
            onChange={(a: string) => {
              form.resetFields();
              setShowSaveButton(false);
              setgeneralTab(a);
            }}
            activeKey={generalTab}
            tabBarExtraContent={
              !baseObj?.isReadOnly && (
                <Space direction="horizontal">
                  {generalTab === 'settings' && showSaveButton && !baseObj?.isReadOnly && (
                    <Form.Item noStyle>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Save
                      </Button>
                    </Form.Item>
                  )}
                  <ActionsDropdown className="gateway-detail-actions" trigger={['click']}>
                    <Dropdown
                      className="test-sender-dropdown"
                      menu={{
                        items: [
                          {
                            key: 'forwindowsbutton',
                            label: (
                              <Button
                                type="link"
                                icon={<WindowsFilled style={{ fontSize: 20 }} />}
                                style={{ width: '100%', justifyContent: 'start' }}
                                onClick={() => {
                                  goToDownloadLDAPGateway();
                                }}
                              >
                                {'Full'}
                              </Button>
                            ),
                          },

                          {
                            key: 'forconfigbutton',
                            label: (
                              <Button
                                style={{ width: '100%', justifyContent: 'start' }}
                                icon={<FontAwesomeIcon icon={'gears'} style={{ fontSize: 20 }} />}
                                type="link"
                                onClick={() => {
                                  dispatch(
                                    downloadLDAPGateway({
                                      uid: id,
                                      ldapGatewayDownloadOption: LDAPGatewayDownloadOption.CONFIG,
                                    })
                                  );
                                  setConfigModalOpenClose(true);
                                }}
                              >
                                {'Config'}
                              </Button>
                            ),
                          },
                        ],
                      }}
                      trigger={['hover']}
                      placement="bottomLeft"
                    >
                      <Button
                        icon={<DownloadOutlined />}
                        type="link"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        {'Download'}
                      </Button>
                    </Dropdown>
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      loading={loading}
                      danger
                      onClick={() => {
                        setInfoModalOpenClose(prev => true);
                      }}
                    >
                      {'Delete'}
                    </Button>
                  </ActionsDropdown>
                </Space>
              )
            }
          />
        </Form>
      </Card>
      <FormDialog
        closeIcon
        destroyOnClose
        loading={downloadRadiusGatewayLoading}
        open={configModalOpenClose}
        onClose={() => {
          setConfigModalOpenClose(prev => false);
        }}
        styles={{ body: { height: 'auto' } }}
        maxWidth={800}
        footer={
          <Button type="primary" icon={<CopyOutlined />} block onClick={() => handleCopy(radiusConfigSTR)}>
            COPY
          </Button>
        }
        dialogTitle={'LDAP Setup Config'}
      >
        <ConfigModal />
      </FormDialog>
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
