import { Card, Descriptions, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { GatewayStatusInt, IGatewayRadiusDetailModel, IRadiusClientDetailModel } from 'app/shared/model/gateway.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getClientsByGateway, getEntity } from '../gatewayRadius.reducer';

interface IRadiusGatewayDetailDrawerProps {
  uid: string;
}
export const RadiusGatewayDetailDrawer: React.FC<IRadiusGatewayDetailDrawerProps> = ({ uid }) => {
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const radiusGatewayDetail: IGatewayRadiusDetailModel = useAppSelector(state => state.gatewayRadius.entity);
  const clientListByGateway: IRadiusClientDetailModel[] = useAppSelector(state => state.gatewayRadius.clientListByGateway);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      { label: 'Name', children: radiusGatewayDetail?.name },
      { label: 'Description', children: radiusGatewayDetail?.description },
      {
        label: 'Sam Value',

        children: radiusGatewayDetail?.samName,
      },
      {
        label: 'Gateway IP Address',

        children: radiusGatewayDetail?.gatewayIp,
      },
      {
        label: 'Accounting Port',
        children: radiusGatewayDetail?.accountingPort,
      },
      {
        label: 'Authentication Port',
        children: radiusGatewayDetail?.authenticationPort,
      },
      {
        label: 'Radius Clients',
        children: clientListByGateway?.map(c => c.name).join(', '),
      },
      {
        label: 'Status',
        children: (
          <Tag color={getColorByType(GatewayStatusInt, radiusGatewayDetail?.gatewayStatus)}>
            {Object.values(GatewayStatusInt)[radiusGatewayDetail?.gatewayStatus]}
          </Tag>
        ),
      },
      // {
      //   label: 'Last Sync Status',
      //   children: radiusGatewayDetail?.version || 'No Version',
      // },
    ],
    [radiusGatewayDetail, clientListByGateway]
  );

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ uid, accountId: baseObj?.accountId }));
      dispatch(getClientsByGateway({ gatewayId: uid, accountId: baseObj?.accountId, searchtext: '' }));
    }
  }, [uid]);

  return (
    <Card loading={!radiusGatewayDetail}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
