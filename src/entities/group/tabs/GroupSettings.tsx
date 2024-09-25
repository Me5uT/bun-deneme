import type { FormInstance, TabsProps } from 'antd';
import { Tabs } from 'antd';
import React from 'react';
import { GroupInfo } from './setting-tabs/GroupInfo';
import { ExternalSource } from './setting-tabs/ExternalSource';
import { Users } from './setting-tabs/Users';

interface IGroupSettingsProps {
  settingsTab: string;
  setsettingTabs: React.Dispatch<React.SetStateAction<string>>;
  setShowSaveButton?: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
}

export const GroupSettings: React.FC<IGroupSettingsProps> = ({
  setNewUserOrGroupsList,
  setShowSaveButton,
  setsettingTabs,
  form,
  settingsTab,
}) => {
  const settingTabs: TabsProps['items'] = React.useMemo(
    () => [
      {
        key: 'groupInfo',
        label: 'Group Info',

        children: <GroupInfo form={form} setsettingTabs={setsettingTabs} />,
      },
      {
        key: 'users',
        label: 'Users',
        children: (
          <Users
            form={form}
            setsettingTabs={setsettingTabs}
            setNewUserOrGroupsList={setNewUserOrGroupsList}
            setShowSaveButton={setShowSaveButton}
          />
        ),
      },
      {
        key: 'externalSources',
        label: 'External Sources',
        children: (
          <ExternalSource
            form={form}
            setShowSaveButton={setShowSaveButton}
            setsettingTabs={setsettingTabs}
            setNewUserOrGroupsList={setNewUserOrGroupsList}
          />
        ),
      },
    ],
    []
  );

  return (
    <Tabs
      destroyInactiveTabPane
      onChange={(a: string) => {
        setShowSaveButton(false);
        setsettingTabs(prev => a);
      }}
      activeKey={settingsTab}
      tabPosition="left"
      style={{ minHeight: '360px' }}
      items={settingTabs}
    />
  );
};
