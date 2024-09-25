import { useSetState } from 'ahooks';
import type { TableColumnsType } from 'antd';
import { Col, Row, Tag } from 'antd';
import { TransferDirection } from 'antd/es/transfer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/group/group.reducer';
import { TableTransfer } from 'app/shared/components/TableTransfer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { EGroupType } from 'app/shared/model/GroupModel';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface DataType {
  key: string;
  name: string;
  type?: any;
  disabled?: boolean;
}
export const GroupForm: React.FC = () => {
  const [searchData, setSearchData] = useSetState<any>({ size: 10, page: 0 });

  const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
  const searchTimeout = React.useRef(null);
  const [baseObj] = useMirketPortal();

  const { control } = useFormContext();
  const dispatch = useAppDispatch();
  const groupList = useAppSelector(state => state.group.entities);
  const groupLoading: boolean = useAppSelector(state => state.group.loading);

  const leftTableColumns: TableColumnsType<DataType> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        dataIndex: 'groupType',
        title: 'Type',
        render: group => <Tag color={getColorByType(EGroupType, group)}>{Object.values(EGroupType)[group]}</Tag>,
      },
    ],
    []
  );

  const rightTableColumns: TableColumnsType<DataType> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        dataIndex: 'groupType',
        title: 'Type',
        render: group => <Tag color={getColorByType(EGroupType, group)}>{Object.values(EGroupType)[group]}</Tag>,
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getEntities({ ...searchData, accountId: baseObj?.accountId }));
  }, [searchData]);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24}>
        <Controller
          name="groups"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange } }) => (
            <TableTransfer
              dataSource={groupList || []}
              titles={['Available Groups', 'Selected Groups']}
              rowKey={record => record.uid}
              targetKeys={targetKeys}
              showSearch={true}
              onSearch={(direction: TransferDirection, value: string) => {
                if (direction === 'left') {
                  if (searchTimeout.current) {
                    clearTimeout(searchTimeout.current);
                  }

                  searchTimeout.current = setTimeout(() => {
                    setSearchData((s: Partial<IQueryParams>) => ({ ...s, searchtext: value } as Partial<IQueryParams>)); // Explicitly cast the argument
                  }, 1000);
                }
              }}
              onChange={(nextTargetKeys: string[]) => {
                setTargetKeys(nextTargetKeys);
                const data = nextTargetKeys.map(item => ({ groupUid: item }));
                onChange(data);
              }}
              filterOption={(inputValue, item) => true}
              leftColumns={leftTableColumns}
              rightColumns={rightTableColumns}
            />
          )}
        />
      </Col>
    </Row>
  );
};
