import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Drawer, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminType, AdminTypeInt, IAdminModel } from 'app/shared/model/AdminModel';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEntity, getEntities } from './admin.reducer';
import { AddAdminForm } from './forms/AddAdminForm';
import { AdminDetailDrawer } from './forms/AdminDetailDrawer';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const AdminList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);

  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });
  const [adminStates, setAdminStates] = React.useState({
    selectedItemId: '',
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const adminList = useAppSelector(state => state.admin.entities);
  const loading = useAppSelector(state => state.admin.loading);
  const errorMessage = useAppSelector(state => state.admin.errorMessage);

  const columns: ColumnsType<IAdminModel> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'DISPLAY NAME',
        render(value, record, index) {
          return <Space direction="horizontal">{`${record.firstName} ${record.lastName}`}</Space>;
        },
      },
      {
        dataIndex: 'email',
        title: 'MAIL',
        ellipsis: true,
      },
      {
        dataIndex: 'verificationStatus',
        title: 'Token',
        width: 150,
        responsive: ['md'],
        render(value, record, index) {
          return (
            <Tag color={getColorByType(VerificationStatusInt, record.verificationStatus)}>
              {Object.values(VerificationStatusInt)[record.verificationStatus]}
            </Tag>
          );
        },
      },
      {
        dataIndex: 'actions',
        title: '',
        width: 100,
        render(value, record, index) {
          return (
            <ThreeDotDropdown className={'admin-action-td'}>
              <Button
                className="ant-menu-item ant-menu-item-only-child"
                type="link"
                icon={<SearchOutlined />}
                onClick={() => {
                  setAdminStates(prev => ({ ...prev, selectedItemId: record?.uid, detailDrawerOpenClose: true }));
                }}
              >
                {'Details'}
              </Button>

              {!baseObj?.isReadOnly && !(record?.adminType === AdminTypeInt.OWNER && baseObj?.adminType !== AdminTypeInt.OWNER) && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/administration/${record.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}

              {record.adminType !== AdminTypeInt.OWNER && !baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setAdminStates(prev => ({ ...prev, selectedItemId: record?.uid, infoModalOpenClose: true }));
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
      <TableToolbar setModalOpenClose={setModalOpenClose} setSearchData={setSearchData} addButtonText={'Add Admin'} />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={adminList}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: adminList?.length,
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
          setModalOpenClose(prev => false);
        }}
        maxWidth={600}
        footer={null}
        dialogTitle={'Add Admin'}
      >
        <AddAdminForm setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this admin, please click on the button below."
        type="danger"
        title="Do you want to delete this admin?"
        open={adminStates?.infoModalOpenClose}
        okText={'DELETE'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ adminId: adminStates?.selectedItemId, accountId: baseObj?.accountId }));
          setAdminStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(prev => true);
        }}
        onCancel={() => {
          setAdminStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(prev => true);
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
        title="Admin Details"
        closable={true}
        onClose={() => {
          setAdminStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={adminStates?.detailDrawerOpenClose}
      >
        <AdminDetailDrawer uid={adminStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
