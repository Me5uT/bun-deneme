import { Card, Descriptions, Tag } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { GatewayStatusInt, GatewayTypeInt, IGateway, LdapTypeInt } from 'app/shared/model/gateway.model';
import { getColorByType } from 'app/shared/util/UtilityService';
import React from 'react';
import { getEntity } from '../gatewayLdap.reducer';
interface ILDAPGatewayDetailDrawerProps {
  uid: string;
}
export const LDAPGatewayDetailDrawer: React.FC<ILDAPGatewayDetailDrawerProps> = ({ uid }) => {
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const gateway: IGateway = useAppSelector(state => state.gatewayLdap.entity);

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

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ uid, accountId: baseObj?.accountId }));
    }
  }, [uid]);

  return (
    <Card loading={!gateway}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
