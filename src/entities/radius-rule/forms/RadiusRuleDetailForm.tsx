import { useSetState } from 'ahooks';
import { Card, Descriptions, DescriptionsProps, Space, Spin, Table, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getGroupByRule } from 'app/entities/group/group.reducer';
import { getParticipantByRule } from 'app/entities/user/usertemp.reducer';
import { authorizationAttributeTypes } from 'app/shared/mockdata/AttributeTypes';
import { countryList } from 'app/shared/mockdata/CountryList';
import { IParticipantByRuleModel } from 'app/shared/model/participant.model';
import { IRadiusRuleDetailModel, scheduleTypeLabels } from 'app/shared/model/RadiusRulesModel';
import { getScheduleLabel } from 'app/shared/util/date-utils';
import { formatSourceLabel, getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntity } from '../radiusrule.reducer';
import { IGroupByRuleModel } from 'app/shared/model/GroupModel';
interface IRadiusRuleDetailFormProps {
  uid: string;
  isParticipantRule: boolean;
}
export const RadiusRuleDetailForm: React.FC<IRadiusRuleDetailFormProps> = ({ uid, isParticipantRule }) => {
  const [searchDataForParticipant, setSearchDataForParticipant] = React.useState<IParticipantByRuleModel>({
    size: 10,
    page: 0,
    searchtext: '',
    isExcept: false,
    ruleId: uid,
  });
  const [searchDataForGroup, setSearchDataForGroup] = React.useState<IGroupByRuleModel>({
    searchtext: '',
    isExcept: false,
    ruleId: uid,
  });

  const dispatch = useAppDispatch();
  const radiusRuleDetails: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);

  const participantByRuleList = useAppSelector(state => state.userTemp.participantByRuleList);
  const participantByRuleCount = useAppSelector(state => state.userTemp.participantByRuleCount);
  const participantByRuleLoading = useAppSelector(state => state.userTemp.participantByRuleLoading);

  const groupByRuleList = useAppSelector(state => state.group.groupByRuleList);
  const groupByRuleLoading = useAppSelector(state => state.group.groupByRuleLoading);

  const columnsForParticipant = [
    { dataIndex: 'username', title: 'Username' },
    { dataIndex: 'displayName', title: 'Display Name' },
  ];
  const columnsForGroup = [{ dataIndex: 'name', title: 'Group Name' }];

  const defaultItems: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Action',
      children: (
        <Tag color={radiusRuleDetails?.isAccept ? '#36a321' : '#fa2323'}>{`${radiusRuleDetails?.isAccept ? 'Accept' : 'Deny'}`}</Tag>
      ),
    },
    {
      key: 2,
      label: 'Name',
      children: radiusRuleDetails?.name,
    },
    {
      key: 3,
      label: 'Description',
      children: radiusRuleDetails?.description,
    },
    {
      key: 4,
      label: 'Radius Clients',
      children: radiusRuleDetails?.radiusClientList?.map(rc => rc.name).join(', ') || 'All',
    },
    {
      key: 5,
      label: 'Source Address',
      children: radiusRuleDetails?.sourceAddresses?.split(',').map((sa, i) => <Tag key={`${i}${sa}`}>{sa}</Tag>),
    },
    {
      key: 6,
      label: 'Source Country',
      children:
        radiusRuleDetails?.sourceCountries?.split(',')[0] === 'all' || !radiusRuleDetails?.sourceCountries
          ? 'All'
          : formatSourceLabel(
              countryList
                .filter(country => radiusRuleDetails.sourceCountries?.split(',').includes(country.value))
                .map(country => country.label)
            ),
    },
    {
      key: 7,
      label: 'Schedule Type',
      children: (
        <Space>
          <Tag color={'processing'}>{scheduleTypeLabels[radiusRuleDetails?.scheduleType]}</Tag>
          <div>
            {getScheduleLabel(
              radiusRuleDetails?.scheduleType,
              radiusRuleDetails?.scheduleDays,
              radiusRuleDetails?.scheduleStartTime,
              radiusRuleDetails?.scheduleEndTime,
              radiusRuleDetails?.scheduleStartDateTime,
              radiusRuleDetails?.scheduleEndDateTime
            )}
          </div>
        </Space>
      ),
    },

    {
      key: 8,
      label: 'is Active',
      children: (
        <Tag color={getColorByType(Boolean, radiusRuleDetails?.isActive)}>{radiusRuleDetails?.isActive ? 'Active' : 'Passive'}</Tag>
      ),
    },
  ];

  const isActionAccept: DescriptionsProps['items'] = [
    {
      key: 9,
      label: 'Auth Method',
      children: radiusRuleDetails?.providerName,
    },

    {
      key: 10,
      label: 'Attribute Type',
      children: authorizationAttributeTypes?.find(attr => attr.value === radiusRuleDetails?.authorizationAttributeType)?.label || '',
    },
    {
      key: 11,
      label: 'Value',
      children: radiusRuleDetails?.authorizationValue,
    },
  ];

  const vendorItems: DescriptionsProps['items'] = [
    {
      key: 12,
      label: 'Vendor Code',
      children: radiusRuleDetails?.vendorCode,
    },
    {
      key: 13,
      label: 'Attribute Number',
      children: radiusRuleDetails?.attributeNumber,
    },
    {
      key: 14,
      label: 'Prefix',
      children: radiusRuleDetails?.prefix,
    },
    {
      key: 15,
      label: 'Seperator',
      children: radiusRuleDetails?.seperator,
    },
  ];

  const getDescItems = () => {
    let result = [];

    switch (true) {
      case radiusRuleDetails?.authorizationAttributeType === 0 && radiusRuleDetails?.isAccept:
        result = [...defaultItems, ...isActionAccept];
        break;

      case radiusRuleDetails?.authorizationAttributeType === 24 && radiusRuleDetails?.isAccept:
        result = [...defaultItems, ...vendorItems, ...isActionAccept];
        break;

      case radiusRuleDetails?.authorizationAttributeType !== 24 &&
        radiusRuleDetails?.authorizationAttributeType !== 0 &&
        radiusRuleDetails?.isAccept:
        result = [...defaultItems, ...isActionAccept];
        break;

      default:
        result = [...defaultItems];
        break;
    }

    return result.sort((a, b) => Number(a.key) - Number(b.key));
  };

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity(uid));
    }
  }, [uid]);

  React.useEffect(() => {
    if (isParticipantRule) {
      dispatch(getParticipantByRule(searchDataForParticipant));
    }
  }, [searchDataForParticipant]);

  React.useEffect(() => {
    if (isParticipantRule === false) {
      dispatch(getGroupByRule(searchDataForGroup));
    }
  }, []);

  return (
    <Card loading={!radiusRuleDetails}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={getDescItems()} />
      <Table
        bordered
        columns={isParticipantRule ? columnsForParticipant : columnsForGroup}
        rowKey={'uid'}
        tableLayout="fixed"
        dataSource={
          !radiusRuleDetails?.isAllParticipantsIncluded && isParticipantRule
            ? participantByRuleList
            : radiusRuleDetails?.isAllParticipantsIncluded && isParticipantRule
            ? [
                {
                  uid: 'all',
                  username: 'All',
                  displayName: 'All Users',
                },
              ]
            : groupByRuleList
        }
        loading={participantByRuleLoading || groupByRuleLoading}
        pagination={
          isParticipantRule
            ? {
                current: searchDataForParticipant.page + 1,
                pageSize: searchDataForParticipant.size,
                total: participantByRuleCount,
                showTotal: total => (
                  <div>
                    Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
                  </div>
                ),
                onChange: (page, pageSize) => setSearchDataForParticipant(prev => ({ ...prev, page: page - 1, size: pageSize })),
              }
            : false
        }
      />
    </Card>
  );
};
