import { useSetState } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { FormInstance, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getAllExternalSource,
  getExternalSourceByGroup,
  getExternalSourceExceptGroup,
} from 'app/entities/external-source/externalSource.reducer';
import { CustomTableTransfer } from 'app/shared/components/CustomTableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGroup } from 'app/shared/model/GroupModel';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import React from 'react';
import { useParams } from 'react-router-dom';

export interface DataType {
  key: string;
  name: string;
  groupType;
}
interface IExternalSourceProps {
  setsettingTabs: React.Dispatch<React.SetStateAction<string>>;
  form: FormInstance<any>;
  setShowSaveButton?: React.Dispatch<React.SetStateAction<boolean>>;

  setNewUserOrGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
}
export const ExternalSource: React.FC<IExternalSourceProps> = ({ setShowSaveButton, setNewUserOrGroupsList, form, setsettingTabs }) => {
  const { id } = useParams<'id'>();
  const [isChanged, setIsChanged] = React.useState<boolean>(false);

  const [groupTargetKeys, setGroupTargetKeys] = React.useState<any[]>([]);
  const [groupKeys, setGroupKeys] = React.useState<any[]>([]);

  const [searchGroupExceptGroupData, setSearchGroupExceptGroupData] = useSetState<any>({ searchtext: '' });

  const [baseObj] = useMirketPortal();
  const searchTimeout = React.useRef(null);

  const dispatch = useAppDispatch();
  const groupDetail: IGroup = useAppSelector(state => state.group.entity);

  const externalSourceList: any[] = useAppSelector(state => state.externalSource.externalSourceList);
  const externalSourceLoading: boolean = useAppSelector(state => state.externalSource.externalSourceLoading);

  const externalSourceByGroupList: any[] = useAppSelector(state => state.externalSource.externalSourceByGroupList);
  const externalSourceByGroupLoading: boolean = useAppSelector(state => state.externalSource.externalSourceByGroupLoading);

  const tableColumns: TableColumnsType<DataType> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Name',
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getExternalSourceByGroup({ groupId: id, isExcept: false, searchtext: '' }));
  }, []);

  React.useEffect(() => {
    dispatch(getAllExternalSource({ ...searchGroupExceptGroupData, accountId: baseObj?.accountId }));
  }, [searchGroupExceptGroupData]);

  React.useEffect(() => {
    // ilk liste set edilme aşaması
    if (!isChanged && externalSourceByGroupList && externalSourceList) {
      const gByRuleIds = externalSourceByGroupList.map(g => g.uid);
      const gKeys = externalSourceList?.filter(g => !gByRuleIds.includes(g.uid));

      setGroupTargetKeys(prev => externalSourceByGroupList);
      setGroupKeys(prev => gKeys);
      setNewUserOrGroupsList(externalSourceByGroupList);
    } else {
      const gByRuleIds = groupTargetKeys.map(g => g.uid);
      const gKeys = externalSourceList?.filter(g => !gByRuleIds.includes(g.uid));

      setNewUserOrGroupsList(groupTargetKeys);

      setGroupKeys(prev => gKeys);
    }
  }, [externalSourceByGroupList, externalSourceList, isChanged]);

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
            const p = externalSourceList.filter(x => keys.includes(x.uid));
            const g = externalSourceList.filter(x => !tKeys.includes(x.uid));
            setGroupKeys(g);
            setGroupTargetKeys(prev => [...prev, ...p]);
            setNewUserOrGroupsList(prev => [...groupTargetKeys, ...p]);
          }
          // soldan sağa taşıma işlemi
          if (d === 'left') {
            const p = externalSourceList.filter(x => tKeys.includes(x.uid));
            const g = externalSourceList.filter(x => !tKeys.includes(x.uid));

            setGroupKeys(g);
            setGroupTargetKeys(p);
            setNewUserOrGroupsList(p);
          }
        }}
        titles={['Available Source', 'Selected Source']}
        lDataSource={groupKeys}
        rDataSource={groupTargetKeys}
        lOnSearch={v => {
          if (searchTimeout.current) {
            clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
          }

          searchTimeout.current = setTimeout(() => {
            const query = { searchtext: v.target.value };
            setSearchGroupExceptGroupData((s: IQueryParams) => ({ ...s, ...query }));
          }, 600); // 1 saniye (1000 ms) gecikme
        }}
        lColumns={tableColumns}
        rColumns={tableColumns}
        lLoading={externalSourceLoading}
        rLoading={externalSourceByGroupLoading}
      />
    </div>
  );
};
