import { Card, Descriptions, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React from 'react';

import { DescriptionsItemType } from 'antd/es/descriptions';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { getEntity } from '../manage.reducer';
import { IManageDetailModel, ManageCategory, ManageCategoryStr } from 'app/shared/model/ManageModel';
import { getColorByType } from 'app/shared/util/UtilityService';
import { StatusInt } from 'app/shared/model/tenant.model';
interface IManageDetailsFormProps {
  uid: string;
}
export const ManageDetails: React.FC<IManageDetailsFormProps> = ({ uid }) => {
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const manageObj: IManageDetailModel = useAppSelector(state => state.manage.entity);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'Detection', children: manageObj?.detection },
      {
        label: 'Category',
        children: (
          <Tag color={getColorByType(ManageCategory, ManageCategory.Credential_Harvesting)}>
            {Object.values(ManageCategoryStr)[manageObj.category]}
          </Tag>
        ),
      },
      {
        label: 'Last Detect',
        children: manageObj?.lastDetect,
      },
      {
        label: 'Status',
        children: <Tag color={getColorByType(Boolean, manageObj?.status)}>{manageObj?.status ? 'Active' : 'Passive'}</Tag>,
      },
      {
        label: 'Exclude Users',
        children: manageObj?.excludeUsers?.map((m, i) => (
          <Tag key={m + i} color={'geekblue'}>
            {m}
          </Tag>
        )),
      },
      {
        label: 'Exclude IPs',
        children: manageObj?.excludeIPs?.map((m, i) => (
          <Tag key={m + i} color={'magenta-inverse'}>
            {m}
          </Tag>
        )),
      },
      {
        label: 'Certaincy Score',
        children: <Tag color={'green'}>{manageObj?.certaincyScore}</Tag>,
      },
      {
        label: 'Threat Score',
        children: <Tag color={'red-inverse'}>{manageObj?.threatScore}</Tag>,
      },
    ],
    [manageObj]
  );

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ uid, accountId: baseObj?.accountId }));
    }
  }, [uid]);

  return (
    <Card loading={!manageObj}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
