import { useSetState } from 'ahooks';
import { Button, Card, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { ESyncPeriod, IExternalSourceEditModel, IExternalSourceModel } from 'app/shared/model/externalSourceModel';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  changeEntityStatus,
  deleteEntity,
  getEntity,
  getLdapGatewayList,
  syncExternalSource,
  updateEntity,
} from './externalSource.reducer';
import { ExternalSourceOverview } from './tabs/ExternalSourceOverview';
import { ExternalSourceSettings } from './tabs/ExternalSourceSettings';

export const ExternalSourceDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('settings');
  const [modalOpenClose, setModalOpenClose] = useSetState<any>({
    infoModalOpenClose: false,
    resultModalOpenClose: false,
  });
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();
  const navigate = useNavigate();

  const externalSourceDetail: IExternalSourceModel = useAppSelector(state => state.externalSource.entity);
  const loading: boolean = useAppSelector(state => state.externalSource.loading);
  const syncExternalSourceLoading: boolean = useAppSelector(state => state.externalSource.syncExternalSourceLoading);
  const errorMessage: string = useAppSelector(state => state.externalSource.errorMessage);

  const { id } = useParams<'id'>();

  const tabs: TabsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Overview',
        children: <ExternalSourceOverview />,
        key: 'overview',
      },
      {
        label: 'Settings',
        children: <ExternalSourceSettings form={form} />,
        key: 'settings',
      },
    ],
    [externalSourceDetail]
  );

  const onFinish = async (values: IExternalSourceEditModel) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    const serializedValues: IExternalSourceEditModel = {
      ...values,
      uid: id,
      isSyncManuel: values?.syncPeriod === ESyncPeriod.ONDEMAND,
    };

    await dispatch(updateEntity(serializedValues));
    setShowSaveButton(false);
    setModalOpenClose(prev => ({ ...prev, resultModalOpenClose: true }));
  };

  const onDelete = async () => {
    await dispatch(deleteEntity({ uid: id, accountId: baseObj?.accountId, onDetail: true }));
    setModalOpenClose(prev => ({ ...prev, infoModalOpenClose: false }));
    navigate(`/${baseObj?.basePath}/external-source`);
  };

  const onFieldsChange = () => {
    setShowSaveButton(prev => true);
  };

  React.useEffect(() => {
    dispatch(getEntity({ groupId: id }));
  }, []);

  if (!externalSourceDetail || loading) return <Spin />;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <Form
          form={form}
          layout={'horizontal'}
          onValuesChange={onFieldsChange}
          onFinish={onFinish}
          initialValues={{ ...externalSourceDetail, attributeUid: externalSourceDetail?.attribute?.uid }}
        >
          <Tabs
            defaultActiveKey="overview"
            items={tabs}
            onChange={(a: string) => {
              form.resetFields();
              setShowSaveButton(prev => false);
              setgeneralTab(a);
            }}
            activeKey={generalTab}
            tabBarExtraContent={
              !baseObj?.isReadOnly && (
                <Space direction="horizontal">
                  {generalTab === 'settings' && !baseObj?.isReadOnly && showSaveButton && (
                    <Form.Item noStyle>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Save
                      </Button>
                    </Form.Item>
                  )}

                  {!baseObj?.isReadOnly && (
                    <ActionsDropdown className="external-source-detail-actions">
                      <Button
                        type="link"
                        loading={syncExternalSourceLoading}
                        onClick={() => {
                          dispatch(
                            syncExternalSource({
                              accountId: baseObj?.accountId,
                              externalSourceId: id,
                              onDetail: true,
                            })
                          );
                        }}
                      >
                        {'Sync'}
                      </Button>
                      <Button
                        type="link"
                        loading={loading}
                        onClick={() => {
                          navigate(`/${baseObj?.basePath}/external-source/report`, { state: { uid: id } });
                        }}
                      >
                        {'Report'}
                      </Button>
                      <Button
                        type="link"
                        danger
                        loading={loading}
                        onClick={() => {
                          setModalOpenClose(prev => ({ ...prev, infoModalOpenClose: true }));
                        }}
                      >
                        {'Delete'}
                      </Button>
                    </ActionsDropdown>
                  )}
                </Space>
              )
            }
          />
        </Form>
      </Card>
      <DeleteDialog
        message="If you want to delete this account, please click on the button below."
        type="danger"
        title="Do you  want to delete this account?"
        open={modalOpenClose?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={onDelete}
        onCancel={() => setModalOpenClose(prev => ({ ...prev, infoModalOpenClose: false }))}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={modalOpenClose?.resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setModalOpenClose(prev => ({ ...prev, resultModalOpenClose: false }));
        }}
      /> */}
    </div>
  );
};
