import { Descriptions, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { GatewayStatusInt, GatewayTypeInt, IGateway, LdapTypeInt } from 'app/shared/model/gateway.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const GatewayOverview: React.FC = () => {
  const gateway: IGateway = useAppSelector(state => state.gatewayLdap.entity);
  const loading: boolean = useAppSelector(state => state.gatewayLdap.loading);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'Name', span: 3, children: gateway?.name },
      {
        label: 'Description',
        span: 3,
        children: gateway?.description,
      },
      {
        label: 'Gateway Status',
        span: 3,
        children: (
          <Tag color={getColorByType(GatewayStatusInt, gateway?.gatewayStatus)}>
            {Object.values(GatewayStatusInt)[gateway?.gatewayStatus]}
          </Tag>
        ),
      },
      // {
      //   label: 'LDAP Secure',
      //   span: 3,
      //   children: <Tag color={getColorByType(Boolean, gateway?.isLdapSecure)}>{gateway?.isLdapSecure ? 'Active' : 'Passive'}</Tag>,
      // },
      { label: 'Version', span: 3, children: gateway?.version || 'No Version' },
    ],
    [gateway]
  );

  if (!gateway || loading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" layout="horizontal" bordered items={items} />;
};
