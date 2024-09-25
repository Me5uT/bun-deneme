import { Descriptions, Space, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { authorizationAttributeTypes } from 'app/shared/mockdata/AttributeTypes';
import { countryList } from 'app/shared/mockdata/CountryList';
import { IRadiusRuleDetailModel, scheduleTypeLabels } from 'app/shared/model/RadiusRulesModel';
import { getScheduleLabel } from 'app/shared/util/date-utils';
import { formatSourceLabel, getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const RadiusRuleOverview: React.FC = () => {
  const radiusRule: IRadiusRuleDetailModel = useAppSelector(state => state.radiusRule.entity);
  const loading: boolean = useAppSelector(state => state.radiusRule.detailLoading);
  const updateSuccess: boolean = useAppSelector(state => state.radiusRule.updateSuccess);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Action',
        children: <Tag color={radiusRule?.isAccept ? '#36a321' : '#fa2323'}>{`${radiusRule?.isAccept ? 'Accept' : 'Deny'}`}</Tag>,
      },
      {
        label: 'Radius Rule Name',
        children: radiusRule?.name,
      },
      {
        label: 'Radius Rule Description',
        children: radiusRule?.description,
      },
      {
        label: 'Radius Client',
        children:
          !radiusRule?.radiusClientList || radiusRule?.radiusClientList.length === 0
            ? 'All'
            : radiusRule?.radiusClientList?.map(rc => rc.name).join(', '),
      },
      {
        label: 'Source Address',
        children: !radiusRule?.sourceAddresses
          ? 'All'
          : radiusRule?.sourceAddresses?.split(',').map((sa, i) => <Tag key={`${i}${sa}`}>{sa}</Tag>),
      },
      {
        label: 'Source Country',
        children:
          !radiusRule?.sourceCountries || radiusRule?.sourceCountries === 'all'
            ? 'All'
            : formatSourceLabel(
                countryList.filter(country => radiusRule.sourceCountries?.split(',').includes(country.value)).map(country => country.label)
              ),
      },
      {
        label: radiusRule?.isParticipantRule ? 'Users' : 'Groups',
        children:
          radiusRule?.isParticipantRule && radiusRule?.isAllParticipantsIncluded
            ? 'All'
            : radiusRule?.isParticipantRule && !radiusRule?.isAllParticipantsIncluded
            ? formatSourceLabel(radiusRule?.participantList?.map(u => u.username))
            : formatSourceLabel(radiusRule?.participantGroupList?.map(g => g.name)),
      },

      {
        label: 'Schedule',
        children: (
          <Space>
            <Tag color={'processing'}>{scheduleTypeLabels[radiusRule?.scheduleType] || 'All'}</Tag>
            <div>
              {getScheduleLabel(
                radiusRule?.scheduleType,
                radiusRule?.scheduleDays,
                radiusRule?.scheduleStartTime,
                radiusRule?.scheduleEndTime,
                radiusRule?.scheduleStartDateTime,
                radiusRule?.scheduleEndDateTime
              )}
            </div>
          </Space>
        ),
      },
      {
        label: 'Auth Method',
        children: radiusRule?.providerName,
      },
      {
        label: 'Attribute Type',
        children: authorizationAttributeTypes?.find(types => types.value === radiusRule?.authorizationAttributeType)?.label,
      },
      {
        label: 'is Active',
        children: <Tag color={getColorByType(Boolean, radiusRule?.isActive)}>{radiusRule?.isActive ? 'Active' : 'Passive'}</Tag>,
      },
    ],
    [radiusRule]
  );

  if (!radiusRule || loading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" bordered items={items || []} column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} />;
};
