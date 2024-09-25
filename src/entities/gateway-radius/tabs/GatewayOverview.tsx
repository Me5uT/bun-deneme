import { Descriptions, Spin, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { GatewayStatusInt, IGatewayRadiusDetailModel, IRadiusClientDetailModel } from 'app/shared/model/gateway.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';

export const GatewayOverview: React.FC = () => {
  const gatewayRadius: IGatewayRadiusDetailModel = useAppSelector(state => state.gatewayRadius.entity);
  const loading: boolean = useAppSelector(state => state.gatewayRadius.loading);
  const clientLoading: boolean = useAppSelector(state => state.gatewayRadius.clientLoading);
  const clientListByGateway: IRadiusClientDetailModel[] = useAppSelector(state => state.gatewayRadius.clientListByGateway);

  const radiusItem: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'Name', span: 3, children: gatewayRadius?.name },
      {
        label: 'Description',
        span: 3,
        children: gatewayRadius?.description,
      },
      {
        label: 'Sam Value',
        span: 3,
        children: gatewayRadius?.samName,
      },
      {
        label: 'Gateway IP Address',
        span: 3,
        children: gatewayRadius?.gatewayIp,
      },
      {
        span: 3,
        label: 'Accounting Port',
        children: gatewayRadius?.accountingPort,
      },
      {
        span: 3,
        label: 'Authentication Port',
        children: gatewayRadius?.authenticationPort,
      },
      {
        label: 'Radius Clients',
        span: 3,
        children: clientListByGateway?.map(c => c.name).join(', '),
      },
      {
        label: 'Gateway Status',
        span: 3,
        children: (
          <Tag color={getColorByType(GatewayStatusInt, gatewayRadius?.gatewayStatus)}>
            {Object.values(GatewayStatusInt)[gatewayRadius?.gatewayStatus]}
          </Tag>
        ),
      },
      { key: 17, label: 'Version', span: 3, children: gatewayRadius?.version || 'Unknown Version' },
    ],
    [gatewayRadius, clientListByGateway]
  );

  if (!gatewayRadius || loading || clientLoading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" layout="horizontal" bordered items={radiusItem} />;
};
