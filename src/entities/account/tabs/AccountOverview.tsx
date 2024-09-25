import { Tabs, TabsProps } from 'antd';
import React from 'react';
import { AccountTab } from './overview-tabs/AccountTab';
import { LicenseTab } from './overview-tabs/LicenseTab';
import { OwnerTab } from './overview-tabs/OwnerTab';

export const AccountOverview: React.FC = () => {
  const overviewTabs: TabsProps['items'] = React.useMemo(
    () => [
      {
        key: 'account',
        label: 'Account',
        children: <AccountTab />,
      },
      {
        key: 'owner',
        label: 'Owner',
        children: <OwnerTab />,
      },
      {
        key: 'license',
        label: 'License',
        children: <LicenseTab />,
      },
    ],
    []
  );

  return (
    <div>
      <Tabs
        defaultActiveKey="account"
        tabPosition="left"
        items={overviewTabs}
        style={{ minHeight: '460px' }}
        tabBarStyle={{ width: '105px' }}
      />
    </div>
  );
};
