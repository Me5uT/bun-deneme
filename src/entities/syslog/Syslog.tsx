import { Button, Card, Divider, Form, Space, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ProfileCard } from 'app/shared/components/ProfileCard';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IRequestTenantSettings, ITenantSetting } from 'app/shared/model/tenant-setting.model';
import { StatusInt, TenantTypeInt } from 'app/shared/model/tenant.model';
import { convertObjectToSettingsArray, getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { SyslogSettingsForm } from './forms/SyslogSettingsForm';
import { getEntities, updateGeneralSettings, updateSyslog } from '../tenant-setting/tenant-setting.reducer';

export const Syslog: React.FC = () => {
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [baseObj] = useMirketPortal();
  const tenantSettingList: ITenantSetting[] = useAppSelector(state => state.tenantSetting.entities);
  const errorMessage: string = useAppSelector(state => state.tenantSetting.errorMessage);

  const tabs: TabsProps['items'] = [
    {
      label: 'Settings',
      children: <SyslogSettingsForm form={form} />,
      key: 'settings',
    },
  ];

  const onFinish = async (values: IRequestTenantSettings) => {
    console.log('🚀 ~ onFinish ~ values:', values);

    const serializedValues = {
      accountId: baseObj?.accountId,
      settings: convertObjectToSettingsArray(values, tenantSettingList),
    };

    await dispatch(updateSyslog(serializedValues));
    setShowSaveButton(false);
    setResultModalOpenClose(prev => true);
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId }));
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <ProfileCard
        avatarColor={getColorByType(TenantTypeInt, baseObj.tenantType)}
        backgroundColor={getColorByType(TenantTypeInt, baseObj.tenantType)}
        statusIcon={Object.values(StatusInt)[baseObj.tenantStatus] as StatusInt}
        description={baseObj?.domain}
        tagText={Object.values(TenantTypeInt)[baseObj?.tenantType] as string}
        title={baseObj?.fullname}
      />
      <Divider style={{ margin: '10px 0px' }} />
      <Card>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onFieldsChange={onFieldsChange}>
          <Tabs
            defaultActiveKey="overview"
            items={tabs}
            tabBarExtraContent={
              <Space direction="horizontal">
                {showSaveButton && (
                  <Form.Item noStyle>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                )}

                {/* <Form.Item noStyle>
                  <Button type="default" disabled>
                    Reset to Default
                  </Button>
                </Form.Item> */}
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
    </div>
  );
};
