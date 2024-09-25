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
import { IAttributeProfile } from 'app/shared/model/AttributeProfile.model';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEntity, getEntities } from './attributeProfile.reducer';
import { AddLdapProfileForm } from './forms/AddLdapProfileForm';
import { AttributeProfileDetailDrawer } from './forms/AttributeProfileDetailDrawer';
import { BackTopButton } from 'app/shared/components/BackTopButton';
export const AttributeProfileList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });

  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [attributeStates, setAttributeStates] = React.useState({
    selectedItemId: '',
    entityDetail: {} as IAttributeProfile,
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const ldapProfileList = useAppSelector(state => state.attributeProfile.entities);
  const loading = useAppSelector(state => state.attributeProfile.loading);
  const errorMessage = useAppSelector(state => state.attributeProfile.errorMessage);

  const columns: ColumnsType<IAttributeProfile> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Attribute Name',
      },
      {
        dataIndex: 'description',
        title: 'Description',
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
                  setAttributeStates(prev => ({ ...prev, entityDetail: record, selectedItemId: record?.uid, detailDrawerOpenClose: true }));
                }}
              >
                {'Details'}
              </Button>
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/attribute-profile/${record.uid}`);
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
                    setAttributeStates(prev => ({ ...prev, selectedItemId: record?.uid, infoModalOpenClose: true }));
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
      <TableToolbar setModalOpenClose={setModalOpenClose} setSearchData={setSearchData} addButtonText={'Add Attribute Profile'} />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={ldapProfileList || []}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: ldapProfileList?.length,
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
        maxWidth={700}
        footer={null}
        dialogTitle={'Add Attribute Profile'}
      >
        <AddLdapProfileForm setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this Attribute Profile, please click on the button below."
        type="danger"
        title="Do you  want to delete this Attribute Profile?"
        open={attributeStates?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ attrId: attributeStates?.selectedItemId, accountId: baseObj?.accountId, onDetail: false }));
          setAttributeStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
        onCancel={() => {
          setAttributeStates(prev => ({ ...prev, infoModalOpenClose: false }));
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
        title="Attribute Profile Details"
        closable={true}
        onClose={() => {
          setAttributeStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={attributeStates?.detailDrawerOpenClose}
      >
        <AttributeProfileDetailDrawer uid={attributeStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
