import { ColumnHeightOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Avatar, Button, Drawer, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { APP_DATE_FORMAT_2 } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ILocalStoragePortalModel } from 'app/shared/model/LocalStorage.model';
import { ITenant, LicenceStatusInt, TenantStatusInt, TenantTypeInt, TenantTypeStr } from 'app/shared/model/tenant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { setPortalToLocal } from 'app/shared/util/LocalStorage';
import { getColorByType, openNewTab } from 'app/shared/util/UtilityService';
import { formatDate } from 'app/shared/util/date-utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddAccountWizard } from './AddAccountWizard';
import { TableToolbar } from './TableToolbar';
import { deleteEntity, getEntities, getEntity } from './account.reducer';
import { AccountDetailDrawer } from './forms/AccountDetailDrawer';
import { BackTopButton } from 'app/shared/components/BackTopButton';
export const AccountList: React.FC = () => {
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [goToPortalModal, setgoToPortalModal] = React.useState<boolean>(false);
  const [mirketToken, setMirketToken] = React.useState<string>('');
  const [baseObj] = useMirketPortal();
  const [searchData, setSearchData] = useSetState<Partial<IQueryParams>>({
    size: 10,
    page: 0,
    accountId: baseObj?.accountId,
  });
  const [accountStates, setAccountStates] = React.useState({
    selectedItemId: '',
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tenantList = useAppSelector(state => state.account.entities);
  const entityCount = useAppSelector(state => state.account.entityCount);
  const loading = useAppSelector(state => state.account.loading);
  const errorMessage = useAppSelector(state => state.account.errorMessage);

  const columns: ColumnsType<ITenant> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'NAME',
        render(value, record, index) {
          return (
            <Space direction="horizontal">
              <Avatar
                size="default"
                style={{ backgroundColor: getColorByType(TenantTypeInt, record?.tenantType) }}
                icon={value[0].toUpperCase()}
              />
              <Space direction="vertical">
                <Space direction="horizontal">
                  {value}
                  <Tag color={getColorByType(TenantTypeInt, record?.tenantType)}>{Object.values(TenantTypeStr)[record?.tenantType]}</Tag>
                  <Tag color={getColorByType(TenantStatusInt, record?.tenantStatus)}>
                    {Object.values(TenantStatusInt)[record?.tenantStatus]}
                  </Tag>
                </Space>

                <div style={{ color: '#78829d' }}>{record?.domain}</div>
              </Space>
            </Space>
          );
        },
      },
      {
        dataIndex: 'msspName',
        title: 'PARENT ACCOUNT',
        responsive: ['md'],
        hidden: baseObj?.tenantType !== TenantTypeInt.MIRKET,
        render(value, record) {
          return <div style={{ color: '#6e6fa0', fontWeight: 'bold' }}>{value}</div>;
        },
      },
      {
        dataIndex: 'expireDate',
        title: 'EXPIRE DATE',
        render(value: number, record, index) {
          return <div>{formatDate(value, APP_DATE_FORMAT_2)}</div>;
        },
      },
      {
        dataIndex: 'licenceStatus',
        responsive: ['sm'],
        title: 'LICENCE STATUS',
        render(value, record, index) {
          return <Tag color={getColorByType(LicenceStatusInt, value)}>{Object.values(LicenceStatusInt)[value]}</Tag>;
        },
      },
      {
        dataIndex: 'actions',
        title: '',
        render(value, record, index) {
          return (
            <ThreeDotDropdown className={'account-action-td'}>
              <Button
                className="ant-menu-item ant-menu-item-only-child"
                type="link"
                icon={<SearchOutlined />}
                onClick={() => {
                  setAccountStates(prev => ({ ...prev, detailDrawerOpenClose: true, selectedItemId: record?.uid }));
                }}
              >
                {'Details'}
              </Button>
              {baseObj?.tenantType !== TenantTypeInt.PARTNER && !baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/accounts/${record?.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}

              <Tooltip title={!record?.isSupportActive ? 'Remote Support is OFF' : ''}>
                <Button
                  type="link"
                  icon={<ColumnHeightOutlined />}
                  onClick={async () => {
                    // en güncel veriyi almak için ilgili account'un detayını çek isSupportActive aktif ise yönlendir yoksa uyarı göster
                    await dispatch(getEntity(record?.uid)).then((res: any) => {
                      if (res.payload?.data?.tenant?.isSupportActive) {
                        setPortalToLocal({
                          portal: record?.alias,
                          portalId: record?.uid,
                          domain: record?.domain,
                          tenantType: record?.tenantType,
                          tenantStatus: record?.tenantStatus,
                          expireDate: record?.expireDate,
                          licenceType: record?.licenceType,
                          licenceStatus: record?.licenceStatus,
                          licenceCount: record?.totalUser,
                          licenceUsage: record?.usedTotalUser,
                          tenantName: record?.name,
                          remoteSupport: record?.isSupportActive,
                          mentis: record?.mentis,
                        } as ILocalStoragePortalModel);
                        // Yeni sekmede ilgili portalı aç
                        openNewTab(`/${record?.alias}`);
                      } else {
                        setgoToPortalModal(prev => true);
                      }
                    });
                  }}
                >
                  {'Go to Portal'} {`${!record?.isSupportActive ? '*' : ''}`}
                </Button>
              </Tooltip>

              {baseObj?.tenantType !== TenantTypeInt.PARTNER && !baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setAccountStates(prev => ({ ...prev, infoModalOpenClose: true, selectedItemId: record?.uid }));
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
      <TableToolbar setModalOpenClose={setModalOpenClose} setSearchData={setSearchData} />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={tenantList || []}
        loading={loading}
        pagination={{
          current: searchData.page + 1,
          pageSize: searchData.size,
          total: entityCount,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
          onChange: (page, pageSize) => setSearchData({ page: page - 1, size: pageSize }),
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
      >
        <AddAccountWizard setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        destroyOnClose
        message="If you want to delete this account, please click on the button below."
        type="danger"
        title="Do you  want to delete this account?"
        open={accountStates?.infoModalOpenClose}
        isToken
        setTokenValue={setMirketToken}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ id: accountStates?.selectedItemId, mirketToken, accountId: baseObj?.accountId }));
          setAccountStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(prev => true);
        }}
        onCancel={() => {
          setAccountStates(prev => ({ ...prev, infoModalOpenClose: false }));
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
      <WarnDialog
        modalType={'error'}
        open={goToPortalModal}
        message={"This account's Remote Support is off!"}
        onOk={() => {
          setgoToPortalModal(prev => false);
        }}
        onClose={() => {
          setgoToPortalModal(prev => false);
        }}
      />

      <Drawer
        styles={{ body: { padding: 0 } }}
        width={640}
        destroyOnClose
        placement="right"
        title="Account Details"
        closable={true}
        onClose={() => {
          setAccountStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={accountStates?.detailDrawerOpenClose}
      >
        <AccountDetailDrawer uid={accountStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
