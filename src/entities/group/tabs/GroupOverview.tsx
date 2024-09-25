import { Descriptions, Spin } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { IGroup } from 'app/shared/model/GroupModel';
import React from 'react';

export const GroupOverview: React.FC = () => {
  const groupDetails: IGroup = useAppSelector(state => state.group.entity);
  const loading: boolean = useAppSelector(state => state.group.loading);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      { key: 1, label: 'Name', span: 3, children: groupDetails?.name },
      {
        key: 2,
        label: 'Description',
        span: 3,
        children: groupDetails?.description,
      },
      // {
      //   key: 3,
      //   label: 'Group Type',
      //   span: 3,
      //   children: (
      //     <Tag color={getTagColor(EGroupType, groupDetails?.participantGroupType)}>
      //       {Object.values(EGroupType)[groupDetails?.participantGroupType]}
      //     </Tag>
      //   ),
      // },
      {
        key: 5,
        label: 'Users',
        span: 3,
        children: groupDetails?.totalParticipant,
      },
      // {
      //   key: 12,
      //   label: 'Is Active',
      //   span: 3,
      //   children: <Tag color={getTagColor(Boolean, groupDetails?.isActive)}>{groupDetails?.isActive ? 'Active' : 'Passive'}</Tag>,
      // },
    ],
    [groupDetails]
  );

  if (!groupDetails || loading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" layout="horizontal" bordered items={items} />;
};
