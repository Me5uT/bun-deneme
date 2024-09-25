import { Form, FormInstance, Input, Spin } from 'antd';
import { useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGroup } from 'app/shared/model/GroupModel';
import React from 'react';

interface IGroupInfoProps {
  form: FormInstance<any>;
  setsettingTabs: React.Dispatch<React.SetStateAction<string>>;
}

export const GroupInfo: React.FC<IGroupInfoProps> = ({ form, setsettingTabs }) => {
  const groupDetails: IGroup = useAppSelector(state => state.group.entity);
  const loading: boolean = useAppSelector(state => state.group.loading);

  React.useEffect(() => {
    setsettingTabs('groupInfo');
  }, []);

  React.useEffect(() => {
    form.resetFields();
  }, [groupDetails]);

  if (loading || !groupDetails) {
    return <Spin spinning={loading} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '20px' }}>
      <Form.Item
        name="name"
        label={'Group Name'}
        labelCol={{ sm: 8, md: 8, xl: 6 }}
        wrapperCol={{ sm: 10, md: 10, xl: 8 }}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label={'Description'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 10, md: 10, xl: 8 }}>
        <Input />
      </Form.Item>
    </div>
  );
};
