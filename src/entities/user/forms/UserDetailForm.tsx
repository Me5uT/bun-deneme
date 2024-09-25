import { Descriptions, DescriptionsProps, Spin, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IParticipantDetail, ParticipantStatusInt, ParticipantTypeInt } from 'app/shared/model/participant.model';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntity } from '../usertemp.reducer';
import { EGroupType } from 'app/shared/model/GroupModel';
interface UserDetailFormProps {
  participantUid: string;
}
export const UserDetailForm: React.FC<UserDetailFormProps> = ({ participantUid }) => {
  const [baseObj] = useMirketPortal();
  const dispatch = useAppDispatch();
  const participantDetail: IParticipantDetail = useAppSelector(state => state.userTemp.entity);
  const loading: boolean = useAppSelector(state => state.userTemp.loading);

  const items: DescriptionsProps['items'] = loading
    ? []
    : participantDetail?.participantType === ParticipantTypeInt.Local
    ? [
        {
          label: 'Display Name',
          children: participantDetail?.displayName,
        },
        {
          label: 'Username',
          children: participantDetail?.username,
        },
        {
          label: 'Mail',
          children: participantDetail?.mail || '-',
        },
        {
          label: 'Token',
          children: (
            <Tag color={getColorByType(VerificationStatusInt, participantDetail?.verificationStatus)}>
              {Object.values(VerificationStatusInt)[participantDetail?.verificationStatus]}
            </Tag>
          ),
        },
        {
          label: 'Phone',
          children: participantDetail?.phone ? participantDetail?.phone : '-',
        },
        {
          label: 'SAM Value',
          children: participantDetail?.sam,
        },
        {
          label: 'SAM Name',
          children: `${participantDetail?.sam}\\${participantDetail.username}`,
        },
        {
          label: 'User Type',
          children: (
            <Tag color={getColorByType(ParticipantTypeInt, participantDetail?.participantType)}>{`${
              Object.values(ParticipantTypeInt)[participantDetail?.participantType]
            }`}</Tag>
          ),
        },

        {
          label: 'User Status',
          children: (
            <Tag color={getColorByType(ParticipantStatusInt, participantDetail?.participantStatus)}>
              {Object.values(ParticipantStatusInt)[participantDetail?.participantStatus]}
            </Tag>
          ),
        },
        {
          label: 'Member of Groups',
          children: (
            <div>
              {participantDetail?.participantGroups && participantDetail?.participantGroups?.length > 0 ? (
                participantDetail?.participantGroups.map((item, i) => (
                  <Tag key={i} color={getColorByType(EGroupType, item?.groupType)}>
                    {`${item?.name}`}
                  </Tag>
                ))
              ) : (
                <Tag color="gray">No Group</Tag>
              )}
            </div>
          ),
        },
      ]
    : [
        {
          label: 'Display Name',
          children: participantDetail?.displayName,
        },
        {
          label: 'Username',
          children: participantDetail?.username,
        },
        {
          label: 'Mail',
          children: participantDetail?.mail || '-',
        },
        {
          label: 'Token',
          children: (
            <Tag color={getColorByType(VerificationStatusInt, participantDetail?.verificationStatus)}>
              {Object.values(VerificationStatusInt)[participantDetail?.verificationStatus]}
            </Tag>
          ),
        },
        {
          label: 'Phone',
          children: participantDetail?.phone ? participantDetail?.phone : '-',
        },
        {
          label: 'SAM Value',
          children: participantDetail?.sam,
        },
        {
          label: 'SAM Name',
          children: `${participantDetail?.sam}\\${participantDetail.username}`,
        },
        {
          label: 'User Type',
          children: (
            <Tag color={getColorByType(ParticipantTypeInt, participantDetail?.participantType)}>{`${
              Object.values(ParticipantTypeInt)[participantDetail?.participantType]
            }`}</Tag>
          ),
        },
        {
          label: 'User Status',
          children: (
            <Tag color={getColorByType(ParticipantStatusInt, participantDetail?.participantStatus)}>
              {Object.values(ParticipantStatusInt)[participantDetail?.participantStatus]}
            </Tag>
          ),
        },
        {
          label: 'Group',
          children: (
            <div>
              {participantDetail?.participantGroups && participantDetail?.participantGroups?.length > 0 ? (
                participantDetail?.participantGroups.map((item, i) => (
                  <Tag key={item?.uid} color={getColorByType(EGroupType, EGroupType.LOCAL)}>
                    {`${item?.name}`}
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
          children: (
            <div>
              {participantDetail?.externalSources && participantDetail?.externalSources?.length > 0 ? (
                participantDetail?.externalSources.map((item, i) => (
                  <Tag key={i} color={getColorByType(EGroupType, EGroupType.LDAP)}>
                    {`${item?.name}`}
                  </Tag>
                ))
              ) : (
                <Tag color="gray">No External Source</Tag>
              )}
            </div>
          ),
        },
      ];

  React.useEffect(() => {
    if (participantUid) {
      dispatch(
        getEntity({
          participantUid,
          accountId: baseObj?.accountId,
        })
      );
    }
  }, [participantUid]);

  if (!participantDetail || loading) return <Spin />;

  return <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />;
};
