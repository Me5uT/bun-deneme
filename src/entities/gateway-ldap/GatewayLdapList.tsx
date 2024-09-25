import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SearchOutlined,
  SyncOutlined,
  WindowsFilled,
} from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Drawer, Dropdown, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { GatewayStatusInt, IGateway, LDAPGatewayDownloadOption } from 'app/shared/model/gateway.model';
import { getColorByType, handleCopy } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddLdapForm } from './forms/AddLdapForm';
import { LDAPGatewayDetailDrawer } from './forms/LDAPGatewayDetailDrawer';
import { deleteEntity, downloadLDAPGateway, getEntities } from './gatewayLdap.reducer';
import { goToDownloadLDAPGateway } from 'app/shared/util/ExportAndDownload';
import { ConfigModal } from './forms/ConfigModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const GatewayLdapList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [configModalOpenClose, setConfigModalOpenClose] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });
  const [ldapGatewayStates, setLDAPGatewayStates] = React.useState({
    selectedItemId: '',
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const gatewayLdapList = useAppSelector(state => state.gatewayLdap.gatewayLdapList);
  const loading = useAppSelector(state => state.gatewayLdap.loading);
  const downloadRadiusGatewayLoading = useAppSelector(state => state.gatewayLdap.downloadRadiusGatewayLoading);
  const errorMessage = useAppSelector(state => state.gatewayLdap.errorMessage);
  const radiusConfigSTR = useAppSelector(state => state.gatewayLdap.radiusConfigSTR);

  const columns: ColumnsType<IGateway> = React.useMemo(
    () => [
      {
        dataIndex: 'name',
        title: 'Gateway Name',
      },
      {
        dataIndex: 'version',
        title: 'Version',
        responsive: ['md'],
      },
      {
        dataIndex: 'gatewayStatus',
        title: 'Status',
        responsive: ['md'],
        render(value, record, index) {
          return <Tag color={getColorByType(GatewayStatusInt, value)}>{Object.values(GatewayStatusInt)[value]}</Tag>;
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
                  setLDAPGatewayStates(prev => ({ ...prev, detailDrawerOpenClose: true, selectedItemId: record?.uid }));
                }}
              >
                {'Details'}
              </Button>
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/gateway-ldap/${record.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}

              {baseObj?.adminProfile !== AdminProfileInt.ReadOnly && (
                <Dropdown
                  className="test-sender-dropdown"
                  menu={{
                    items: [
                      {
                        key: 'forwindowsbutton',
                        label: (
                          <Button
                            type="link"
                            icon={<WindowsFilled style={{ fontSize: 20 }} />}
                            style={{ width: '100%', justifyContent: 'start' }}
                            onClick={() => {
                              goToDownloadLDAPGateway();
                            }}
                          >
                            {'Full'}
                          </Button>
                        ),
                      },

                      {
                        key: 'forconfigbutton',
                        label: (
                          <Button
                            style={{ width: '100%', justifyContent: 'start' }}
                            icon={<FontAwesomeIcon icon={'gears'} style={{ fontSize: 20 }} />}
                            type="link"
                            // icon={<FontAwesomeIcon icon={'gears'} />}
                            onClick={() => {
                              dispatch(
                                downloadLDAPGateway({
                                  uid: record?.uid,
                                  ldapGatewayDownloadOption: LDAPGatewayDownloadOption.CONFIG,
                                })
                              );
                              setConfigModalOpenClose(true);
                            }}
                          >
                            {'Config'}
                          </Button>
                        ),
                      },
                    ],
                  }}
                  trigger={['hover']}
                  placement="bottomLeft"
                >
                  <Button
                    icon={<DownloadOutlined />}
                    type="link"
                    onClick={e => {
                      e.preventDefault();
                    }}
                  >
                    {'Download'}
                  </Button>
                </Dropdown>
              )}

              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setLDAPGatewayStates(prev => ({ ...prev, infoModalOpenClose: true, selectedItemId: record?.uid }));
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
        addButtonText="Add LDAP Gateway"
        actionButtons={
          <Tooltip title="Refresh" trigger="hover">
            <Button type="default" disabled={refreshing} onClick={handleRefresh} icon={<SyncOutlined spin={refreshing} />} />
          </Tooltip>
        }
      />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={gatewayLdapList}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: gatewayLdapList?.length,
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
        dialogTitle={'Add LDAP'}
      >
        <AddLdapForm setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this gateway, please click on the button below."
        type="danger"
        title="Do you  want to delete this gateway?"
        open={ldapGatewayStates?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ uid: ldapGatewayStates?.selectedItemId, accountId: baseObj?.accountId, onDetail: false }));
          setLDAPGatewayStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(true);
        }}
        onCancel={() => {
          setLDAPGatewayStates(prev => ({ ...prev, infoModalOpenClose: false }));
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
      <FormDialog
        closeIcon
        destroyOnClose
        loading={downloadRadiusGatewayLoading}
        open={configModalOpenClose}
        onClose={() => {
          setConfigModalOpenClose(prev => false);
        }}
        styles={{ body: { height: 'auto' } }}
        maxWidth={800}
        footer={
          <Button type="primary" icon={<CopyOutlined />} block onClick={() => handleCopy(radiusConfigSTR)}>
            COPY
          </Button>
        }
        dialogTitle={'LDAP Setup Config'}
      >
        <ConfigModal />
      </FormDialog>
      <Drawer
        styles={{ body: { padding: 0 } }}
        width={640}
        destroyOnClose
        placement="right"
        title="LDAP Gateway Details"
        closable={true}
        onClose={() => {
          setLDAPGatewayStates(prev => ({ ...prev, detailDrawerOpenClose: false, selectedItemId: '' }));
        }}
        open={ldapGatewayStates?.detailDrawerOpenClose}
      >
        <LDAPGatewayDetailDrawer uid={ldapGatewayStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
