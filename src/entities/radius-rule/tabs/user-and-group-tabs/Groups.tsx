import { useSetState } from 'ahooks';
import { Spin, TableColumnsType, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAllGroup, getGroupByRule } from 'app/entities/group/group.reducer';
import { CustomTableTransfer } from 'app/shared/components/CustomTableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { EGroupType } from 'app/shared/model/GroupModel';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useParams } from 'react-router-dom';

interface IRuleGroupsProps {
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
}
export const Groups: React.FC<IRuleGroupsProps> = ({ setShowSaveButton, setNewUserOrGroupsList }) => {
  const { id } = useParams<'id'>();
  const [tErrorMessage, setTErrorMessage] = React.useState<string>('');
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  const [groupTargetKeys, setGroupTargetKeys] = React.useState<any[]>([]);
  const [groupKeys, setGroupKeys] = React.useState<any[]>([]);

  const [searchGroupExceptRuleData, setSearchGroupExceptRuleData] = useSetState<any>({ searchtext: '' });
  const [baseObj] = useMirketPortal();

  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();

  const radiusRule = useAppSelector(state => state.radiusRule.entity);
  const groupList: any[] = useAppSelector(state => state.group.groupList);
  const groupLoading: boolean = useAppSelector(state => state.group.groupLoading);

  const groupByRuleList: any[] = useAppSelector(state => state.group.groupByRuleList);
  const groupByRuleLoading: boolean = useAppSelector(state => state.group.groupByRuleLoading);

  const groupTableColumns: TableColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Group Name',
      },
      {
        dataIndex: 'groupType',
        title: 'Type',
        render: groupType => <Tag color={getColorByType(EGroupType, groupType)}>{Object.values(EGroupType)[groupType]}</Tag>,
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getGroupByRule({ ruleId: id, searchtext: '', isExcept: false }));
  }, []);

  React.useEffect(() => {
    dispatch(getAllGroup({ ...searchGroupExceptRuleData, accountId: baseObj?.accountId }));
  }, [searchGroupExceptRuleData]);

  React.useEffect(() => {
    // ilk liste set edilme aşaması
    if (!isChanged && groupByRuleList && groupList) {
      const gByRuleIds = groupByRuleList.map(g => g.uid);
      const gKeys = groupList?.filter(g => !gByRuleIds.includes(g.uid));

      setGroupTargetKeys(prev => groupByRuleList);
      setGroupKeys(prev => gKeys);
      setNewUserOrGroupsList(groupByRuleList);
    } else {
      const gByRuleIds = groupTargetKeys.map(g => g.uid);
      const gKeys = groupList?.filter(g => !gByRuleIds.includes(g.uid));

      setNewUserOrGroupsList(groupTargetKeys);

      setGroupKeys(prev => gKeys);
    }
  }, [groupByRuleList, groupList, isChanged]);

  if (!radiusRule) {
    return <Spin fullscreen />;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CustomTableTransfer
        errorMessage={tErrorMessage}
        readonly={baseObj?.isReadOnly}
        onChange={(d, keys, tKeys) => {
          // soldan sağa taşıma işlemi
          if (d === 'right') {
            setTErrorMessage('');
            setIsChanged(true);
            setShowSaveButton(true);
            const p = groupList.filter(x => keys.includes(x.uid));
            const g = groupList.filter(x => !tKeys.includes(x.uid));
            setGroupKeys(g);
            setGroupTargetKeys(prev => [...prev, ...p]);
            setNewUserOrGroupsList(prev => [...groupTargetKeys, ...p]);
          }
          // soldan sağa taşıma işlemi
          if (d === 'left' && groupTargetKeys.length > 1 && groupTargetKeys.length !== keys.length) {
            setTErrorMessage('');
            setIsChanged(true);
            setShowSaveButton(true);
            const p = groupList.filter(x => tKeys.includes(x.uid));
            const g = groupList.filter(x => !tKeys.includes(x.uid));

            setGroupKeys(g);
            setGroupTargetKeys(p);
            setNewUserOrGroupsList(p);
          }

          if ((d === 'left' && groupTargetKeys.length <= 1) || (d === 'left' && groupTargetKeys.length === keys.length)) {
            setTErrorMessage('Need at least one selected group!');
          }
        }}
        titles={['Available Groups', 'Selected Groups']}
        lDataSource={groupKeys}
        rDataSource={groupTargetKeys}
        lOnSearch={v => {
          if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
          }

          searchTimeout.current = setTimeout(() => {
            const query = { searchtext: v.target.value };
            setSearchGroupExceptRuleData((s: any) => ({ ...s, ...query }));
          }, 600);
        }}
        lColumns={groupTableColumns}
        rColumns={groupTableColumns}
        lLoading={groupLoading}
        rLoading={groupByRuleLoading}
      />
    </div>
  );
};
