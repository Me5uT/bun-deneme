import { DeleteOutlined, EditOutlined, ExportOutlined, MailOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useSessionStorageState, useSize } from 'ahooks';
import { Button, Drawer, Dropdown, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BackTopButton } from 'app/shared/components/BackTopButton';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { DotIcon } from 'app/shared/components/DotIcon';
import { FormDialog } from 'app/shared/components/FormDialog';
import { MirketOTPCodeIcon } from 'app/shared/components/icons/MirketOTPCodeIcon';
import { PushNotificationIcon } from 'app/shared/components/icons/PushNotificationIcon';
import { SMSTokenIcon } from 'app/shared/components/icons/SMSTokenIcon';
import { TestSenderIcon } from 'app/shared/components/icons/TestSenderIcon';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { IParticipant, ParticipantStatusInt, ParticipantTypeInt, SenderTypeInt } from 'app/shared/model/participant.model';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddUserWizard } from './AddUserWizard';
import { UserDetailForm } from './forms/UserDetailForm';
import { TableToolbar } from './TableToolbar';
import {
  deleteEntity,
  getEntities,
  onExportUser,
  resetAllVerification,
  sendChangePasswordMail,
  testSend,
  testSendPush,
} from './usertemp.reducer';

export const UserList: React.FC = () => {
  const [participantStates, setParticipantStates] = React.useState({
    detailDrawerOpenClose: false,
    infoModalOpenClose: false,
    selectedAccountId: '',
    selectedRowKeys: [],
    selectedRows: [],
    participantUid: '',
    infoModalMessage: '',
    infoModalTitle: '',
    infoModalConfirmButtonText: 'OK',
    infoModalType: 'success',
    infoModalConfirm() {},
  });
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [modalOpenClose, setModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSessionStorageState<Partial<IQueryParams>>('user-pagination', {
    defaultValue: {
      page: 0,
      size: 10,
      isExternal: false,
    },
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const width = useSize(document.querySelector('body'))?.width;

  const userList = useAppSelector(state => state.userTemp.entities);
  const loading = useAppSelector(state => state.userTemp.loading);
  const entityCount = useAppSelector(state => state.userTemp.entityCount);
  const sendVerificationLoading = useAppSelector(state => state.userTemp.sendVerificationLoading);

  const columns: ColumnsType<IParticipant> = React.useMemo(
    () => [
      {
        dataIndex: 'username',
        title: 'USERNAME',
        ellipsis: true,
        render(value, record, index) {
          return (
            <Space
              className={record?.participantStatus === ParticipantStatusInt.Passive ? 'passive-column' : undefined}
              direction={width < 540 ? 'vertical' : 'horizontal'}
              align="center"
            >
              <DotIcon color={getColorByType(ParticipantStatusInt, record?.participantStatus)} size={8} />

              <div>{value}</div>
              {record?.participantType === ParticipantTypeInt.LDAP && (
                <Tag>{Object.values(ParticipantTypeInt)[record?.participantType]?.toString().toUpperCase()}</Tag>
              )}
            </Space>
          );
        },
      },
      {
        dataIndex: 'displayName',
        title: 'DISPLAY NAME',
        ellipsis: true,
        render(value, record, index) {
          return (
            <div className={record?.participantStatus === ParticipantStatusInt.Passive ? 'passive-column' : undefined}>
              {record?.displayName}
            </div>
          );
        },
      },
      {
        dataIndex: 'mail',
        title: 'MAIL',
        ellipsis: true,
        render(value, record, index) {
          return (
            <div className={record?.participantStatus === ParticipantStatusInt.Passive ? 'passive-column' : undefined}>{record?.mail}</div>
          );
        },
      },
      {
        dataIndex: 'verificationStatus',
        title: 'TOKEN',
        responsive: ['md'],
        render(value: number, record, index) {
          return (
            <Tag
              className={record?.participantStatus === ParticipantStatusInt.Passive ? 'passive-column' : undefined}
              color={getColorByType(VerificationStatusInt, value)}
            >
              {Object.values(VerificationStatusInt)[value]}
            </Tag>
          );
        },
      },
      {
        dataIndex: 'actions',
        title: '',
        width: 100,
        render(value: any, record: any, index: number) {
          return (
            <ThreeDotDropdown>
              <Button
                className="ant-menu-item ant-menu-item-only-child"
                type="link"
                icon={<SearchOutlined />}
                onClick={() => {
                  setParticipantStates(prev => ({ ...prev, participantUid: record?.uid, detailDrawerOpenClose: true }));
                }}
              >
                {'Details'}
              </Button>
              {!baseObj?.isReadOnly && (
                <Button
                  className="ant-menu-item ant-menu-item-only-child"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/${baseObj?.basePath}/user/${record.uid}`);
                  }}
                >
                  {'Edit'}
                </Button>
              )}
              {!baseObj?.isReadOnly && (
                <Tooltip title={!record?.mail && 'The user has no mail.'}>
                  <Button
                    type="link"
                    disabled={!record?.mail}
                    icon={<MailOutlined />}
                    onClick={() => {
                      setParticipantStates(prev => ({
                        ...prev,
                        infoModalOpenClose: true,
                        infoModalMessage: 'If you want to send Token Verification, please click on the button below.',
                        infoModalHasMirketToken: false,
                        infoModalTitle: 'Are you sure to Token Verification?',
                        infoModalType: 'success',
                        infoModalConfirmButtonText: 'OK',
                        infoModalConfirm() {
                          onResendVerification(record?.uid);
                        },
                      }));
                    }}
                  >
                    {'Send Token Verification'}
                  </Button>
                </Tooltip>
              )}
              {record?.participantType === ParticipantTypeInt.Local && !baseObj?.isReadOnly && (
                <Tooltip title={!record?.mail && 'The user has no mail.'}>
                  <Button
                    type="link"
                    disabled={!record?.mail}
                    icon={<MailOutlined />}
                    onClick={() => {
                      setParticipantStates(prev => ({
                        ...prev,
                        infoModalOpenClose: true,
                        infoModalMessage: 'If you want to set password mail, please click on the button below.',
                        infoModalHasMirketToken: false,
                        infoModalTitle: 'Are you sure to Set Password Mail?',
                        infoModalType: 'success',
                        infoModalConfirmButtonText: 'OK',
                        infoModalConfirm() {
                          onResetPassword(record?.uid);
                        },
                      }));
                    }}
                  >
                    {'Send Set Password Mail'}
                  </Button>
                </Tooltip>
              )}
              {!baseObj?.isReadOnly && (
                <Button
                  type="link"
                  danger
                  disabled={
                    record?.participantType === ParticipantTypeInt.LDAP &&
                    (record?.participantStatus === ParticipantStatusInt.Lock ||
                      record?.participantStatus === ParticipantStatusInt.Active ||
                      record?.participantStatus === ParticipantStatusInt.Syncing)
                  }
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setParticipantStates(prev => ({
                      ...prev,
                      selectedAccountId: record?.uid,
                      infoModalOpenClose: true,
                      infoModalMessage: 'If you want to delete this user, please click on the button below.',
                      infoModalHasMirketToken: false,
                      infoModalTitle: 'Are you sure to Delete This User?',
                      infoModalType: 'error',
                      infoModalConfirmButtonText: 'Delete',
                      infoModalConfirm() {
                        onDeleteParticipant(record?.uid, baseObj?.accountId, false);
                      },
                    }));
                  }}
                >
                  {'Delete'}
                </Button>
              )}
              {!baseObj?.isReadOnly && (
                <Dropdown
                  className="test-sender-dropdown"
                  menu={{
                    items: [
                      {
                        key: 'a',
                        label: (
                          <Tooltip title={!record?.phone && 'The user has no phone number.'}>
                            <Button
                              type="link"
                              disabled={!record?.phone}
                              icon={<SMSTokenIcon />}
                              style={{ width: '100%', justifyContent: 'start' }}
                              onClick={() => {
                                dispatch(
                                  testSend({
                                    participantUid: record.uid,
                                    senderType: SenderTypeInt.SMS,
                                  })
                                );
                                // setResultModalOpenClose(true);
                              }}
                            >
                              {'Sms'}
                            </Button>
                          </Tooltip>
                        ),
                      },
                      {
                        key: 'b',
                        label: (
                          <Button
                            disabled={baseObj?.isReadOnly || record?.verificationStatus !== VerificationStatusInt.Verified}
                            type="link"
                            style={{ width: '100%', justifyContent: 'start' }}
                            icon={<MirketOTPCodeIcon />}
                            onClick={() => {
                              dispatch(
                                testSend({
                                  participantUid: record.uid,
                                  senderType: SenderTypeInt.MIRKETOTP,
                                })
                              );
                            }}
                          >
                            {'Mirket OTP'}
                          </Button>
                        ),
                      },
                      {
                        key: 'c',
                        label: (
                          <Button
                            disabled={baseObj?.isReadOnly || record?.verificationStatus !== VerificationStatusInt.Verified}
                            style={{ width: '100%', justifyContent: 'start' }}
                            type="link"
                            icon={<PushNotificationIcon />}
                            onClick={() => {
                              dispatch(
                                testSendPush({
                                  participantUid: record.uid,
                                  senderType: SenderTypeInt.MIRKETPUSH,
                                })
                              );
                            }}
                          >
                            {'Mirket Push'}
                          </Button>
                        ),
                      },
                    ],
                  }}
                  trigger={['hover', 'click']}
                  placement="topLeft"
                >
                  <Button
                    icon={<TestSenderIcon />}
                    type="link"
                    onClick={e => {
                      e.preventDefault();
                    }}
                  >
                    {'Test Sender'}
                  </Button>
                </Dropdown>
              )}
            </ThreeDotDropdown>
          );
        },
      },
    ],
    [width, userList]
  );

  const onDeleteParticipant = async (uid, accountId, onDetail) => {
    console.log('🚀 ~ onDeleteParticipant ~ searchData:', searchData);
    await dispatch(deleteEntity({ uid, accountId, onDetail, searchData }));
    setParticipantStates(prev => ({ ...prev, infoModalOpenClose: false }));
    setResultModalOpenClose(prev => true);
  };

  const onResendVerification = async (uid: string) => {
    await dispatch(
      resetAllVerification({
        accountId: baseObj?.accountId,
        participantUids: [uid],
        inDetail: false,
      })
    );
    setParticipantStates(prev => ({ ...prev, infoModalOpenClose: false }));
    setResultModalOpenClose(prev => true);
  };

  const onResetPassword = async (uid: string) => {
    await dispatch(sendChangePasswordMail(uid));
    setParticipantStates(prev => ({ ...prev, infoModalOpenClose: false }));
    setResultModalOpenClose(prev => true);
  };

  const onSelectChange = (newSelectedRowKeys: string[], selectedRows: IParticipant[]) => {
    setParticipantStates(prev => ({ ...prev, selectedRowKeys: newSelectedRowKeys, selectedRows }));
  };

  const rowSelection: TableRowSelection<IParticipant> = {
    selectedRowKeys: participantStates?.selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleRefresh = () => {
    setRefreshing(true); // Butona basıldığında state'i true yap
    dispatch(getEntities({ ...searchData, accountId: baseObj?.accountId }));

    setTimeout(() => {
      setRefreshing(false); // 3 saniye sonra state'i false yap
    }, 3000);
  };

  React.useEffect(() => {
    dispatch(getEntities({ ...searchData, accountId: baseObj?.accountId }));
  }, [searchData]);

  React.useEffect(() => {
    setParticipantStates(prev => ({ ...prev, selectedRowKeys: [] }));
  }, [userList]);

  React.useEffect(() => {
    return () => {
      sessionStorage.removeItem('user-pagination');
    };
  }, []);

  return (
    <div>
      <TableToolbar
        setModalOpenClose={setModalOpenClose}
        setSearchData={setSearchData}
        selectedRowKeys={participantStates?.selectedRowKeys}
        selectedRows={participantStates?.selectedRows}
        searchData={searchData}
        refreshing={refreshing}
        actionButtons={
          !baseObj?.isReadOnly && (
            <>
              <Tooltip title="Export" trigger="hover">
                <Button
                  type="default"
                  loading={loading}
                  disabled={refreshing || userList.length === 0}
                  onClick={async () => {
                    await dispatch(onExportUser({}));
                  }}
                  icon={<ExportOutlined />}
                />
              </Tooltip>

              <Tooltip title="Refresh" trigger="hover">
                <Button
                  style={{ marginLeft: '10px' }}
                  type="default"
                  disabled={refreshing}
                  onClick={handleRefresh}
                  icon={<SyncOutlined spin={refreshing} />}
                />
              </Tooltip>
            </>
          )
        }
      />
      <Table
        rowKey={'uid'}
        tableLayout="fixed"
        rowSelection={baseObj?.isReadOnly ? null : rowSelection}
        columns={columns}
        dataSource={userList}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          current: searchData.page + 1,
          pageSize: searchData.size,
          total: entityCount,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
          onChange: (page, pageSize) => setSearchData(prev => ({ ...prev, page: page - 1, size: pageSize })),
        }}
      />
      <FormDialog
        destroyOnClose
        open={modalOpenClose}
        onClose={() => {
          setModalOpenClose(false);
        }}
        maxWidth={700}
        footer={null}
      >
        <AddUserWizard setModalOpenClose={setModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} searchParams={searchData} />
      </FormDialog>

      <DeleteDialog
        destroyOnClose
        message={participantStates?.infoModalMessage}
        type={participantStates?.infoModalType as any}
        title={participantStates?.infoModalTitle}
        open={participantStates?.infoModalOpenClose}
        okText={participantStates?.infoModalConfirmButtonText}
        okType={participantStates?.infoModalType === 'error' ? 'danger' : 'primary'}
        iconFade={true}
        confirmLoading={loading || sendVerificationLoading}
        onOk={participantStates?.infoModalConfirm}
        onCancel={() => {
          setParticipantStates(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
      />
      {/* <WarnDialog
        destroyOnClose
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(false);
        }}
      /> */}
      <Drawer
        destroyOnClose
        width={640}
        placement="right"
        title="User Details"
        closable={true}
        onClose={() => {
          setParticipantStates(prev => ({ ...prev, detailDrawerOpenClose: false }));
        }}
        open={participantStates?.detailDrawerOpenClose}
      >
        <UserDetailForm participantUid={participantStates?.participantUid} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
