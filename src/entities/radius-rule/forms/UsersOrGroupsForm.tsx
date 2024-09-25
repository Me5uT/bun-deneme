import { Form } from 'antd';
import { CustomSelect2WithControl } from 'app/shared/components/CustomSelect2WithControl';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { UserOrGroup } from '../tabs/RadiusRulesUserAndGroups';
interface IUsersOrGroupsFormProps {
  setUserOrGroup: (v: UserOrGroup) => void;
}
export const UsersOrGroupsForm: React.FC<IUsersOrGroupsFormProps> = ({ setUserOrGroup }) => {
  const { control } = useFormContext();

  return (
    <div>
      <Form.Item>
        <CustomSelect2WithControl
          control={control}
          options={[
            { mainText: 'User', value: UserOrGroup.USER, iconName: 'mirketuser' },
            { mainText: 'Group', value: UserOrGroup.GROUP, iconName: 'mirketgroup' },
          ]}
          name="userOrGroup"
          title="User Or Group ?"
          onChange={e => {
            setUserOrGroup(e);
          }}
        />
      </Form.Item>
    </div>
  );
};
