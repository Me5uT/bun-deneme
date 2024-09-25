import { SearchOutlined } from '@ant-design/icons';
import { useSessionStorageState } from 'ahooks';
import { Button, Drawer, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { LogLevel } from 'app/shared/model/LoggingModel';
import { createSerializedObject, getColorByType } from 'app/shared/util/UtilityService';
import { formatDate } from 'app/shared/util/date-utils';
import React from 'react';
import { TableToolbar } from './TableToolbar';
import { LogDetailForm } from './forms/LogDetailForm';
import { getEntities } from './loggingAudit.reducer';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const LoggingAuditList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [searchData, setSearchData] = useSessionStorageState<any>('auditlog-pagination', {
    defaultValue: {
      pagination: {
        pageNumber: 0,
        pageSize: 10,
      },
    },
  });
  const [detailDrawerOpenClose, setDetailDrawerOpenClose] = React.useState<boolean>(false);
  const [logDetail, setLogDetail] = React.useState<any>({});

  const dispatch = useAppDispatch();

  const auditLogList = useAppSelector(state => state.loggingAudit.entities);
  const loading = useAppSelector(state => state.loggingAudit.loading);
  const entityCount = useAppSelector(state => state.loggingAudit.entityCount);

  const columns: ColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'updatedDate',
        title: 'DATE',
        render(value, record, index) {
          return <div>{formatDate(value, APP_DATE_FORMAT)}</div>;
        },
      },
      {
        dataIndex: 'level',
        title: 'LEVEL',
        render(value, record, index) {
          return (
            <div
              style={{
                color: getColorByType(LogLevel, value),
              }}
            >
              {Object.values(LogLevel)[value]}
            </div>
          );
        },
      },
      {
        dataIndex: 'user',
        title: 'USER',
      },
      {
        dataIndex: 'message',
        title: 'MESSAGE',
        responsive: ['md'],
      },
      {
        dataIndex: 'logtype',
        title: 'LOG TYPE',
        responsive: ['md'],
      },

      {
        dataIndex: 'actions',
        title: '',

        ellipsis: true,
        render(value, record, index) {
          return (
            <Button
              className="logging-audit-list-detail-button"
              icon={<SearchOutlined />}
              type="link"
              onClick={() => {
                setLogDetail(record);
                setDetailDrawerOpenClose(prev => true);
              }}
            />
          );
        },
      },
    ],
    []
  );

  React.useEffect(() => {
    const values = {
      ...searchData,
      uid: baseObj?.accountId,
      createdDate: searchData?.updatedDate?.length > 1 ? searchData?.updatedDate[0] : '',
      endDate: searchData?.updatedDate?.length > 1 ? searchData?.updatedDate[1] : '',
    };
    const { updatedDate, ...serializedSearchData } = values;

    dispatch(getEntities(createSerializedObject(serializedSearchData)));
  }, [searchData]);

  React.useEffect(() => {
    return () => {
      sessionStorage.removeItem('auditlog-pagination');
    };
  }, []);

  return (
    <div>
      <TableToolbar setSearchData={setSearchData} searchData={searchData} />
      <Table
        rowKey={'uid'}
        tableLayout="auto"
        columns={columns}
        dataSource={auditLogList}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          current: searchData?.pagination?.pageNumber + 1,
          pageSize: searchData?.pagination?.pageSize,
          total: entityCount,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
          onChange: (p, ps) =>
            setSearchData(prev => ({
              ...prev,
              pagination: {
                ...prev?.pagination,
                pageNumber: p - 1,
                pageSize: ps,
              },
            })),
        }}
      />
      <Drawer
        destroyOnClose
        width={640}
        placement="right"
        title="Log Details"
        closable={true}
        onClose={() => {
          setDetailDrawerOpenClose(prev => false);
          setLogDetail({});
        }}
        open={detailDrawerOpenClose}
      >
        <LogDetailForm logDetail={logDetail} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
