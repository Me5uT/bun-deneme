import { Descriptions, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { ESyncPeriodStr, ESyncStatus, ESyncStatusStr, IExternalSourceModel } from 'app/shared/model/externalSourceModel';
import { LdapTypeInt } from 'app/shared/model/gateway.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const ExternalSourceOverview: React.FC = () => {
  const externalSourceDetail: IExternalSourceModel = useAppSelector(state => state.externalSource.entity);
  const loading: boolean = useAppSelector(state => state.externalSource.loading);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'External Source Name', span: 3, children: externalSourceDetail?.name },
      {
        label: 'Description',
        span: 3,
        children: externalSourceDetail?.description || '-',
      },
      { label: 'LDAP Gateway', span: 3, children: externalSourceDetail?.gatewayName },
      { label: 'Domain Name', span: 3, children: externalSourceDetail?.domainName },
      {
        label: 'External Source DN',
        span: 3,
        children: externalSourceDetail?.ldapGroupDn,
      },
      { label: 'Attribute', span: 3, children: externalSourceDetail?.attribute?.name },
      { label: 'SAM', span: 3, children: externalSourceDetail?.samValue },
      {
        label: 'Type',
        span: 3,
        children: (
          <Tag color={getColorByType(LdapTypeInt, externalSourceDetail?.type)}>
            {Object.values(LdapTypeInt)[externalSourceDetail?.type]}
          </Tag>
        ),
      },
      {
        label: 'Sync Period',
        span: 3,
        children: <Tag color={'blue'}>{Object.values(ESyncPeriodStr)[externalSourceDetail?.syncPeriod]}</Tag>,
      },
      // {
      //   label: 'Manuel Sync',
      //   span: 3,
      //   children: externalSourceDetail?.isSyncManuel ? <Tag color={'green'}>{'Yes'}</Tag> : <Tag color={'red'}>{'No'}</Tag>,
      // },
      {
        label: 'Last Sync Status',
        span: 3,
        children: (
          <Tag color={getColorByType(ESyncStatus, externalSourceDetail?.lastSyncStatus)}>
            {Object.values(ESyncStatusStr)[externalSourceDetail?.lastSyncStatus]}
          </Tag>
        ),
      },
      { label: 'Message', span: 3, children: externalSourceDetail?.message || '-' },
      {
        label: 'Is Active',
        span: 3,
        children: (
          <Tag color={getColorByType(Boolean, externalSourceDetail?.isActive)}>{externalSourceDetail?.isActive ? 'Active' : 'Passive'}</Tag>
        ),
      },
    ],
    [externalSourceDetail]
  );

  if (!externalSourceDetail || loading) {
    return <Spin />;
  }

  return (
    <div>
      <Descriptions className="my-descriptions" layout="horizontal" bordered items={items} />
    </div>
  );
};
