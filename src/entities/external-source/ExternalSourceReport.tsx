import { ExportOutlined } from '@ant-design/icons';
import { useSessionStorageState } from 'ahooks';
import { Button, Table, Tag, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ExternalSourceReportStatus } from 'app/shared/model/externalSourceModel';
import { IQueryParams, SortType } from 'app/shared/reducers/reducer.utils';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { getExternalSourceReports } from './externalSource.reducer';
import { BackTopButton } from 'app/shared/components/BackTopButton';
interface LocationState {
  uid?: string;
}
export const ExternalSourceReport: React.FC = () => {
  const [baseObj] = useMirketPortal();

  const { state: locState } = useLocation() as unknown as { state: LocationState };

  const [searchData, setSearchData] = useSessionStorageState<Partial<IQueryParams>>('external-source-report', {
    defaultValue: {
      searchtext: '',
      accountId: baseObj?.accountId,
      externalSourceId: locState?.uid,
      page: 0,
      size: 10,
      sort: 'id',
      sortDirection: SortType.ASC,
    },
  });
  const dispatch = useAppDispatch();

  const externalSourceReports = useAppSelector(state => state.externalSource.externalSourceReports);

  const loading = useAppSelector(state => state.externalSource.externalSourceReportLoading);
  const entityCount = useAppSelector(state => state.externalSource.entityCount);

  React.useEffect(() => {
    if (locState?.uid) dispatch(getExternalSourceReports(searchData));
  }, [searchData]);

  React.useEffect(() => {
    return () => {
      sessionStorage.removeItem('external-source-report');
    };
  }, []);

  return (
    <div>
      <TableToolbar
        setSearchData={setSearchData}
        actionButtons={
          <Tooltip title="Export" trigger="hover">
            <Button type="default" disabled onClick={async () => {}} icon={<ExportOutlined />} />
          </Tooltip>
        }
      />
      <Table
        rowKey={'uid'}
        dataSource={externalSourceReports}
        loading={loading}
        onChange={(pagination, filters, sorter: any, extra) => {
          switch (extra.action) {
            case 'paginate':
              setSearchData(prev => ({
                ...prev,
                page: pagination?.current - 1,
                size: pagination?.pageSize,
              }));
              break;
            case 'sort':
              setSearchData(prev => ({
                ...prev,
                sort: sorter?.field && sorter?.order ? sorter.field : 'id',
                sortDirection: sorter?.order === 'descend' ? SortType.DESC : sorter?.order === 'ascend' ? SortType.ASC : null,
              }));
              break;
            default:
              break;
          }
        }}
        pagination={{
          showSizeChanger: true,
          current: searchData.page + 1,
          pageSize: searchData.size,
          total: entityCount,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
        columns={
          [
            {
              dataIndex: 'username',
              title: 'Username',
              sorter: true,
              sortOrder:
                searchData?.sort === 'username' && searchData.sortDirection === SortType.DESC
                  ? 'descend'
                  : searchData?.sort === 'username' && searchData?.sortDirection === SortType.ASC
                  ? 'ascend'
                  : null,
              width: 750,
            },
            {
              dataIndex: 'status',
              title: 'Status',
              sorter: true,
              sortOrder:
                searchData?.sort === 'status' && searchData.sortDirection === SortType.DESC
                  ? 'descend'
                  : searchData?.sort === 'status' && searchData?.sortDirection === SortType.ASC
                  ? 'ascend'
                  : null,
              width: 250,
              render(value, record, index) {
                return (
                  <Tag color={record?.status === ExternalSourceReportStatus.OK ? 'green' : 'red'}>
                    {record?.status === ExternalSourceReportStatus.OK ? 'Success' : 'Failure'}
                  </Tag>
                );
              },
            },
            {
              dataIndex: 'message',
              title: 'Message',
              sorter: true,
              sortOrder:
                searchData?.sort === 'message' && searchData.sortDirection === SortType.DESC
                  ? 'descend'
                  : searchData?.sort === 'message' && searchData?.sortDirection === SortType.ASC
                  ? 'ascend'
                  : null,
              width: 550,
              render(value, record, index) {
                return <div>{record?.message === '' ? '-' : record.message}</div>;
              },
            },
          ] as any
        }
      />
      <BackTopButton />
    </div>
  );
};
