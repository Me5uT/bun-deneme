import { Card, Descriptions, DescriptionsProps, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AttributeProfileStatusCondition, IAttributeProfile } from 'app/shared/model/AttributeProfile.model';
import React from 'react';
import { getEntity } from '../attributeProfile.reducer';
interface AttributeProfileDetailFormProps {
  uid: string;
}
export const AttributeProfileDetailDrawer: React.FC<AttributeProfileDetailFormProps> = ({ uid }) => {
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const attributeProfile: IAttributeProfile = useAppSelector(state => state.attributeProfile.entity);

  const items: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Name',
        children: attributeProfile?.name,
      },
      {
        label: 'Description',
        children: attributeProfile?.description,
      },
      {
        label: 'Mail Attribute',
        children: attributeProfile?.mailAttribute,
      },
      {
        label: 'Phone Attribute',
        children: attributeProfile?.phoneAttribute,
      },
      {
        label: 'Phone Pattern',
        children: attributeProfile?.phonePattern,
      },
      {
        label: 'Phone Pattern Replacer',
        children: attributeProfile?.phonePatternReplacer,
      },
      {
        label: 'User Status Condition',
        children: (
          <Tag color="blue">
            {attributeProfile?.statusCondition === AttributeProfileStatusCondition.ALL_ACCOUNTS ? 'All Account' : 'Enable Accounts'}
          </Tag>
        ),
      },
    ],
    [attributeProfile]
  );

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ uid, accountId: baseObj?.accountId }));
    }
  }, [uid]);

  return (
    <Card loading={!attributeProfile}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
