import { useSetState } from 'ahooks';
import { Spin, TableColumnsType } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getParticipantByRule, getParticipantBySelection, getParticipantExpectRule } from 'app/entities/user/usertemp.reducer';
import { CustomTableTransfer } from 'app/shared/components/CustomTableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IRadiusRuleDetailModel } from 'app/shared/model/RadiusRulesModel';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import React from 'react';
import { useParams } from 'react-router-dom';

interface IRuleUsersProps {
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
}

export const Users: React.FC<IRuleUsersProps> = ({ setShowSaveButton, setNewUserOrGroupsList }) => {
  const { id } = useParams<'id'>();
  const [tErrorMessage, setTErrorMessage] = React.useState<string>('');

  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  const [participantTargetKeys, setParticipantTargetKeys] = React.useState<any[]>([]);

  const [participantKeys, setParticipantKeys] = React.useState<any[]>([]);

  const [searchParticipantByRuleData, setSearchParticipantByRuleData] = React.useState<any>({
    size: 10,
    page: 0,
    ruleId: id,
    searchtext: '',
    isExcept: false,
  });
  const [searchParticipantExceptRuleData, setSearchParticipantExceptRuleData] = React.useState<any>({
    size: 10,
    page: 0,
    ruleId: id,
    searchtext: '',
    isExcept: true,
  });
  const [baseObj] = useMirketPortal();

  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();

  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);
  const isAllParticipantsIncluded: boolean = useAppSelector(state => state.radiusRule.isAllParticipantsIncluded);

  const participantByRuleList: any[] = useAppSelector(state => state.userTemp.participantByRuleList);
  const participantByRuleLoading: boolean = useAppSelector(state => state.userTemp.participantByRuleLoading);
  const participantByRuleCount = useAppSelector(state => state.userTemp.participantByRuleCount);

  const participantBySelectionList: any[] = useAppSelector(state => state.userTemp.participantBySelectionList);
  console.log('🚀 ~ participantBySelectionList:', participantBySelectionList);
  const participantBySelectionLoading: boolean = useAppSelector(state => state.userTemp.participantBySelectionLoading);
  const participantBySelectionCount = useAppSelector(state => state.userTemp.participantBySelectionCount);

  const participantTableColumns: TableColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'username',
        title: 'UserName',
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getParticipantByRule({ ...searchParticipantByRuleData }));
  }, [searchParticipantByRuleData]);

  React.useEffect(() => {
    if (participantByRuleList) setParticipantTargetKeys(participantByRuleList);
  }, [participantByRuleList]);

  React.useEffect(() => {
    if (id)
      dispatch(
        getParticipantBySelection({
          accountId: baseObj?.accountId,
          page: searchParticipantExceptRuleData?.page,
          size:
            !isAllParticipantsIncluded && searchParticipantExceptRuleData?.page === 0
              ? searchParticipantExceptRuleData?.size - 1
              : searchParticipantExceptRuleData?.size,
          searchtext: searchParticipantExceptRuleData?.searchtext,
          exceptParticipants: radiusRule?.participantList?.map(p => p.uid).join(','),
        })
      );
  }, [id, searchParticipantExceptRuleData]);

  React.useEffect(() => {
    // ilk liste set edilme aşaması
    if (!isChanged && participantByRuleList && participantBySelectionList) {
      if (isAllParticipantsIncluded) {
        setParticipantTargetKeys([{ uid: 'a', username: 'All' }]);
        setParticipantKeys(participantBySelectionList);
      } else {
        setParticipantTargetKeys(participantByRuleList);
        if (searchParticipantExceptRuleData?.page === 0) {
          setParticipantKeys([{ uid: 'a', username: 'All' }, ...participantBySelectionList]);
        } else {
          setParticipantKeys(participantBySelectionList);
        }
      }
    }
  }, [isChanged, participantByRuleList, participantBySelectionList]);

  console.log('participantKeys', participantKeys);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CustomTableTransfer
        errorMessage={tErrorMessage}
        readonly={baseObj?.isReadOnly}
        onChange={(d, keys, tKeys) => {
          switch (true) {
            // soldan sağa taşıma işlemi
            case d === 'right' && !keys.includes('a'): {
              setTErrorMessage('');
              setIsChanged(true);
              setShowSaveButton(true);

              const targetUserObj = participantBySelectionList.filter(p => keys.includes(p.uid));

              const targetKeyList = participantTargetKeys.filter(p => p.uid !== 'a');
              setParticipantTargetKeys(prev => [...targetKeyList, ...targetUserObj]);
              setNewUserOrGroupsList(prev => [...targetKeyList, ...targetUserObj]);

              dispatch(
                getParticipantBySelection({
                  accountId: baseObj?.accountId,
                  page: searchParticipantExceptRuleData?.page,
                  size: searchParticipantExceptRuleData?.size,
                  searchtext: '',
                  exceptParticipants: tKeys.join(','),
                })
              ).then((res: any) => {
                const pList = res.payload?.data?.resultList;
                setParticipantKeys([{ uid: 'a', username: 'All' }, ...pList]);
              });

              break;
            }

            // soldan sağa taşıma işlemi ve All seçili ise
            case keys.includes('a') && d === 'right': {
              setTErrorMessage('');

              setIsChanged(true);
              setShowSaveButton(true);

              setParticipantTargetKeys([{ uid: 'a', username: 'All' }]);
              setNewUserOrGroupsList([{ uid: 'a', username: 'All' }]);

              dispatch(
                getParticipantBySelection({
                  accountId: baseObj?.accountId,
                  page: searchParticipantExceptRuleData?.page,
                  size: searchParticipantExceptRuleData?.size,
                  searchtext: '',
                  exceptParticipants: '',
                })
              ).then((res: any) => {
                const pList = res.payload?.data?.resultList;
                setParticipantKeys(pList);
              });

              setParticipantKeys(participantBySelectionList);
              break;
            }

            // sağdan sola taşıma işlemi
            case d === 'left' && !keys.includes('a') && participantTargetKeys.length > 1 && participantTargetKeys.length !== keys.length: {
              setTErrorMessage('');

              setIsChanged(true);
              setShowSaveButton(true);

              const targetUserObjList = participantTargetKeys.filter(p => !keys.includes(p.uid));

              setParticipantTargetKeys(prev => [...targetUserObjList]);
              setNewUserOrGroupsList(prev => [...targetUserObjList]);

              dispatch(
                getParticipantBySelection({
                  accountId: baseObj?.accountId,
                  page: searchParticipantExceptRuleData?.page,
                  size: searchParticipantExceptRuleData?.size,
                  searchtext: '',
                  exceptParticipants: tKeys.join(','),
                })
              ).then((res: any) => {
                const pList = res.payload?.data?.resultList;
                setParticipantKeys([{ uid: 'a', username: 'All' }, ...pList]);
              });
              break;
            }

            // sağdan sola taşıma işlemi ve All seçili ise
            case d === 'left' && keys.includes('a') && participantTargetKeys.length > 1 && participantTargetKeys.length !== keys.length: {
              setTErrorMessage('');

              setIsChanged(true);
              setShowSaveButton(true);

              setParticipantTargetKeys(prev => []);
              setNewUserOrGroupsList([]);

              dispatch(
                getParticipantBySelection({
                  accountId: baseObj?.accountId,
                  page: searchParticipantExceptRuleData?.page,
                  size: searchParticipantExceptRuleData?.size,
                  searchtext: '',
                  exceptParticipants: '',
                })
              ).then((res: any) => {
                const pList = res.payload?.data?.resultList;
                setParticipantKeys([{ uid: 'a', username: 'All' }, ...pList]);
              });
              break;
            }

            case (d === 'left' && participantTargetKeys.length <= 1) || (d === 'left' && participantTargetKeys.length === keys.length): {
              setTErrorMessage('Need at least one selected user!');
              break;
            }
            default:
              break;
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
            const query = { searchtext: v.target.value, size: 10, page: 0 };
            setSearchParticipantExceptRuleData((s: any) => ({ ...s, ...query }));
          }, 600);
        }}
        lColumns={participantTableColumns}
        rColumns={participantTableColumns}
        lLoading={participantBySelectionLoading}
        rLoading={participantByRuleLoading}
        lPagination={{
          current: searchParticipantExceptRuleData.page + 1,
          pageSize: searchParticipantExceptRuleData.size,
          showSizeChanger: true,
          total: participantBySelectionCount,
          onChange: (page, pageSize) =>
            setSearchParticipantExceptRuleData(prev => ({
              ...prev,
              page: page - 1,
              size: pageSize,
            })),
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
        rPagination={{
          showSizeChanger: true,
          current: searchParticipantByRuleData.page + 1,
          pageSize: searchParticipantByRuleData.size,
          total: participantByRuleCount,
          onChange: (page, pageSize) => setSearchParticipantByRuleData(prev => ({ ...prev, page: page - 1, size: pageSize })),
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
      />
    </div>
  );
};
