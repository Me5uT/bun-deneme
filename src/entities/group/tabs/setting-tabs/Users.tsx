import { useSetState } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { FormInstance, Spin, Tag } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getParticipantByGroup, getParticipantBySelection, getParticipantExpectGroup } from 'app/entities/user/usertemp.reducer';
import { CustomTableTransfer } from 'app/shared/components/CustomTableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IEditGroupUsersRequest, IGroup, TransferActions } from 'app/shared/model/GroupModel';
import { ParticipantTypeInt } from 'app/shared/model/participant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addOrRemoveUserToGroup } from '../../group.reducer';

export interface DataType {
  key: string;
  name: string;
  groupType;
}
interface IUsersProps {
  setsettingTabs: React.Dispatch<React.SetStateAction<string>>;
  form: FormInstance<any>;

  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
}
export const Users: React.FC<IUsersProps> = ({ form, setsettingTabs, setNewUserOrGroupsList, setShowSaveButton }) => {
  const { id } = useParams<'id'>();
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  const [participantTargetKeys, setParticipantTargetKeys] = React.useState<any[]>([]);
  const [participantKeys, setParticipantKeys] = React.useState<any[]>([]);

  const [searchParticipantData, setSearchParticipantData] = useSetState<any>({ searchtext: '', page: 0 });

  const searchTimeout = React.useRef(null);

  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();
  const groupDetail: IGroup = useAppSelector(state => state.group.entity);

  const participantBySelectionList: any[] = useAppSelector(state => state.userTemp.participantBySelectionList);
  const participantBySelectionLoading: boolean = useAppSelector(state => state.userTemp.participantBySelectionLoading);
  const participantBySelectionCount = useAppSelector(state => state.userTemp.participantBySelectionCount);

  const participantByGroupList: any[] = useAppSelector(state => state.userTemp.participantByGroupList);
  const participantByGroupLoading: boolean = useAppSelector(state => state.userTemp.participantByGroupLoading);
  const participantByGroupCount = useAppSelector(state => state.userTemp.participantByGroupCount);

  const tableColumns: TableColumnsType<DataType> = React.useMemo(
    () => [
      {
        dataIndex: 'displayName',
        title: 'Display Name',
      },
      {
        dataIndex: 'participantType',
        title: 'Type',
        render: participantType => (
          <Tag color={getColorByType(ParticipantTypeInt, participantType)}>{Object.values(ParticipantTypeInt)[participantType]}</Tag>
        ),
      },
    ],
    []
  );

  // const handleTransferChange = async (direction: TransferDirection, moveKeys: any[]) => {
  //   const participants = moveKeys.map(key => ({
  //     participantId: key,
  //     action: direction === 'right' ? TransferActions.ADD : TransferActions.REMOVE,
  //   }));

  //   const data: IEditGroupUsersRequest = {
  //     accountId: baseObj?.accountId,
  //     groupId: id,
  //     participants,
  //   };
  //   await dispatch(addOrRemoveUserToGroup(data));
  // };

  React.useEffect(() => {
    setsettingTabs('users');
    dispatch(getParticipantByGroup({ groupId: id, isExcept: false, searchtext: '' }));
  }, []);

  React.useEffect(() => {
    setsettingTabs('users');
    const excParticipantUids = participantTargetKeys.map(p => p.uid).join(',');
    dispatch(
      getParticipantBySelection({ ...searchParticipantData, accountId: baseObj?.accountId, exceptParticipants: excParticipantUids })
    );
  }, [searchParticipantData]);

  React.useEffect(() => {
    // ilk liste set edilme aşaması
    if (!isChanged && participantByGroupList && participantBySelectionList) {
      const gByRuleIds = participantByGroupList.map(g => g.uid);
      const gKeys = participantBySelectionList.filter(g => !gByRuleIds.includes(g.uid));

      setParticipantTargetKeys(prev => participantByGroupList);
      setParticipantKeys(prev => gKeys);
      setNewUserOrGroupsList(participantByGroupList);
    } else {
      const gByRuleIds = participantTargetKeys.map(g => g.uid);
      const gKeys = participantBySelectionList.filter(g => !gByRuleIds.includes(g.uid));

      setNewUserOrGroupsList(participantTargetKeys);

      setParticipantKeys(prev => gKeys);
    }
  }, [participantByGroupList, participantBySelectionList, isChanged]);

  if (!groupDetail) {
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
            const p = participantBySelectionList.filter(x => keys.includes(x.uid));
            const g = participantBySelectionList.filter(x => !tKeys.includes(x.uid));
            setParticipantKeys(g);
            setParticipantTargetKeys(prev => [...prev, ...p]);
            setNewUserOrGroupsList(prev => [...participantTargetKeys, ...p]);
          }
          // soldan sağa taşıma işlemi
          if (d === 'left') {
            const p = participantBySelectionList.filter(x => tKeys.includes(x.uid));
            const g = participantBySelectionList.filter(x => !tKeys.includes(x.uid));

            setParticipantKeys(g);
            setParticipantTargetKeys(p);
            setNewUserOrGroupsList(p);
          }
        }}
        titles={['Available Users', 'Selected Users']}
        lDataSource={participantKeys}
        rDataSource={participantTargetKeys}
        lOnSearch={v => {
          if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
          }

          searchTimeout.current = setTimeout(() => {
            const query = { searchtext: v.target.value };
            setSearchParticipantData((s: IQueryParams) => ({ ...s, ...query }));
          }, 600);
        }}
        lColumns={tableColumns}
        rColumns={tableColumns}
        lLoading={participantBySelectionLoading}
        rLoading={participantByGroupLoading}
        lPagination={{
          current: searchParticipantData.page + 1,
          pageSize: searchParticipantData.size,
          total: participantBySelectionCount,
          onChange: (page, pageSize) => setSearchParticipantData(prev => ({ ...prev, page: page - 1, size: pageSize })),
        }}
      />
    </div>
  );
};
