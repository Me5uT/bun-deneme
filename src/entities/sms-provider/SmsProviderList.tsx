import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSafeState, useSetState } from 'ahooks';
import { Button, Drawer, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ISmsProviderListModel } from 'app/shared/model/sms-provider.model';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddSmsProviderWizard } from './AddSmsProviderWizard';
import { ProviderDetailForm } from './forms/ProviderDetailForm';
import { deleteEntity, getEntities } from './sms-provider.reducer';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const SmsProviderList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [states, setStates] = useSafeState<any>({
    infoModalOpenClose: false,
    selectedItemId: '',
    entityDetail: {},
    detailDrawerOpenClose: false,
  });
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const splitedSmsProviderList = useAppSelector(state => state.smsProvider.splitedSmsProviderList);
  const loading = useAppSelector(state => state.smsProvider.loading);
  const errorMessage = useAppSelector(state => state.smsProvider.errorMessage);

  const columns: ColumnsType<ISmsProviderListModel> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Provider Name',
      },
      {
        dataIndex: 'description',
        title: 'Description',
      },
      {
        dataIndex: 'actions',
        title: '',
        width: 100,
        render(value, record, index) {
          return (
            <ThreeDotDropdown>
              <Button
                className="ant-menu-item ant-menu-item-only-child"
                type="link"
                icon={<SearchOutlined />}
                onClick={() => {
                  setStates(prev => ({ ...prev, entityDetail: record, selectedItemId: record?.uid, detailDrawerOpenClose: true }));
                }}
              >
                {'Details'}
              </Button>
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/sms-provider/${record.uid}`);
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
                    setStates(prev => ({ ...prev, selectedItemId: record.uid, infoModalOpenClose: true }));
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
      <TableToolbar setModalOpenClose={setModalOpenClose} setSearchData={setSearchData} addButtonText={'Add Sms Provider'} />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={splitedSmsProviderList}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: splitedSmsProviderList?.length,
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
      >
        <AddSmsProviderWizard setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this sms provider, please click on the button below."
        type="danger"
        title="Do you want to delete this sms provider?"
        open={states?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ uid: states?.selectedItemId, accountId: baseObj?.accountId }));
          setStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
        onCancel={() => {
          setStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        confirmLoading={loading}
        onClose={() => {
          setResultModalOpenClose(false);
        }}
      /> */}
      <Drawer
        styles={{ body: { padding: 0 } }}
        width={640}
        destroyOnClose
        placement="right"
        title="SMS Provider Details"
        closable={true}
        onClose={() => {
          setStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={states?.detailDrawerOpenClose}
      >
        <ProviderDetailForm uid={states?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
