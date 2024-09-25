import { Button, Card, Dropdown, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { GatewayTypeInt, IGateway, IGatewayRadiusDetailModel, RadiusGatewayDownloadOption } from 'app/shared/model/gateway.model';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEntity, downloadRadiusConfig, getClientsByGateway, getEntity, updateEntity } from './gatewayRadius.reducer';
import { GatewayClients } from './tabs/GatewayClients';
import { GatewayOverview } from './tabs/GatewayOverview';
import { GatewaySettings } from './tabs/GatewaySettings';
import {
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  JavaOutlined,
  LinuxOutlined,
  WindowsFilled,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { goToDownloadRadiusGateway } from 'app/shared/util/ExportAndDownload';
import { FormDialog } from 'app/shared/components/FormDialog';
import { handleCopy } from 'app/shared/util/UtilityService';
import { ConfigModal } from './forms/ConfigModal';

export const GatewayDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('overview');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);
  const [configModalOpenClose, setConfigModalOpenClose] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const [form] = Form.useForm();

  const downloadRadiusGatewayLoading = useAppSelector(state => state.gatewayRadius.downloadRadiusGatewayLoading);
  const radiusConfigSTR = useAppSelector(state => state.gatewayRadius.radiusConfigSTR);

  const gatewayRadiusDetail: IGatewayRadiusDetailModel = useAppSelector(state => state.gatewayRadius.entity);
  const loading: boolean = useAppSelector(state => state.gatewayRadius.loading);
  const errorMessage: string = useAppSelector(state => state.gatewayRadius.errorMessage);

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
    {
      label: 'Radius Clients',
      key: 'clients',
      children: <GatewayClients />,
      disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly,
      style: {
        minHeight: '250px',
      },
    },
  ];

  const onFinish = async (values: IGateway) => {
    switch (generalTab) {
      case 'settings': {
        console.log('Received settings values of form: ', values);

        const serializedValues: IGateway = {
          ...values,
          uid: id,
          accountId: baseObj?.accountId,
          isLdapSecure: values.isLdapSecure === null && values.gatewayType === GatewayTypeInt.LDAP ? false : values.isLdapSecure,
        };
        await dispatch(updateEntity(serializedValues));
        setShowSaveButton(false);
        break;
      }

      case 'clients': {
        console.log('Received clients values of form: ', values);

        break;
      }

      default:
        console.log("Can't find tab, onFinish");
        break;
    }
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  const onDelete = async () => {
    await dispatch(deleteEntity({ uid: id, accountId: baseObj?.accountId, onDetail: true }));
    setInfoModalOpenClose(prev => false);
    navigate(`/${baseObj?.basePath}/gateway-radius`);
  };

  React.useEffect(() => {
    dispatch(getEntity({ uid: id, accountId: baseObj?.accountId }));
  }, []);

  React.useEffect(() => {
    if (id) {
      dispatch(getClientsByGateway({ gatewayId: id, accountId: baseObj?.accountId, searchtext: '' }));
    }
  }, [id]);

  if (!gatewayRadiusDetail || loading) return <Spin />;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onFieldsChange={onFieldsChange} initialValues={gatewayRadiusDetail}>
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

                  <ActionsDropdown className="gateway-detail-actions">
                    <Dropdown
                      className="test-sender-dropdown"
                      menu={{
                        items: [
                          {
                            key: 'forwindowsbutton',
                            label: (
                              <Button
                                disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly}
                                type="link"
                                icon={<WindowsFilled style={{ fontSize: 20 }} />}
                                style={{ width: '100%', justifyContent: 'start' }}
                                onClick={() => {
                                  goToDownloadRadiusGateway();
                                }}
                              >
                                {'Full Setup'}
                              </Button>
                            ),
                          },
                          {
                            key: 'forconfigbutton',
                            label: (
                              <Button
                                disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly}
                                style={{ width: '100%', justifyContent: 'start' }}
                                type="link"
                                icon={<FontAwesomeIcon icon={'gears'} style={{ fontSize: 20 }} />}
                                onClick={() => {
                                  dispatch(downloadRadiusConfig({ uid: id }));
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
                        disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly}
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
                      danger
                      loading={loading}
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
        dialogTitle={'Radius Setup Config'}
      >
        <ConfigModal />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this radius gateway, please click on the button below."
        type="danger"
        title="Do you want to delete this radius gateway?"
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
    </div>
  );
};
