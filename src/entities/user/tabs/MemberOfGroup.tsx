import { useSetState } from 'ahooks';
import { Spin, TableColumnsType, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAllGroup, getGroupByParticipants } from 'app/entities/group/group.reducer';
import { CustomTableTransfer } from 'app/shared/components/CustomTableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { EGroupType } from 'app/shared/model/GroupModel';
import { IParticipantDetail } from 'app/shared/model/participant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useParams } from 'react-router-dom';

interface IMemberOfGroupProps {
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
}

export const MemberOfGroup: React.FC<IMemberOfGroupProps> = ({ setNewUserOrGroupsList, setShowSaveButton }) => {
  const { id } = useParams<'id'>();
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  const [groupTargetKeys, setGroupTargetKeys] = React.useState<any[]>([]);
  const [groupKeys, setGroupKeys] = React.useState<any[]>([]);

  const [searchGroupData, setSearchGroupData] = useSetState<any>({ searchtext: '' });
  const [baseObj] = useMirketPortal();

  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();

  const participant: IParticipantDetail = useAppSelector(state => state.userTemp.entity);
  const groupList: any[] = useAppSelector(state => state.group.groupList);
  const groupLoading: boolean = useAppSelector(state => state.group.groupLoading);

  const groupByParticipantList: any[] = useAppSelector(state => state.group.groupByParticipantList);
  const groupByParticipantLoading: boolean = useAppSelector(state => state.group.groupByParticipantLoading);

  const tableColumns: TableColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Group Name',
      },
      // {
      //   dataIndex: 'groupType',
      //   title: 'Type',
      //   render: groupType => <Tag color={getColorByType(EGroupType, groupType)}>{Object.values(EGroupType)[groupType]}</Tag>,
      // },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getGroupByParticipants({ participantId: id, searchtext: '', isExcept: false }));
  }, []);

  React.useEffect(() => {
    dispatch(getAllGroup({ ...searchGroupData, accountId: baseObj?.accountId }));
  }, [searchGroupData]);

  React.useEffect(() => {
    // ilk liste set edilme aşaması
    if (!isChanged && groupByParticipantList && groupList) {
      const gByRuleIds = groupByParticipantList.map(g => g.uid);
      const gKeys = groupList.filter(g => !gByRuleIds.includes(g.uid));

      setGroupTargetKeys(prev => groupByParticipantList);
      setGroupKeys(prev => gKeys);
      setNewUserOrGroupsList(groupByParticipantList);
    } else {
      const gByRuleIds = groupTargetKeys.map(g => g.uid);
      const gKeys = groupList.filter(g => !gByRuleIds.includes(g.uid));

      setNewUserOrGroupsList(groupTargetKeys);

      setGroupKeys(prev => gKeys);
    }
  }, [groupByParticipantList, groupList, isChanged]);

  if (!participant) {
    return <Spin fullscreen />;
  }

  return (
    <div>
      <CustomTableTransfer
        readonly={baseObj?.isReadOnly}
        onChange={(d, keys, tKeys) => {
          setIsChanged(true);
          setShowSaveButton(true);
          // soldan sağa taşıma işlemi
          if (d === 'right') {
            const p = groupList.filter(x => keys.includes(x.uid));
            const g = groupList.filter(x => !tKeys.includes(x.uid));
            setGroupKeys(g);
            setGroupTargetKeys(prev => [...prev, ...p]);
            setNewUserOrGroupsList(prev => [...groupTargetKeys, ...p]);
          }
          // soldan sağa taşıma işlemi
          if (d === 'left') {
            const p = groupList.filter(x => tKeys.includes(x.uid));
            const g = groupList.filter(x => !tKeys.includes(x.uid));

            setGroupKeys(g);
            setGroupTargetKeys(p);
            setNewUserOrGroupsList(p);
          }
        }}
        titles={['Available Groups', 'Selected Groups']}
        lDataSource={groupKeys}
        rDataSource={groupTargetKeys}
        lOnSearch={v => {
          if (searchTimeout.current) {
            clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
          }

          searchTimeout.current = setTimeout(() => {
            const query = { searchtext: v.target.value };
            setSearchGroupData((s: IQueryParams) => ({ ...s, ...query }));
          }, 600); // 1 saniye (1000 ms) gecikme
        }}
        lColumns={tableColumns}
        rColumns={tableColumns}
        lLoading={groupLoading}
        rLoading={groupByParticipantLoading}
      />
    </div>
  );
};
