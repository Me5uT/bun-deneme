import { Card, Descriptions, DescriptionsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { providerList } from 'app/shared/mockdata/ProviderList';
import { ISmsProviderDetailModel } from 'app/shared/model/sms-provider.model';
import React from 'react';
import { getEntity } from '../sms-provider.reducer';
interface ProviderDetailFormProps {
  uid: string;
}
export const ProviderDetailForm: React.FC<ProviderDetailFormProps> = ({ uid }) => {
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const smsProvider: ISmsProviderDetailModel = useAppSelector(state => state.smsProvider.entity);

  const items: DescriptionsProps['items'] = React.useMemo(
    () => [
      {
        label: 'Name',
        children: smsProvider?.name,
      },
      {
        label: 'Description',
        children: smsProvider?.description,
      },
      {
        label: 'Message',
        children: smsProvider?.message,
      },
      {
        label: 'SMS Provider',
        children: providerList.find(prv => prv.value === smsProvider?.provider)?.label || '-',
      },
      {
        label: 'Username',
        children: smsProvider?.username,
      },
      {
        label: 'User Code',
        children: smsProvider?.userCode,
      },
      {
        label: 'Company Code',
        children: smsProvider?.accountCode,
      },
      {
        label: 'Signature',
        children: smsProvider?.companySignature,
      },
      {
        label: 'Account Code ',
        children: smsProvider?.originator,
      },
    ],
    [smsProvider]
  );

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ uid }));
    }
  }, [uid]);

  return (
    <Card loading={!smsProvider}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
    </Card>
  );
};
