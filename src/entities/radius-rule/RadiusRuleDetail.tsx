import { Button, Card, Form, Radio, Space, Spin, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ActionsDropdown } from 'app/shared/components/ActionsDropdown';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IRadiusRuleDetailModel, RadiusRuleAction, RuleOtpTimeout, RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addOrRemoveGroupToRule,
  addOrRemoveParticipantToRule,
  changeEntityAccept,
  changeEntityStatus,
  deleteEntity,
  editRadiusRule,
  getEntity,
} from './radiusrule.reducer';
import { RadiusRuleOverview } from './tabs/RadiusRuleOverview';
import { RadiusRulesAction } from './tabs/RadiusRulesAction';
import { RadiusRulesSchedule } from './tabs/RadiusRulesSchedule';
import { RadiusRulesSource } from './tabs/RadiusRulesSource';
import { RadiusRulesUserAndGroups } from './tabs/RadiusRulesUserAndGroups';
import { findObjectChanges } from 'app/shared/util/UtilityService';
import { TransferActions } from 'app/shared/model/GroupModel';

export const RadiusRuleDetail = () => {
  const [generalTab, setgeneralTab] = React.useState('overview');
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [newUsersOrGroupsList, setNewUserOrGroupsList] = React.useState<any[]>([]);
  const [showSaveButton, setShowSaveButton] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [baseObj] = useMirketPortal();

  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);
  const loading: boolean = useAppSelector(state => state.radiusRule.detailLoading);
  const errorMessage: string = useAppSelector(state => state.radiusRule.errorMessage);

  const isAccept = Form.useWatch('isAccept', form);

  const { id } = useParams<'id'>();

  const tabs: TabsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Overview',
        children: <RadiusRuleOverview />,
        key: 'overview',
      },
      {
        label: 'Source',
        children: <RadiusRulesSource form={form} />,
        key: 'source',
      },
      {
        label: radiusRule?.isParticipantRule ? 'Users' : 'Groups',
        children: <RadiusRulesUserAndGroups setShowSaveButton={setShowSaveButton} setNewUserOrGroupsList={setNewUserOrGroupsList} />,
        key: 'usersAndGroups',
      },
      {
        label: 'Schedule',
        children: <RadiusRulesSchedule form={form} />,
        key: 'schedule',
      },
      {
        label: 'Action',
        children: <RadiusRulesAction form={form} showSaveButton={showSaveButton} />,
        key: 'action',
      },
    ],
    [radiusRule, generalTab, showSaveButton]
  );

  const onFinish = async (values: Partial<IRadiusRuleDetailModel>) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    // let serialiazedValues: Partial<IRadiusRuleDetailModel> = {};

    switch (true) {
      case generalTab === 'source': {
        const schedule =
          radiusRule?.scheduleType === RuleScheduleType.ONETIME
            ? {
                scheduleType: RuleScheduleType.ONETIME,

                scheduleStartDateTime: radiusRule?.scheduleStartDateTime,
                scheduleEndDateTime: radiusRule?.scheduleEndDateTime,
                scheduleStartTime: null,
                scheduleEndTime: null,
                scheduleDays: null,
              }
            : radiusRule?.scheduleType === RuleScheduleType.RECURRING
            ? {
                scheduleType: RuleScheduleType.RECURRING,

                scheduleStartDateTime: null,
                scheduleEndDateTime: null,
                scheduleStartTime: radiusRule?.scheduleStartTime,
                scheduleEndTime: radiusRule?.scheduleEndTime,
                scheduleDays: radiusRule?.scheduleDays,
              }
            : {
                scheduleType: RuleScheduleType.ALL,

                scheduleStartDateTime: null,
                scheduleEndDateTime: null,
                scheduleStartTime: null,
                scheduleEndTime: null,
                scheduleDays: null,
              };

        await dispatch(
          editRadiusRule({
            uid: id,
            name: values?.name,
            description: values?.description,
            radiusClientIds: values?.radiusClientIds.join(','),
            sourceAddresses: values?.sourceAddresses.join(','),
            sourceCountries: values?.sourceCountries[0] === 'all' ? null : values?.sourceCountries.join(','),

            providerId: radiusRule?.providerId,
            authorizationAttributeType: radiusRule?.authorizationAttributeType,
            authorizationValue: radiusRule?.authorizationValue,
            otpTimeout: radiusRule?.otpTimeout,
            vendorCode: radiusRule?.vendorCode,
            attributeNumber: radiusRule?.attributeNumber,
            prefix: radiusRule?.prefix,
            seperator: radiusRule?.seperator,

            ...schedule,
          })
        );
        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);
        break;
      }

      case generalTab === 'schedule': {
        const schedule =
          values?.scheduleType === RuleScheduleType.ONETIME
            ? {
                scheduleType: RuleScheduleType.ONETIME,

                scheduleStartDateTime: dayjs(values?.onetimeRange[0]).format('YYYY-MM-DD HH:mm'),
                scheduleEndDateTime: dayjs(values?.onetimeRange[1]).format('YYYY-MM-DD HH:mm'),
                scheduleStartTime: null,
                scheduleEndTime: null,
                scheduleDays: null,
              }
            : values?.scheduleType === RuleScheduleType.RECURRING
            ? {
                scheduleType: RuleScheduleType.RECURRING,

                scheduleStartDateTime: null,
                scheduleEndDateTime: null,
                scheduleStartTime: dayjs(values?.recurringTimeRange[0]).format('HH:mm'),
                scheduleEndTime: dayjs(values?.recurringTimeRange[1]).format('HH:mm'),
                scheduleDays: values?.scheduleDays.join(','),
              }
            : {
                scheduleType: RuleScheduleType.ALL,

                scheduleStartDateTime: null,
                scheduleEndDateTime: null,
                scheduleStartTime: null,
                scheduleEndTime: null,
                scheduleDays: null,
              };

        await dispatch(
          editRadiusRule({
            uid: id,
            name: radiusRule?.name,
            description: radiusRule?.description,
            radiusClientIds: radiusRule?.radiusClientIds,
            sourceAddresses: radiusRule?.sourceAddresses,
            sourceCountries: radiusRule?.sourceCountries,

            providerId: radiusRule?.providerId,
            authorizationAttributeType: radiusRule?.authorizationAttributeType,
            authorizationValue: radiusRule?.authorizationValue,
            otpTimeout: radiusRule?.otpTimeout,
            vendorCode: radiusRule?.vendorCode,
            attributeNumber: radiusRule?.attributeNumber,
            prefix: radiusRule?.prefix,
            seperator: radiusRule?.seperator,

            ...schedule,
          })
        );
        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);

        break;
      }

      case generalTab === 'action': {
        const schedule =
          radiusRule?.scheduleType === RuleScheduleType.ONETIME
            ? {
                scheduleType: RuleScheduleType.ONETIME,

                scheduleStartDateTime: radiusRule?.scheduleStartDateTime,
                scheduleEndDateTime: radiusRule?.scheduleEndDateTime,
                scheduleStartTime: null,
                scheduleEndTime: null,
                scheduleDays: null,
              }
            : radiusRule?.scheduleType === RuleScheduleType.RECURRING
            ? {
                scheduleType: RuleScheduleType.RECURRING,

                scheduleStartDateTime: null,
                scheduleEndDateTime: null,
                scheduleStartTime: radiusRule?.scheduleStartTime,
                scheduleEndTime: radiusRule?.scheduleEndTime,
                scheduleDays: radiusRule?.scheduleDays,
              }
            : {
                scheduleType: RuleScheduleType.ALL,

                scheduleStartDateTime: null,
                scheduleEndDateTime: null,
                scheduleStartTime: null,
                scheduleEndTime: null,
                scheduleDays: null,
              };

        if (isAccept !== radiusRule?.isAccept) {
          await dispatch(
            changeEntityAccept({
              ruleUid: radiusRule?.uid,
              status: isAccept,
            })
          );
        }

        await dispatch(
          editRadiusRule({
            uid: id,
            name: radiusRule?.name,
            description: radiusRule?.description,
            radiusClientIds: radiusRule?.radiusClientIds,
            sourceAddresses: radiusRule?.sourceAddresses,
            sourceCountries: radiusRule?.sourceCountries,

            ...schedule,
            ...values,
          })
        );

        setShowSaveButton(false);
        setResultModalOpenClose(prev => true);
        break;
      }

      case generalTab === 'usersAndGroups': {
        if (radiusRule?.isParticipantRule) {
          // User ekleme çıkarma

          const initialArray = radiusRule?.participantList;
          const changes = findObjectChanges(initialArray, newUsersOrGroupsList);

          if (changes.removed.length > 0) {
            await dispatch(
              addOrRemoveParticipantToRule({
                accountId: baseObj?.accountId,
                ruleId: id,
                isAllParticipantsIncluded: false,
                participants: changes.removed.map(k => ({
                  participantId: k.uid,
                  action: TransferActions.REMOVE,
                })),
              })
            );
          }

          if (changes.added.length > 0 && changes.added[0].uid === 'a') {
            await dispatch(
              addOrRemoveParticipantToRule({
                accountId: baseObj?.accountId,
                ruleId: id,
                isAllParticipantsIncluded: true,
                participants: null,
              })
            );
          }

          if (changes.added.length > 0 && changes.added[0].uid !== 'a') {
            await dispatch(
              addOrRemoveParticipantToRule({
                accountId: baseObj?.accountId,
                ruleId: id,
                isAllParticipantsIncluded: false,
                participants: changes.added.map(k => ({
                  participantId: k.uid,
                  action: TransferActions.ADD,
                })),
              })
            );
          }
        } else {
          // group ekleme çıkarma

          const initialArray = radiusRule?.participantGroupList;

          const changes = findObjectChanges(initialArray, newUsersOrGroupsList);

          if (changes.removed.length > 0) {
            await dispatch(
              addOrRemoveGroupToRule({
                accountId: baseObj?.accountId,
                ruleId: id,
                participantGroups: changes.removed.map(k => ({
                  action: TransferActions.REMOVE,
                  participantGroupId: k.uid,
                })),
              })
            );
          }

          if (changes.added.length > 0) {
            await dispatch(
              addOrRemoveGroupToRule({
                accountId: baseObj?.accountId,
                ruleId: id,
                participantGroups: changes.added.map(k => ({
                  action: TransferActions.ADD,
                  participantGroupId: k.uid,
                })),
              })
            );
          }
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
    await dispatch(deleteEntity({ uid: id, accountId: baseObj?.accountId, onDetail: true }));
    setInfoModalOpenClose(prev => false);
    navigate(`/${baseObj?.basePath}/radius-rules`);
  };

  const getRecuringTimeRange = (scheduleStartTime, scheduleEndTime) => {
    if (scheduleEndTime && scheduleEndTime) return [dayjs(scheduleStartTime, 'HH:mm'), dayjs(scheduleEndTime, 'HH:mm')];
    else return [];
  };

  const getOneTimeRange = (scheduleStartTime, scheduleEndTime) => {
    if (scheduleEndTime && scheduleEndTime)
      return [dayjs(scheduleStartTime, 'YYYY-MM-DD HH:mm'), dayjs(scheduleEndTime, 'YYYY-MM-DD HH:mm')];
    else return [];
  };

  React.useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  if (!radiusRule || loading) return <Spin />;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card style={{ width: '100%', height: '100%' }} loading={!radiusRule || loading}>
        <Form
          form={form}
          layout={'horizontal'}
          onFinish={onFinish}
          initialValues={{
            name: radiusRule?.name,
            description: radiusRule?.description,
            radiusClientIds:
              !radiusRule?.radiusClientList || radiusRule?.radiusClientList.length === 0
                ? [
                    {
                      label: 'All',
                      value: 'all',
                    },
                  ]
                : radiusRule?.radiusClientList?.map(rc => ({
                    label: rc.name,
                    value: rc.uid,
                  })),
            sourceAddresses: !radiusRule?.sourceAddresses ? ['0.0.0.0/0'] : radiusRule?.sourceAddresses?.split(','),
            sourceCountries: !radiusRule?.sourceCountries ? ['all'] : radiusRule?.sourceCountries?.split(','),
            providerId: radiusRule?.providerId,
            authorizationAttributeType: radiusRule?.authorizationAttributeType,
            authorizationValue: radiusRule?.authorizationValue,
            otpTimeout: radiusRule?.otpTimeout || RuleOtpTimeout.NOTIMEOUT,
            vendorCode: radiusRule?.vendorCode,
            attributeNumber: radiusRule?.attributeNumber,
            prefix: radiusRule?.prefix,
            seperator: radiusRule?.seperator,
            isAccept: radiusRule?.isAccept,

            scheduleType: radiusRule?.scheduleType || RuleScheduleType.ALL,
            scheduleDays: radiusRule?.scheduleDays?.split(','),
            scheduleEndDateTime: radiusRule?.scheduleEndDateTime,
            scheduleEndTime: radiusRule?.scheduleEndTime,
            scheduleStartDateTime: radiusRule?.scheduleStartDateTime,
            scheduleStartTime: radiusRule?.scheduleStartTime,

            recurringTimeRange: getRecuringTimeRange(radiusRule?.scheduleStartTime, radiusRule?.scheduleEndTime),
            onetimeRange: getOneTimeRange(radiusRule?.scheduleStartDateTime, radiusRule?.scheduleEndDateTime),
          }}
          onFieldsChange={onFieldsChange}
        >
          <Tabs
            items={tabs}
            destroyInactiveTabPane={true}
            activeKey={generalTab}
            onChange={(a: string) => {
              // form.resetFields();
              setShowSaveButton(false);
              setgeneralTab(a);
            }}
            tabBarExtraContent={
              !baseObj?.isReadOnly && (
                <Space direction="horizontal" style={{ padding: '0px 0px 0px 10px' }}>
                  {generalTab !== 'overview' && showSaveButton && !baseObj?.isReadOnly && (
                    <Form.Item noStyle>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  )}

                  <ActionsDropdown className="radius-rule-detail-actions" buttonLabel="...">
                    <Button
                      type="link"
                      onClick={async () => {
                        await dispatch(
                          changeEntityStatus({
                            ruleUid: radiusRule?.uid,
                            status: !radiusRule?.isActive,
                          })
                        );
                        setResultModalOpenClose(prev => true);
                      }}
                    >
                      {`${radiusRule?.isActive ? 'Disable' : 'Enable'}`}
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        setInfoModalOpenClose(true);
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
          setInfoModalOpenClose(false);
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
    </div>
  );
};
