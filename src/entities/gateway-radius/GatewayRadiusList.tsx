import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  JavaOutlined,
  SearchOutlined,
  SyncOutlined,
  WindowsFilled,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSetState } from 'ahooks';
import { Button, Drawer, Dropdown, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { FormDialog } from 'app/shared/components/FormDialog';
import { TableToolbar } from 'app/shared/components/TableToolbar';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { GatewayStatusInt, IGateway, RadiusGatewayDownloadOption } from 'app/shared/model/gateway.model';
import { getColorByType, handleCopy } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddRadiusForm } from './forms/AddRadiusForm';
import { RadiusGatewayDetailDrawer } from './forms/RadiusGatewayDetailDrawer';
import { deleteEntity, downloadRadiusConfig, getEntities } from './gatewayRadius.reducer';
import { ConfigModal } from './forms/ConfigModal';
import { downloadRadiusGatewayURL, goToDownloadRadiusGateway } from 'app/shared/util/ExportAndDownload';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const GatewayRadiusList: React.FC = () => {
  const [baseObj] = useMirketPortal();
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [configModalOpenClose, setConfigModalOpenClose] = React.useState<boolean>(false);
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState({ searchtext: '', accountId: baseObj?.accountId });
  const [radiusGatewayStates, setRadiusGatewayStates] = React.useState({
    selectedItemId: '',
    infoModalOpenClose: false,
    detailDrawerOpenClose: false,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const gatewayRadiusList = useAppSelector(state => state.gatewayRadius.gatewayRadiusList);
  const loading = useAppSelector(state => state.gatewayRadius.loading);
  const downloadRadiusGatewayLoading = useAppSelector(state => state.gatewayRadius.downloadRadiusGatewayLoading);
  const radiusConfigSTR = useAppSelector(state => state.gatewayRadius.radiusConfigSTR);

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
                  setRadiusGatewayStates(prev => ({ ...prev, detailDrawerOpenClose: true, selectedItemId: record?.uid }));
                }}
              >
                {'Details'}
              </Button>

              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/gateway-radius/${record?.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}

              <Dropdown
                className="test-sender-dropdown"
                menu={{
                  items: [
                    {
                      key: 'forwindowsbutton',
                      label: (
                        <Button
                          disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly}
                          type="link"
                          icon={<WindowsFilled style={{ fontSize: 20 }} />}
                          style={{ width: '100%', justifyContent: 'start' }}
                          onClick={() => {
                            goToDownloadRadiusGateway();
                          }}
                        >
                          {'Full Setup'}
                        </Button>
                      ),
                    },
                    {
                      key: 'forconfigbutton',
                      label: (
                        <Button
                          disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly}
                          style={{ width: '100%', justifyContent: 'start' }}
                          type="link"
                          icon={<FontAwesomeIcon icon={'gears'} style={{ fontSize: 20 }} />}
                          onClick={() => {
                            dispatch(downloadRadiusConfig({ uid: record?.uid }));
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
                  disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  {'Download'}
                </Button>
              </Dropdown>

              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setRadiusGatewayStates(prev => ({ ...prev, infoModalOpenClose: true, selectedItemId: record?.uid }));
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
        addButtonText="Add Radius Gateway"
        actionButtons={
          <Tooltip title="Refresh" trigger="hover">
            <Button type="default" disabled={refreshing} onClick={handleRefresh} icon={<SyncOutlined spin={refreshing} />} />
          </Tooltip>
        }
      />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={gatewayRadiusList || []}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: gatewayRadiusList?.length,
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
        maxWidth={800}
        footer={null}
        dialogTitle={'Add Radius Gateway'}
      >
        <AddRadiusForm setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
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
        dialogTitle={'Radius Setup Config'}
      >
        <ConfigModal />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this gateway, please click on the button below."
        type="danger"
        title="Do you  want to delete this gateway?"
        open={radiusGatewayStates?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={async () => {
          await dispatch(deleteEntity({ uid: radiusGatewayStates?.selectedItemId, accountId: baseObj?.accountId, onDetail: false }));
          setRadiusGatewayStates(prev => ({ ...prev, infoModalOpenClose: false }));
          setResultModalOpenClose(true);
        }}
        onCancel={() => {
          setRadiusGatewayStates(prev => ({ ...prev, infoModalOpenClose: false }));
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
        title="Radius Gateway Details"
        closable={true}
        onClose={() => {
          setRadiusGatewayStates(prev => ({ ...prev, detailDrawerOpenClose: false, selectedItemId: '' }));
        }}
        open={radiusGatewayStates?.detailDrawerOpenClose}
      >
        <RadiusGatewayDetailDrawer uid={radiusGatewayStates?.selectedItemId} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
