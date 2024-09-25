import React from 'react';
import { Groups } from './user-and-group-tabs/Groups';
import { Users } from './user-and-group-tabs/Users';
import { IRadiusRuleDetailModel } from 'app/shared/model/RadiusRulesModel';
import { useAppSelector } from 'app/config/store';
export enum UserOrGroup {
  USER = 'user',
  GROUP = 'group',
}

interface IRadiusRulesUserAndGroups {
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const RadiusRulesUserAndGroups: React.FC<IRadiusRulesUserAndGroups> = ({ setShowSaveButton, setNewUserOrGroupsList }) => {
  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);

  const renderPage = () => {
    switch (radiusRule?.isParticipantRule) {
      case true:
        return <Users setShowSaveButton={setShowSaveButton} setNewUserOrGroupsList={setNewUserOrGroupsList} />;
      case false:
        return <Groups setShowSaveButton={setShowSaveButton} setNewUserOrGroupsList={setNewUserOrGroupsList} />;
      default:
        return <></>;
    }
  };
  return <div>{renderPage()}</div>;
};
