import { useSetState } from 'ahooks';
import { Row, TableColumnsType } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getGroups } from 'app/entities/group/group.reducer';
import { getParticipantBySelection } from 'app/entities/user/usertemp.reducer';
import { CustomTableTransfer } from 'app/shared/components/CustomTableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { uniqueByUid } from 'app/shared/util/UtilityService';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { UserOrGroup } from '../tabs/RadiusRulesUserAndGroups';

interface IUsersAndGroupsFormProps {
  userOrGroup: UserOrGroup;
}
export const UsersAndGroupsForm: React.FC<IUsersAndGroupsFormProps> = ({ userOrGroup }) => {
  const [participantTargetKeys, setParticipantTargetKeys] = React.useState<any[]>([
    {
      uid: 'a',
      username: 'All',
    },
  ]);
  const [selectableGroupList, setSelectableGroupList] = React.useState<any[]>([]);

  const [groupTargetKeys, setGroupTargetKeys] = React.useState<any[]>([]);
  const [participantKeys, setParticipantKeys] = React.useState<any[]>([]);
  const [tErrorMessage, setTErrorMessage] = React.useState<string>('');
  const [searchParticipantExceptSelectionData, setSearchParticipantExceptSelectionData] = useSetState<any>({
    searchtext: '',
    page: 0,
  });
  const [searchGroupData, setSearchGroupData] = useSetState<any>({ size: 10, page: 0 });
  const searchTimeout = React.useRef(null);

  const [baseObj] = useMirketPortal();
  const { control, watch } = useFormContext();
  const dispatch = useAppDispatch();

  const participantBySelectionList: any[] = useAppSelector(state => state.userTemp.participantBySelectionList);
  const participantBySelectionLoading: boolean = useAppSelector(state => state.userTemp.participantBySelectionLoading);
  const participantBySelectionCount = useAppSelector(state => state.userTemp.participantBySelectionCount);

  const groupList: any[] = useAppSelector(state => state.group.groupList);
  const grouploading: boolean = useAppSelector(state => state.group.groupLoading);
  const groupCount = useAppSelector(state => state.group.groupCount);

  const participantTableColumns: TableColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'username',
        title: 'Username',
      },
    ],
    []
  );

  const groupTableColumns: TableColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Group Name',
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getGroups({ ...searchGroupData, accountId: baseObj?.accountId }));
  }, [searchGroupData]);

  React.useEffect(() => {
    dispatch(
      getParticipantBySelection({
        ...searchParticipantExceptSelectionData,
        accountId: baseObj?.accountId,
        exceptParticipants: participantTargetKeys.map(p => p.uid).join(','),
      })
    ).then((res: any) => {
      const pList = res.payload?.data?.resultList;
      setParticipantKeys([...pList]);
    });
  }, [searchParticipantExceptSelectionData]);

  React.useEffect(() => {
    const datas = groupList.filter(g => watch('participantGroups').includes(g.uid));

    setGroupTargetKeys(datas);
  }, []);

  React.useEffect(() => {
    setSelectableGroupList(groupList);
  }, [groupList]);

  return (
    <div>
      {userOrGroup === UserOrGroup.USER && (
        <Row>
          <Controller
            name="participants"
            control={control}
            render={({ field: { onChange } }) => (
              <CustomTableTransfer
                makeSourceUnique={false}
                errorMessage={tErrorMessage}
                titles={['Available Users', 'Selected Users']}
                lDataSource={participantKeys}
                rDataSource={participantTargetKeys}
                onChange={(d, keys, tKeys) => {
                  switch (true) {
                    // soldan sağa taşıma işlemi
                    case d === 'right' && !keys.includes('a'): {
                      setTErrorMessage('');

                      const targetUserObj = participantBySelectionList.filter(p => keys.includes(p.uid));

                      const targetKeyList = participantTargetKeys.filter(p => p.uid !== 'a');
                      setParticipantTargetKeys(prev => [...targetKeyList, ...targetUserObj]);

                      dispatch(
                        getParticipantBySelection({
                          accountId: baseObj?.accountId,
                          page: searchParticipantExceptSelectionData?.page,
                          searchtext: '',
                          exceptParticipants: tKeys.join(','),
                        })
                      ).then((res: any) => {
                        const pList = res.payload?.data?.resultList;
                        setParticipantKeys([{ uid: 'a', username: 'All' }, ...pList]);
                      });

                      onChange(tKeys.filter(k => k !== 'a'));
                      break;
                    }

                    // soldan sağa taşıma işlemi ve All seçili ise
                    case keys.includes('a') && d === 'right': {
                      setTErrorMessage('');

                      setParticipantTargetKeys([{ uid: 'a', username: 'All' }]);

                      dispatch(
                        getParticipantBySelection({
                          accountId: baseObj?.accountId,
                          page: searchParticipantExceptSelectionData?.page,
                          searchtext: '',
                          exceptParticipants: '',
                        })
                      ).then((res: any) => {
                        const pList = res.payload?.data?.resultList;
                        setParticipantKeys(pList);
                      });

                      setParticipantKeys(participantBySelectionList);
                      onChange(['a']);

                      break;
                    }

                    // sağdan sola taşıma işlemi
                    case d === 'left' &&
                      !keys.includes('a') &&
                      participantTargetKeys.length > 1 &&
                      participantTargetKeys.length !== keys.length: {
                      setTErrorMessage('');

                      const targetUserObjList = participantTargetKeys.filter(p => !keys.includes(p.uid));

                      setParticipantTargetKeys(prev => [...targetUserObjList]);

                      dispatch(
                        getParticipantBySelection({
                          accountId: baseObj?.accountId,
                          page: searchParticipantExceptSelectionData?.page,
                          searchtext: '',
                          exceptParticipants: tKeys.join(','),
                        })
                      ).then((res: any) => {
                        const pList = res.payload?.data?.resultList;
                        setParticipantKeys([{ uid: 'a', username: 'All' }, ...pList]);
                      });

                      const t = targetUserObjList.map(u => u.uid);
                      onChange(t);
                      break;
                    }

                    // sağdan sola taşıma işlemi ve All seçili ise
                    case d === 'left' &&
                      keys.includes('a') &&
                      participantTargetKeys.length > 1 &&
                      participantTargetKeys.length !== keys.length: {
                      setTErrorMessage('');

                      setParticipantTargetKeys(prev => []);

                      dispatch(
                        getParticipantBySelection({
                          accountId: baseObj?.accountId,
                          page: searchParticipantExceptSelectionData?.page,
                          searchtext: '',
                          exceptParticipants: '',
                        })
                      ).then((res: any) => {
                        const pList = res.payload?.data?.resultList;
                        setParticipantKeys([{ uid: 'a', username: 'All' }, ...pList]);
                      });

                      onChange([]);
                      break;
                    }

                    case (d === 'left' && participantTargetKeys.length <= 1) ||
                      (d === 'left' && participantTargetKeys.length === keys.length): {
                      setTErrorMessage('Need at least one selected user!');
                      break;
                    }
                    default:
                      break;
                  }
                }}
                lOnSearch={v => {
                  if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
                  }

                  searchTimeout.current = setTimeout(() => {
                    const query = { searchtext: v.target.value };
                    setSearchParticipantExceptSelectionData((s: IQueryParams) => ({ ...s, ...query }));
                  }, 600); //  (600 ms) gecikme
                }}
                lColumns={participantTableColumns}
                rColumns={participantTableColumns}
                lLoading={participantBySelectionLoading}
                rLoading={false}
                lPagination={{
                  current: searchParticipantExceptSelectionData.page + 1,
                  pageSize: 10,
                  total: participantBySelectionCount,
                  onChange: (page, pageSize) =>
                    setSearchParticipantExceptSelectionData(prev => ({ ...prev, page: page - 1, size: pageSize })),
                }}
              />
            )}
          />
        </Row>
      )}
      {userOrGroup === UserOrGroup.GROUP && (
        <Row>
          <Controller
            name="participantGroups"
            control={control}
            render={({ field: { onChange } }) => (
              <CustomTableTransfer
                titles={['Available Groups', 'Selected Groups']}
                makeSourceUnique={true}
                errorMessage={tErrorMessage}
                lDataSource={selectableGroupList}
                rDataSource={groupTargetKeys}
                onChange={(d, keys, tKeys) => {
                  // soldan sağa taşıma işlemi
                  if (d === 'right') {
                    setTErrorMessage('');

                    const p = selectableGroupList.filter(x => keys.includes(x.uid));
                    const g = selectableGroupList.filter(x => !keys.includes(x.uid));

                    setGroupTargetKeys(prev => {
                      return uniqueByUid([...prev, ...p]);
                    });
                    setSelectableGroupList(prev => [...g]);
                    onChange(tKeys);
                  }
                  if (d === 'left' && groupTargetKeys.length > 1 && groupTargetKeys.length !== keys.length) {
                    const p = groupTargetKeys.filter(x => !keys.includes(x.uid));
                    const g = groupTargetKeys.filter(x => keys.includes(x.uid));

                    setGroupTargetKeys(p);
                    setSelectableGroupList(prev => [...prev, ...g]);

                    onChange(tKeys);
                  }
                  if ((d === 'left' && groupTargetKeys.length <= 1) || (d === 'left' && groupTargetKeys.length === keys.length)) {
                    setTErrorMessage('Need at least one selected group!');
                  }
                }}
                lOnSearch={v => {
                  if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
                  }

                  searchTimeout.current = setTimeout(() => {
                    const query = { searchtext: v.target.value, size: 10, page: 0 };
                    setSearchGroupData((s: IQueryParams) => ({ ...s, ...query }));
                  }, 600); // 1 saniye (1000 ms) gecikme
                }}
                lColumns={groupTableColumns}
                rColumns={groupTableColumns}
                lLoading={grouploading}
                rLoading={false}
                lPagination={{
                  current: searchGroupData.page + 1,
                  pageSize: searchGroupData.size,
                  total: groupCount,
                  onChange: (page, pageSize) => setSearchGroupData(prev => ({ ...prev, page: page - 1, size: pageSize })),
                }}
              />
            )}
          />
        </Row>
      )}
    </div>
  );
};
