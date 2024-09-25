import { Button, Card, Divider, Form, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { ProfileCard } from 'app/shared/components/ProfileCard';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminProfileInt } from 'app/shared/model/AdminModel';
import { EGroupType, IGroup, TransferActions } from 'app/shared/model/GroupModel';
import { StatusInt } from 'app/shared/model/tenant.model';
import { findObjectChanges, getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addOrRemoveExternalSourceToGroup, addOrRemoveUserToGroup, deleteEntity, getEntity, updateEntity } from './group.reducer';
import { GroupSettings } from './tabs/GroupSettings';
import { getParticipantByGroup } from '../user/usertemp.reducer';

export const GroupDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('settings');
  const [settingTabs, setsettingTabs] = React.useState('groupInfo');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);
  const [newUsersOrGroupsList, setNewUserOrGroupsList] = React.useState<any[]>([]);

  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();

  const externalSourceByGroupList: any[] = useAppSelector(state => state.externalSource.externalSourceByGroupList);
  const participantByGroupList = useAppSelector(state => state.userTemp.participantByGroupList);

  const groupDetail: IGroup = useAppSelector(state => state.group.entity);
  const loading: boolean = useAppSelector(state => state.group.loading);
  const errorMessage: string = useAppSelector(state => state.group.errorMessage);

  const { id } = useParams<'id'>();
  const tabs: TabsProps['items'] = [
    {
      label: 'Settings',
      children: (
        <GroupSettings
          setNewUserOrGroupsList={setNewUserOrGroupsList}
          setShowSaveButton={setShowSaveButton}
          setsettingTabs={setsettingTabs}
          form={form}
          settingsTab={settingTabs}
        />
      ),
      disabled: baseObj?.adminProfile === AdminProfileInt.ReadOnly,
      key: 'settings',
    },
  ];

  const onFinish = async (values: any) => {
    switch (settingTabs) {
      case 'groupInfo': {
        const serializedValues = {
          ...values,
          uid: id,
          accountId: baseObj?.accountId,
        };
        await dispatch(updateEntity(serializedValues));
        setgeneralTab(prev => 'settings');
        setsettingTabs(prev => 'groupInfo');
        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);
        form.resetFields();

        break;
      }

      case 'externalSources': {
        const initialArray = externalSourceByGroupList;

        const changes = findObjectChanges(initialArray, newUsersOrGroupsList);

        if (changes.removed.length > 0) {
          await dispatch(
            addOrRemoveExternalSourceToGroup({
              accountId: baseObj?.accountId,
              groupId: id,
              externalSources: changes.removed.map(k => ({
                action: TransferActions.REMOVE,
                externalSourceId: k.uid,
              })),
            })
          );
        }

        if (changes.added.length > 0) {
          await dispatch(
            addOrRemoveExternalSourceToGroup({
              accountId: baseObj?.accountId,
              groupId: id,
              externalSources: changes.added.map(k => ({
                action: TransferActions.ADD,
                externalSourceId: k.uid,
              })),
            })
          );
        }

        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);

        break;
      }

      case 'users': {
        const initialArray = participantByGroupList;

        const changes = findObjectChanges(initialArray, newUsersOrGroupsList);

        if (changes.removed.length > 0) {
          await dispatch(
            addOrRemoveUserToGroup({
              accountId: baseObj?.accountId,
              groupId: id,
              isAllParticipantsIncluded: false,
              participants: changes.removed.map(k => ({
                action: TransferActions.REMOVE,
                participantId: k.uid,
              })),
            })
          );
        }

        if (changes.added.length > 0) {
          await dispatch(
            addOrRemoveUserToGroup({
              accountId: baseObj?.accountId,
              groupId: id,
              isAllParticipantsIncluded: false,
              participants: changes.added.map(k => ({
                action: TransferActions.ADD,
                participantId: k.uid,
              })),
            })
          );
        }
        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);

        break;
      }

      default:
        console.log("Can't find tab, onFinish");
        break;
    }
  };

  const onFieldsChange = (changedFields: any[], allFields: any[]) => {
    setShowSaveButton(true);
  };

  const onDelete = async () => {
    await dispatch(
      deleteEntity({
        groupId: id,
        accountId: baseObj?.accountId,
        onDetail: true,
      })
    );
    setInfoModalOpenClose(prev => false);
    navigate(`/${baseObj?.basePath}/group`);
  };

  React.useEffect(() => {
    dispatch(getEntity({ accountId: baseObj?.accountId, groupId: id }));
  }, []);

  React.useEffect(() => {
    dispatch(getParticipantByGroup({ size: 10, page: 0, searchtext: '', isExcept: false, groupId: id }));
  }, []);

  if (!groupDetail || loading) return <Spin />;

  return (
    <div>
      <ProfileCard
        avatarColor={getColorByType(EGroupType, groupDetail?.participantGroupType)}
        backgroundColor={getColorByType(EGroupType, groupDetail?.participantGroupType)}
        statusIcon={groupDetail?.isActive}
        statusIconTooltip={Object.values(StatusInt)[groupDetail?.isActive ? 0 : 1] as string}
        description={groupDetail?.description}
        title={groupDetail?.name}
      />
      <Divider style={{ margin: '10px 0px' }} />

      <Card>
        <Form form={form} layout={'horizontal'} onFinish={onFinish} onFieldsChange={onFieldsChange} initialValues={groupDetail}>
          <Tabs
            defaultActiveKey="overview"
            onChange={(a: string) => {
              form.resetFields();
              setShowSaveButton(false);
              setgeneralTab(prev => a);
            }}
            className="group-detail-tabs"
            activeKey={generalTab}
            items={tabs}
            tabBarExtraContent={
              !baseObj?.isReadOnly && (
                <Space direction="horizontal">
                  {generalTab === 'settings' && showSaveButton && (
                    <Form.Item noStyle>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  )}
                  <ActionsDropdown className="group-detail-actions">
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        setInfoModalOpenClose(prev => true);
                      }}
                    >
                      {'Delete'}
                    </Button>
                  </ActionsDropdown>
                </Space>
              )
            }
          />
        </Form>
        <Divider />
      </Card>
      <DeleteDialog
        message="If you want to delete this group, please click on the button below."
        type="danger"
        title="Do you  want to delete this account?"
        open={infoModalOpenClose}
        okText={'DELETE'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={onDelete}
        onCancel={() => {
          setInfoModalOpenClose(prev => false);
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
