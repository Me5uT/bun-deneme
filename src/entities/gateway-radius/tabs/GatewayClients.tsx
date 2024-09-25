import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import React from 'react';
import { useParams } from 'react-router-dom';
import { AddEditClientForm } from '../forms/AddEditClientForm';
import { deleteClient, getClientsByGateway } from '../gatewayRadius.reducer';
import { TableToolbar } from './TableToolbar';
import { BackTopButton } from 'app/shared/components/BackTopButton';

interface IStates {
  selectedItemId?: string;
  item?: any;
  infoModalOpenClose?: boolean;
  resultModalOpenClose?: boolean;
  modalOpenClose?: boolean;
  modalFormType?: 'add' | 'edit';
}
export const GatewayClients: React.FC = () => {
  const [searchData, setSearchData] = useSetState({ searchtext: '' });
  const [states, setStates] = useSetState<IStates>({
    selectedItemId: '',
    item: {},
    infoModalOpenClose: false,
    resultModalOpenClose: false,
    modalOpenClose: false,
    modalFormType: 'add',
  });

  const { id } = useParams<'id'>();

  const [baseObj] = useMirketPortal();
  const dispatch = useAppDispatch();

  const clientListByGateway = useAppSelector(state => state.gatewayRadius.clientListByGateway);
  const loading = useAppSelector(state => state.gatewayRadius.loading);
  const errorMessage = useAppSelector(state => state.gatewayRadius.errorMessage);
  const clientLoading = useAppSelector(state => state.gatewayRadius.clientLoading);

  const columns: ColumnsType<any> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        dataIndex: 'ipAddress',
        title: 'IP Address',
      },
      {
        dataIndex: 'secretKey',
        title: 'Secret Key',
        render(value, record, index) {
          return <div>{value.split('').fill('*')}</div>;
        },
      },
      {
        dataIndex: 'actions',
        title: '',
        render(value, record, index) {
          return (
            <ThreeDotDropdown>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setStates({ selectedItemId: record.uid, modalFormType: 'edit', item: record, modalOpenClose: true });
                }}
              >
                {'Edit'}
              </Button>

              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setStates({ selectedItemId: record.uid, infoModalOpenClose: true });
                }}
              >
                {'Delete'}
              </Button>
            </ThreeDotDropdown>
          );
        },
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(
      getClientsByGateway({
        accountId: baseObj?.accountId,
        gatewayId: id,
        searchtext: searchData.searchtext,
      })
    );
  }, [searchData.searchtext, id, baseObj?.accountId]);

  return (
    <div>
      <TableToolbar setStates={setStates} setSearchData={setSearchData} addButtonText="Add Radius Client" />

      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={clientListByGateway}
        loading={clientLoading}
        pagination={{
          pageSize: 10,
          total: clientListByGateway?.length,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
      />
      <FormDialog
        destroyOnClose
        open={states.modalOpenClose}
        onClose={() => {
          setStates({
            modalOpenClose: false,

            selectedItemId: '',
            item: null,
          });
        }}
        maxWidth={600}
        footer={null}
        dialogTitle={`${states.modalFormType === 'add' ? 'Add' : 'Edit'} Client`}
      >
        <AddEditClientForm
          setStates={setStates}
          formType={states?.modalFormType}
          item={states?.item}
          ids={clientListByGateway.map(c => c.ipAddress) || []}
        />
      </FormDialog>

      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={states.resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setStates({ resultModalOpenClose: false });
        }}
      /> */}
      <DeleteDialog
        message="If you want to delete this client, please click on the button below."
        type="danger"
        title="Do you want to delete this client?"
        open={states.infoModalOpenClose}
        okText={'DELETE'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteClient({ uid: states.selectedItemId, accountId: baseObj?.accountId, gatewayId: id }));
          setStates({ infoModalOpenClose: false, selectedItemId: '' });
        }}
        onCancel={() => {
          setStates({ infoModalOpenClose: false, selectedItemId: '' });
        }}
      />
      <BackTopButton />
    </div>
  );
};
