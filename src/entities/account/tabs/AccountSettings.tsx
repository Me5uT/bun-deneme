import type { FormInstance, TabsProps } from 'antd';
import { Tabs } from 'antd';
import React from 'react';
import { AccountOwner } from './setting-tabs/AccountOwner';
import { LicenseForm } from './setting-tabs/LicenseForm';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ITenantDetail, TenantTypeInt } from 'app/shared/model/tenant.model';
import { Partner } from './setting-tabs/Partner';
import { useAppSelector } from 'app/config/store';
interface IAccountSettingsProps {
  setsettingTabs: React.Dispatch<React.SetStateAction<string>>;
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSettingTab: string;
  form: FormInstance<any>;
}
export const AccountSettings: React.FC<IAccountSettingsProps> = ({ setShowSaveButton, setsettingTabs, selectedSettingTab, form }) => {
  const [baseObj] = useMirketPortal();
  const tenant: ITenantDetail = useAppSelector(state => state.account.entity);

  const settingTabsForOthers: TabsProps['items'] = React.useMemo(
    () => [
      {
        key: 'licencesettings',
        label: 'License',
        children: <LicenseForm form={form} />,
      },
      {
        key: 'ownersettings',
        label: 'Owner',
        children: <AccountOwner form={form} />,
      },
    ],
    [form]
  );
  const settingTabsForEndUsers: TabsProps['items'] = React.useMemo(
    () => [
      {
        key: 'licencesettings',
        label: 'License',
        children: <LicenseForm form={form} />,
      },
      {
        key: 'ownersettings',
        label: 'Owner',
        children: <AccountOwner form={form} />,
      },
      {
        key: 'partner',
        label: 'Partner',
        children: <Partner form={form} />,
      },
    ],
    [form]
  );

  return (
    <Tabs
      onChange={(a: string) => {
        form.resetFields();
        setShowSaveButton(false);
        setsettingTabs(prev => a);
      }}
      tabBarStyle={{ width: '105px' }}
      activeKey={selectedSettingTab}
      tabPosition="left"
      style={{ minHeight: '360px' }}
      items={tenant?.tenant?.tenantType === TenantTypeInt.ENDUSER ? settingTabsForEndUsers : settingTabsForOthers}
    />
  );
};
