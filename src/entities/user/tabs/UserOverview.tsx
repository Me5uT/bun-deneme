/* eslint-disable no-useless-escape */
import { Descriptions, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { EGroupType } from 'app/shared/model/GroupModel';
import { IParticipantDetail, ParticipantStatusInt, ParticipantTypeInt } from 'app/shared/model/participant.model';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import PhoneInput from 'react-phone-input-2';

export const UserOverview: React.FC = () => {
  const participant: IParticipantDetail = useAppSelector(state => state.userTemp.entity);

  const updateSuccess: boolean = useAppSelector(state => state.userTemp.updateSuccess);
  const loading: boolean = useAppSelector(state => state.userTemp.loading);

  const localUserItems: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Display Name',
        span: 3,
        children: participant?.displayName,
      },
      {
        label: 'User Name',
        span: 3,
        children: participant?.username,
      },
      {
        label: 'Phone Number',
        span: 3,
        children: participant?.phone ? <PhoneInput disabled containerClass="phone-input-overview" value={participant?.phone} /> : '',
      },
      {
        label: 'Mail',
        span: 3,
        children: participant?.mail,
      },

      {
        label: 'User Type',
        span: 3,
        children: (
          <Tag color={getColorByType(ParticipantTypeInt, participant?.participantType)}>
            {Object.values(ParticipantTypeInt)[participant?.participantType]}
          </Tag>
        ),
      },
      {
        span: 3,
        label: 'User Status',
        children: (
          <Tag color={getColorByType(ParticipantStatusInt, participant?.participantStatus)}>
            {Object.values(ParticipantStatusInt)[participant?.participantStatus]}
          </Tag>
        ),
      },

      {
        label: 'Verification Status',
        span: 3,
        children: (
          <Tag color={getColorByType(VerificationStatusInt, participant?.verificationStatus)}>
            {Object.values(VerificationStatusInt)[participant?.verificationStatus]}
          </Tag>
        ),
      },

      // {
      //   label: 'Is Passless ?',
      //   span: 3,
      //   children: participant?.isExternal ? 'Yes' : 'No',
      // },

      {
        label: 'Member of Groups',
        span: 3,
        children: (
          <div>
            {participant?.participantGroups && participant?.participantGroups?.length > 0 ? (
              participant?.participantGroups.map((item, i) => (
                <Tag key={i} color={getColorByType(EGroupType, item?.groupType)}>
                  {item?.name}
                </Tag>
              ))
            ) : (
              <Tag color="gray">No Group</Tag>
            )}
          </div>
        ),
      },
      {
        label: 'Sam Value',
        span: 3,
        children: participant?.sam,
      },
      {
        label: 'Sam Name',
        span: 3,
        children: `${participant?.sam}\\${participant.username}`,
      },
      // {
      //   label: 'Is Active',
      //   span: 3,
      //   children: <Tag color={getColorByType(Boolean, participant?.isActive)}>{participant?.isActive ? 'Active' : 'Passive'}</Tag>,
      // },
    ],
    [updateSuccess, participant]
  );

  const LDAPUserItems: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        label: 'Display Name',
        span: 3,
        children: participant?.displayName,
      },
      {
        label: 'User Name',
        span: 3,
        children: participant?.username,
      },
      {
        label: 'Phone Number',
        span: 3,
        children: participant?.phone ? <PhoneInput disabled containerClass="phone-input-overview" value={participant?.phone} /> : '',
      },
      {
        label: 'Mail',
        span: 3,
        children: participant?.mail,
      },

      {
        label: 'User Type',
        span: 3,
        children: (
          <Tag color={getColorByType(ParticipantTypeInt, participant?.participantType)}>
            {Object.values(ParticipantTypeInt)[participant?.participantType]}
          </Tag>
        ),
      },
      {
        label: 'Verification Status',
        span: 3,
        children: (
          <Tag color={getColorByType(VerificationStatusInt, participant?.verificationStatus)}>
            {Object.values(VerificationStatusInt)[participant?.verificationStatus]}
          </Tag>
        ),
      },

      {
        span: 3,
        label: 'User Status',
        children: (
          <Tag color={getColorByType(ParticipantStatusInt, participant?.participantStatus)}>
            {Object.values(ParticipantStatusInt)[participant?.participantStatus]}
          </Tag>
        ),
      },

      {
        label: 'Member of Groups',
        span: 3,
        children: (
          <div>
            {participant?.participantGroups && participant?.participantGroups?.length > 0 ? (
              participant?.participantGroups.map((item, i) => (
                <Tag key={i} color={getColorByType(EGroupType, item?.groupType)}>
                  {item?.name}
                </Tag>
              ))
            ) : (
              <Tag color="gray">No Group</Tag>
            )}
          </div>
        ),
      },
      {
        label: 'External Source DN',
        span: 3,
        children: (
          <div>
            {participant?.externalSources && participant?.externalSources?.length > 0 ? (
              participant?.externalSources.map((item, i) => <div key={i + item.name}>{item.name}</div>)
            ) : (
              <Tag color="gray">No External Source</Tag>
            )}
          </div>
        ),
      },
      {
        label: 'Sam Value',
        span: 3,
        children: participant?.sam,
      },
      {
        label: 'Sam Name',
        span: 3,
        children: `${participant?.sam}\\${participant.username}`,
      },
    ],
    [updateSuccess, participant]
  );

  if (!participant || loading) return <Spin />;

  return (
    <div>
      <Descriptions
        className="my-descriptions"
        layout="horizontal"
        bordered
        items={!participant || loading ? [] : participant?.participantType === ParticipantTypeInt.Local ? localUserItems : LDAPUserItems}
      />
    </div>
  );
};
