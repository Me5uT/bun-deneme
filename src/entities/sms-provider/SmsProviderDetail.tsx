import { Button, Card, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { ISmsProviderDetailModel, ISmsProviderUpdateRequestModel } from 'app/shared/model/sms-provider.model';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEntity, getEntity, updateEntity } from './sms-provider.reducer';
import { SmsProviderOverview } from './tabs/SmsProviderOverview';
import { SmsProviderSettings } from './tabs/SmsProviderSettings';

export const SmsProviderDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('settings');
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const smsProvider: ISmsProviderDetailModel = useAppSelector(state => state.smsProvider.entity);
  const errorMessage: string = useAppSelector(state => state.smsProvider.errorMessage);
  const loading: boolean = useAppSelector(state => state.smsProvider.loading);

  const { id } = useParams<'id'>();

  const tabs: TabsProps['items'] = [
    {
      label: 'Overview',
      key: 'overview',
      children: <SmsProviderOverview />,
    },
    {
      label: 'Settings',
      key: 'settings',
      disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly,
      style: {
        minHeight: '250px',
      },
      children: <SmsProviderSettings form={form} />,
    },
  ];

  const onFinish = async (values: ISmsProviderUpdateRequestModel) => {
    const serializedValues: ISmsProviderUpdateRequestModel = {
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
    navigate(`/${baseObj?.basePath}/sms-provider`);
  };

  React.useEffect(() => {
    dispatch(getEntity({ uid: id }));
  }, []);

  if (!smsProvider || loading) return <Spin />;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <Form
          form={form}
          layout={'horizontal'}
          onFinish={onFinish}
          autoComplete="off"
          onFieldsChange={onFieldsChange}
          initialValues={smsProvider}
        >
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
              !baseObj?.isReadOnly && (
                <Space direction="horizontal">
                  {generalTab === 'settings' && showSaveButton && !baseObj?.isReadOnly && (
                    <Form.Item noStyle>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  )}
                  <ActionsDropdown className="sms-provider-detail-actions">
                    <Button
                      type="link"
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
      <DeleteDialog
        message="If you want to delete this sms provider, please click on the button below."
        type="danger"
        title="Do you want to delete this sms provider ?"
        open={infoModalOpenClose}
        okText={'Delete'}
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
