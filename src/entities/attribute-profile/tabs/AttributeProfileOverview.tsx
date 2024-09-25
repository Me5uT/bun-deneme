import { Descriptions, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { AttributeProfileStatusCondition, IAttributeProfile } from 'app/shared/model/AttributeProfile.model';
import React from 'react';

export const AttributeProfileOverview: React.FC = () => {
  const attributeProfile: IAttributeProfile = useAppSelector(state => state.attributeProfile.entity);
  const loading: boolean = useAppSelector(state => state.attributeProfile.loading);

  const item: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'Name', span: 3, children: attributeProfile.name },
      {
        label: 'Description',
        span: 3,
        children: attributeProfile.description || '-',
      },
      { label: 'Phone Pattern', span: 3, children: attributeProfile.phonePattern || '-' },
      {
        label: 'Phone Pattern Replacer',
        span: 3,
        children: attributeProfile.phonePatternReplacer || '-',
      },
      {
        label: 'Phone Attribute',
        span: 3,
        children: attributeProfile.phoneAttribute || '-',
      },
      {
        label: 'Mail Attribute',
        span: 3,
        children: attributeProfile.mailAttribute || '-',
      },
      {
        label: 'User Status Condition',
        span: 3,
        children: (
          <Tag color="blue">
            {attributeProfile?.statusCondition === AttributeProfileStatusCondition.ALL_ACCOUNTS ? 'All Account' : 'Enable Accounts'}
          </Tag>
        ),
      },
    ],
    [attributeProfile]
  );

  if (!attributeProfile || loading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" layout="horizontal" bordered items={item} />;
};
