import { DeleteOutlined, LockOutlined, MailOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Dropdown, Form, MenuProps, Space, Spin, Tabs, TabsProps, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { MirketOTPCodeIcon } from 'app/shared/components/icons/MirketOTPCodeIcon';
import { PushNotificationIcon } from 'app/shared/components/icons/PushNotificationIcon';
import { SMSTokenIcon } from 'app/shared/components/icons/SMSTokenIcon';
import { TestSenderIcon } from 'app/shared/components/icons/TestSenderIcon';
import { TOTPIcon } from 'app/shared/components/icons/TOTPIcon';
import { ProfileCard } from 'app/shared/components/ProfileCard';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { TransferActions } from 'app/shared/model/GroupModel';
import { IParticipantDetail, ParticipantStatusInt, ParticipantTypeInt, SenderTypeInt } from 'app/shared/model/participant.model';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { findObjectChanges, getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MemberOfGroup } from './tabs/MemberOfGroup';
import { UserOverview } from './tabs/UserOverview';
import { UserSettings } from './tabs/UserSettings';
import {
  changeEntityStatus,
  deleteEntity,
  getEntity,
  onEditParticipantGroups,
  resetAllVerification,
  sendChangePasswordMail,
  sendTOTP,
  testSend,
  testSendPush,
  updateEntity,
} from './usertemp.reducer';

export const UserDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('overview');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);
  const [newUsersOrGroupsList, setNewUserOrGroupsList] = React.useState<any[]>([]);
  const [participantStates, setParticipantStates] = React.useState({
    detailDrawerOpenClose: false,
    infoModalOpenClose: false,
    selectedAccountId: '',
    selectedRowKeys: [],
    participantUid: '',
    infoModalMessage: '',
    infoModalTitle: '',
    infoModalConfirmButtonText: 'OK',
    infoModalType: 'success',
    infoModalConfirm() {},
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [baseObj] = useMirketPortal();

  const participant: IParticipantDetail = useAppSelector(state => state.userTemp.entity);
  const loading: boolean = useAppSelector(state => state.userTemp.loading);
  const sendVerificationLoading = useAppSelector(state => state.userTemp.sendVerificationLoading);

  const { id } = useParams<'id'>();
  const tabs: TabsProps['items'] =
    participant?.participantType === ParticipantTypeInt.LDAP
      ? [
          {
            label: 'Overview',
            children: <UserOverview />,
            key: 'overview',
          },

          {
            label: 'Member of Groups',
            children: <MemberOfGroup setShowSaveButton={setShowSaveButton} setNewUserOrGroupsList={setNewUserOrGroupsList} />,
            key: 'group',
          },
        ]
      : [
          {
            label: 'Overview',
            children: <UserOverview />,
            key: 'overview',
          },
          {
            label: 'User Info',
            key: 'settings',

            style: {
              height: '250px',
            },
            disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly,
            children: <UserSettings form={form} />,
          },
          {
            label: 'Member of Groups',
            children: <MemberOfGroup setShowSaveButton={setShowSaveButton} setNewUserOrGroupsList={setNewUserOrGroupsList} />,
            key: 'group',
          },
        ];

  const testSenders: MenuProps['items'] = React.useMemo(
    () => [
      {
        key: 'a',
        label: (
          <Tooltip title={!participant?.phone && 'The user has no phone number.'}>
            <Button
              disabled={baseObj?.adminProfile === AdminProfileInt.ReadOnly || !participant?.phone}
              type="link"
              icon={<SMSTokenIcon />}
              style={{ width: '100%', justifyContent: 'start' }}
              onClick={() => {
                dispatch(
                  testSend({
                    participantUid: id,
                    senderType: SenderTypeInt.SMS,
                  })
                );
                setResultModalOpenClose(true);
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
            disabled={baseObj?.isReadOnly || participant?.verificationStatus !== VerificationStatusInt.Verified}
            type="link"
            style={{ width: '100%', justifyContent: 'start' }}
            icon={<MirketOTPCodeIcon />}
            onClick={() => {
              dispatch(
                testSend({
                  participantUid: id,
                  senderType: SenderTypeInt.MIRKETOTP,
                })
              );
              setResultModalOpenClose(true);
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
            disabled={baseObj?.isReadOnly || participant?.verificationStatus !== VerificationStatusInt.Verified}
            style={{ width: '100%', justifyContent: 'start' }}
            type="link"
            icon={<PushNotificationIcon />}
            onClick={() => {
              dispatch(
                testSendPush({
                  participantUid: id,
                  senderType: SenderTypeInt.MIRKETPUSH,
                })
              );
              setResultModalOpenClose(true);
            }}
          >
            {'Mirket Push'}
          </Button>
        ),
      },
    ],
    [participant, baseObj]
  );

  const onFinish = async (values: any) => {
    switch (generalTab) {
      case 'settings': {
        const serializedValues = {
          ...values,
          uid: id,
          accountId: baseObj?.accountId,
        };
        await dispatch(updateEntity(serializedValues));
        setShowSaveButton(false);
        setResultModalOpenClose(true);

        break;
      }

      case 'group': {
        const initialArray = participant?.participantGroups;

        const changes = findObjectChanges(initialArray, newUsersOrGroupsList);

        if (changes.removed.length > 0) {
          await dispatch(
            onEditParticipantGroups({
              accountId: baseObj?.accountId,
              participantId: id,
              participantGroups: changes.removed.map(k => ({
                action: TransferActions.REMOVE,
                participantGroupId: k.uid,
              })),
            })
          );
        }

        if (changes.added.length > 0) {
          await dispatch(
            onEditParticipantGroups({
              accountId: baseObj?.accountId,
              participantId: id,
              participantGroups: changes.added.map(k => ({
                action: TransferActions.ADD,
                participantGroupId: k.uid,
              })),
            })
          );
        }

        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);
        break;
      }

      default:
        break;
    }
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  const onDelete = async () => {
    await dispatch(deleteEntity({ uid: id, accountId: baseObj?.accountId, onDetail: true }));
    setInfoModalOpenClose(false);
    navigate(`/${baseObj?.basePath}/user`);
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

  React.useEffect(() => {
    dispatch(
      getEntity({
        participantUid: id,
        accountId: baseObj?.accountId,
      })
    );
  }, []);

  if (!participant || loading) return <Spin fullscreen />;

  return (
    <div style={{ width: '100%' }}>
      <ProfileCard
        avatarColor={getColorByType(ParticipantTypeInt, participant?.participantType)}
        backgroundColor={getColorByType(ParticipantTypeInt, participant?.participantType)}
        statusIcon={participant?.verificationStatus as any}
        statusIconTooltip={Object.values(VerificationStatusInt)[participant?.verificationStatus] as string}
        description={participant?.displayName}
        tagText={Object.values(ParticipantTypeInt)[participant?.participantType] as string}
        title={participant?.username}
      />
      <Divider style={{ margin: '10px 0px' }} />
      <Card>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onFieldsChange={onFieldsChange} initialValues={participant}>
          <Tabs
            defaultActiveKey="overview"
            destroyInactiveTabPane
            activeKey={generalTab}
            onChange={(a: string) => {
              form.resetFields();
              setShowSaveButton(false);
              setgeneralTab(prev => a);
            }}
            items={tabs}
            tabBarExtraContent={
              !baseObj?.isReadOnly && (
                <Space direction="horizontal">
                  {generalTab !== 'overview' && showSaveButton && (
                    <Form.Item noStyle>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  )}
                  <ActionsDropdown className="user-detail-actions" trigger={['click']}>
                    <Tooltip title={!participant?.mail && 'The user has no mail.'}>
                      <Button
                        type="link"
                        disabled={!participant?.mail}
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
                              onResendVerification(id);
                            },
                          }));
                        }}
                      >
                        {'Send Token Verification'}
                      </Button>
                    </Tooltip>
                    {participant?.participantType === ParticipantTypeInt.Local && !baseObj?.isReadOnly && (
                      <Tooltip title={!participant?.mail && 'The user has no mail.'}>
                        <Button
                          type="link"
                          disabled={!participant?.mail}
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
                                onResetPassword(id);
                              },
                            }));
                          }}
                        >
                          {'Send Set Password Mail'}
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip title={!participant?.mail && 'The user has no mail.'}>
                      <Button
                        type="link"
                        icon={<TOTPIcon />}
                        disabled={!participant?.mail}
                        onClick={async () => {
                          await dispatch(sendTOTP(id));
                        }}
                      >
                        {'Send TOTP'}
                      </Button>
                    </Tooltip>
                    <Button
                      icon={participant?.isActive ? <LockOutlined /> : <UnlockOutlined />}
                      type="link"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                      disabled={
                        participant?.verificationStatus === VerificationStatusInt.Pending ||
                        (participant?.participantType === ParticipantTypeInt.LDAP &&
                          participant?.participantStatus === ParticipantStatusInt.Passive)
                      }
                      onClick={async () => {
                        await dispatch(changeEntityStatus({ uid: id, status: !participant?.isActive, accountId: baseObj?.accountId }));
                        setResultModalOpenClose(true);
                      }}
                    >{`${participant?.isActive ? 'Lock' : 'Unlock'}`}</Button>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={
                        participant?.participantType === ParticipantTypeInt.LDAP &&
                        (participant?.participantStatus === ParticipantStatusInt.Lock ||
                          participant?.participantStatus === ParticipantStatusInt.Active ||
                          participant?.participantStatus === ParticipantStatusInt.Syncing)
                      }
                      onClick={() => {
                        setInfoModalOpenClose(true);
                      }}
                    >
                      {'Delete'}
                    </Button>
                    <Dropdown className="test-sender-dropdown" menu={{ items: testSenders }} trigger={['hover']} placement="bottomLeft">
                      <Button
                        type="link"
                        icon={<TestSenderIcon />}
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        {'Test Sender'}
                      </Button>
                    </Dropdown>
                  </ActionsDropdown>
                </Space>
              )
            }
          />
        </Form>
        <Divider />
      </Card>
      <DeleteDialog
        message="If you want to delete this account, please click on the button below."
        type="danger"
        title="Do you  want to delete this account?"
        open={infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={onDelete}
        onCancel={() => {
          setInfoModalOpenClose(prev => false);
        }}
      />
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
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(prev => false);
        }}
      /> */}
    </div>
  );
};
