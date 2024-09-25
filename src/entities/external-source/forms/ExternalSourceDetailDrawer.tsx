import { Card, Descriptions, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ESyncPeriod, ESyncPeriodStr, ESyncStatus, ESyncStatusStr, IExternalSourceModel } from 'app/shared/model/externalSourceModel';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntity } from '../externalSource.reducer';
import { LdapTypeInt } from 'app/shared/model/gateway.model';

interface ExternalSourceDetailDrawerProps {
  uid: string;
}
export const ExternalSourceDetailDrawer: React.FC<ExternalSourceDetailDrawerProps> = ({ uid }) => {
  const dispatch = useAppDispatch();

  const externalSourceDetail: IExternalSourceModel = useAppSelector(state => state.externalSource.entity);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'External Source Name', span: 1, children: externalSourceDetail?.name },
      {
        label: 'Description',
        span: 1,
        children: externalSourceDetail?.description || '-',
      },
      { label: 'LDAP Gateway', span: 1, children: externalSourceDetail?.gatewayName },
      { label: 'Domain Name', span: 1, children: externalSourceDetail?.domainName },
      {
        label: 'External Source DN',
        span: 1,
        children: externalSourceDetail?.ldapGroupDn,
      },
      { label: 'Attribute', span: 1, children: externalSourceDetail?.attribute?.name },
      { label: 'SAM', span: 1, children: externalSourceDetail?.samValue },
      {
        label: 'Type',
        span: 1,
        children: (
          <Tag color={getColorByType(LdapTypeInt, externalSourceDetail?.type)}>
            {Object.values(LdapTypeInt)[externalSourceDetail?.type]}
          </Tag>
        ),
      },

      {
        label: 'Sync Period',
        span: 1,
        children: <Tag color={'blue'}>{Object.values(ESyncPeriodStr)[externalSourceDetail?.syncPeriod]}</Tag>,
      },
      {
        label: 'Manuel Sync',
        span: 1,
        children: externalSourceDetail?.isSyncManuel ? <Tag color={'green'}>{'Yes'}</Tag> : <Tag color={'red'}>{'No'}</Tag>,
      },
      {
        label: 'Last Sync Status',
        span: 1,
        children: (
          <Tag color={getColorByType(ESyncStatus, externalSourceDetail?.lastSyncStatus)}>
            {Object.values(ESyncStatusStr)[externalSourceDetail?.lastSyncStatus]}
          </Tag>
        ),
      },
      { label: 'Message', span: 1, children: externalSourceDetail?.message || '-' },
      {
        label: 'Is Active',
        span: 1,
        children: (
          <Tag color={getColorByType(Boolean, externalSourceDetail?.isActive)}>{externalSourceDetail?.isActive ? 'Active' : 'Passive'}</Tag>
        ),
      },
    ],
    [externalSourceDetail]
  );

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ groupId: uid }));
    }
  }, [uid]);

  return (
    <Card loading={!externalSourceDetail}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
