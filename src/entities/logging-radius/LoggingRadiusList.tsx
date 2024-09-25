import { SearchOutlined } from '@ant-design/icons';
import { useSessionStorageState } from 'ahooks';
import { Button, Drawer, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { RadiusStatus } from 'app/shared/model/LoggingModel';
import { createSerializedObject, getColorByType } from 'app/shared/util/UtilityService';
import { formatDate } from 'app/shared/util/date-utils';
import React from 'react';
import { TableToolbar } from './TableToolbar';
import { LogDetailForm } from './forms/LogDetailForm';
import { getEntities } from './loggingRadius.reducer';
import { BackTopButton } from 'app/shared/components/BackTopButton';
export const LoggingRadiusList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [searchData, setSearchData] = useSessionStorageState<any>('radiuslog-pagination', {
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

  const radiusLogList = useAppSelector(state => state.loggingRadius.entities);
  const loading = useAppSelector(state => state.loggingRadius.loading);
  const entityCount = useAppSelector(state => state.loggingRadius.entityCount);

  const columns: ColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'createdDate',
        title: 'TIME',
        render(value, record, index) {
          return <div>{formatDate(value, APP_DATE_FORMAT)}</div>;
        },
      },
      {
        dataIndex: 'username',
        title: 'USERNAME',
      },

      {
        dataIndex: 'message',
        title: 'MESSAGE',
      },
      {
        dataIndex: 'authenticationResult',
        title: 'RESULT',
        render(value, record, index) {
          return <Tag color={getColorByType(RadiusStatus, value)}>{Object.values(RadiusStatus)[value]}</Tag>;
        },
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
      sessionStorage.removeItem('radiuslog-pagination');
    };
  }, []);

  return (
    <div>
      <TableToolbar setSearchData={setSearchData} searchData={searchData} />
      <Table
        rowKey={'uid'}
        tableLayout="auto"
        columns={columns}
        dataSource={radiusLogList}
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
