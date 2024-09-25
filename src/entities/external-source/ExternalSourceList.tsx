import { DeleteOutlined, EditOutlined, ReconciliationOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSetState } from 'ahooks';
import { Button, Drawer, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ESyncStatus, ESyncStatusStr, IExternalSourceModel } from 'app/shared/model/externalSourceModel';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEntity, getEntities, syncExternalSource } from './externalSource.reducer';
import { AddExternalSourceForm } from './forms/AddExternalSourceForm';
import { ExternalSourceDetailDrawer } from './forms/ExternalSourceDetailDrawer';
import { getColorByType } from 'app/shared/util/UtilityService';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const ExternalSourceList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });
  const [externalSourceStates, setExternalSourceStates] = React.useState({
    selectedItemId: '',
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const externalSourceList = useAppSelector(state => state.externalSource.entities);
  const loading = useAppSelector(state => state.externalSource.loading);
  const errorMessage = useAppSelector(state => state.externalSource.errorMessage);

  const columns: ColumnsType<IExternalSourceModel> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'EXTERNAL SOURCE',
      },
      {
        dataIndex: 'lastSyncStatus',
        title: 'SYNC STATUS',
        render(value, record, index) {
          return (
            (record?.lastSyncStatus !== null || record?.lastSyncStatus !== undefined) && (
              <Tag color={getColorByType(ESyncStatus, record?.lastSyncStatus)}>{Object.values(ESyncStatusStr)[record?.lastSyncStatus]}</Tag>
            )
          );
        },
      },
      {
        dataIndex: 'totalParticipant',
        title: 'TOTAL USER',
        render(value, record, index) {
          return <div>{record?.totalParticipant || '0'}</div>;
        },
      },
      {
        dataIndex: 'validParticipant',
        title: 'VALID USER',
        render(value, record, index) {
          return <div>{record?.validParticipant || '0'}</div>;
        },
      },
      {
        dataIndex: 'actions',
        title: '',
        render(value, record, index) {
          return (
            <ThreeDotDropdown>
              <Button
                className="ant-menu-item ant-menu-item-only-child"
                type="link"
                icon={<SearchOutlined />}
                onClick={() => {
                  setExternalSourceStates(prev => ({ ...prev, detailDrawerOpenClose: true, selectedItemId: record?.uid }));
                }}
              >
                {'Details'}
              </Button>
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/external-source/${record.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<FontAwesomeIcon icon={'rotate'} />}
                  onClick={() => {
                    dispatch(
                      syncExternalSource({
                        accountId: baseObj?.accountId,
                        externalSourceId: record?.uid,
                      })
                    );
                  }}
                >
                  {'Sync'}
                </Button>
              )}
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<ReconciliationOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/external-source/report`, { state: { uid: record?.uid } });
                  }}
                >
                  {'Report'}
                </Button>
              )}
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setExternalSourceStates(prev => ({ ...prev, infoModalOpenClose: true, selectedItemId: record?.uid }));
                  }}
                >
                  {'Delete'}
                </Button>
              )}
            </ThreeDotDropdown>
          );
        },
      },
    ],
    []
  );

  const handleRefresh = () => {
    setRefreshing(true); // Butona basıldığında state'i true yap
    dispatch(getEntities(searchData));
    setTimeout(() => {
      setRefreshing(false); // 3 saniye sonra state'i false yap
    }, 3000);
  };

  React.useEffect(() => {
    dispatch(getEntities(searchData));
  }, [searchData]);

  return (
    <div>
      <TableToolbar
        setModalOpenClose={setModalOpenClose}
        setSearchData={setSearchData}
        addButtonText={'Add External Source'}
        actionButtons={
          <Tooltip title="Refresh" trigger="hover">
            <Button type="default" disabled={refreshing} onClick={handleRefresh} icon={<SyncOutlined spin={refreshing} />} />
          </Tooltip>
        }
      />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={externalSourceList}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: externalSourceList?.length,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
      />

      <FormDialog
        destroyOnClose
        open={modalOpenClose}
        onClose={() => {
          setModalOpenClose(prev => false);
        }}
        maxWidth={700}
        footer={null}
        dialogTitle={'Add External Source'}
      >
        <AddExternalSourceForm setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this External Source, please click on the button below."
        type="danger"
        title="Do you want to delete this External Source?"
        open={externalSourceStates?.infoModalOpenClose}
        okText={'DELETE'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ uid: externalSourceStates?.selectedItemId, accountId: baseObj?.accountId, onDetail: false }));

          setExternalSourceStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(true);
        }}
        onCancel={() => {
          setExternalSourceStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(prev => false);
        }}
      /> */}
      <Drawer
        styles={{ body: { padding: 0 } }}
        width={640}
        destroyOnClose
        placement="right"
        title="External Source Details"
        closable={true}
        onClose={() => {
          setExternalSourceStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={externalSourceStates?.detailDrawerOpenClose}
      >
        <ExternalSourceDetailDrawer uid={externalSourceStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
