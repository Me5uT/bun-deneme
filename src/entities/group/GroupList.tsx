import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Drawer, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGroup } from 'app/shared/model/GroupModel';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddGroupForm } from './AddGroupForm';
import { deleteEntity, getEntities } from './group.reducer';
import { GroupDetailDrawer } from './GroupDetailDrawer';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const GroupList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });

  const [groupStates, setGroupStates] = React.useState({
    selectedItemId: '',
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const groupList = useAppSelector(state => state.group.entities);
  const loading = useAppSelector(state => state.group.loading);
  const errorMessage = useAppSelector(state => state.group.errorMessage);

  const columns: ColumnsType<IGroup> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Group Name',
      },
      {
        dataIndex: 'totalParticipant',
        title: 'Total Users',
        render(value, record, index) {
          return <div>{value === null ? 0 : value}</div>;
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
                  setGroupStates(prev => ({ ...prev, selectedItemId: record?.uid, detailDrawerOpenClose: true }));
                }}
              >
                {'Details'}
              </Button>

              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/group/${record.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}

              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setGroupStates(prev => ({ ...prev, selectedItemId: record?.uid, infoModalOpenClose: true }));
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

  React.useEffect(() => {
    dispatch(getEntities(searchData));
  }, [searchData]);

  return (
    <div>
      <TableToolbar setModalOpenClose={setModalOpenClose} setSearchData={setSearchData} addButtonText={'Add Group'} />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={groupList || []}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: groupList?.length,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
      />
      <FormDialog
        open={modalOpenClose}
        onClose={() => {
          setModalOpenClose(false);
        }}
        maxWidth={700}
        footer={null}
        dialogTitle="Add Group"
      >
        <AddGroupForm setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this group, please click on the button below."
        type="danger"
        title="Do you  want to delete this group?"
        open={groupStates?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={() => {
          dispatch(deleteEntity({ ...searchData, groupId: groupStates?.selectedItemId, accountId: baseObj?.accountId }));

          setGroupStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(true);
        }}
        onCancel={() => {
          setGroupStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(false);
        }}
      /> */}
      <Drawer
        styles={{ body: { padding: 0 } }}
        width={640}
        destroyOnClose
        placement="right"
        title="Group Details"
        closable={true}
        onClose={() => {
          setGroupStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={groupStates?.detailDrawerOpenClose}
      >
        <GroupDetailDrawer uid={groupStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
