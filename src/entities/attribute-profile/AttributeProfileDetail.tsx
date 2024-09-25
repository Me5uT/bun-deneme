import { Button, Card, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { IAttributeProfile, ILdapProfileUpdateRequest } from 'app/shared/model/AttributeProfile.model';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEntity, getEntity, updateEntity } from './attributeProfile.reducer';
import { AttributeProfileOverview } from './tabs/AttributeProfileOverview';
import { LdapProfileSettings } from './tabs/AttributeProfileSettings';

export const AttributeProfileDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('settings');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const [form] = Form.useForm();

  const attributeProfile: IAttributeProfile = useAppSelector(state => state.attributeProfile.entity);
  const loading: boolean = useAppSelector(state => state.attributeProfile.loading);
  const errorMessage: string = useAppSelector(state => state.attributeProfile.errorMessage);

  const { id } = useParams<'id'>();

  const tabs: TabsProps['items'] = [
    {
      label: 'Overview',
      key: 'overview',
      children: <AttributeProfileOverview />,
    },
    {
      label: 'Settings',
      key: 'settings',
      children: <LdapProfileSettings form={form} />,
      disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly,
      style: {
        minHeight: '250px',
      },
    },
  ];

  const onFinish = async (values: any) => {
    const serializedValues: IAttributeProfile = {
      ...values,
      uid: id,
      accountId: baseObj?.accountId,
    };
    await dispatch(updateEntity(serializedValues));
    setShowSaveButton(false);
    setResultModalOpenClose(true);
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  const onDelete = async () => {
    await dispatch(deleteEntity({ attrId: id, accountId: baseObj?.accountId, onDetail: true }));
    setInfoModalOpenClose(prev => false);
    navigate(`/${baseObj?.basePath}/attribute-profile`);
  };

  React.useEffect(() => {
    dispatch(getEntity({ uid: id, accountId: baseObj?.accountId }));
  }, []);

  if (!attributeProfile || loading) return <Spin />;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onFieldsChange={onFieldsChange} initialValues={attributeProfile}>
          <Tabs
            defaultActiveKey="overview"
            items={tabs}
            destroyInactiveTabPane
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
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  )}
                  <ActionsDropdown className="attribute-detail-actions">
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
        message="If you want to delete this attribute profile, please click on the button below."
        type="danger"
        title="Do you  want to delete this attribute profile ?"
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
