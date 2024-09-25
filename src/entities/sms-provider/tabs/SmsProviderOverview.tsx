import { Descriptions, Spin } from 'antd';
import { DescriptionsItemType } from 'antd/es/descriptions';
import { useAppSelector } from 'app/config/store';
import { providerList } from 'app/shared/mockdata/ProviderList';
import { ISmsProviderDetailModel } from 'app/shared/model/sms-provider.model';
import React from 'react';

export const SmsProviderOverview: React.FC = () => {
  const smsProvider: ISmsProviderDetailModel = useAppSelector(state => state.smsProvider?.entity);
  const loading: boolean = useAppSelector(state => state.smsProvider.loading);

  const items: DescriptionsItemType[] = React.useMemo(
    () => [
      {
        span: 3,
        label: 'Provider Name',
        children: smsProvider?.name,
      },
      {
        span: 3,
        label: 'Description',
        children: smsProvider?.description,
      },
      {
        span: 3,
        label: "SMS Provider's Method",
        children: <div>{providerList?.find((item: any) => item.value === smsProvider?.provider)?.label || ''}</div>,
      },
      {
        span: 3,
        label: 'User Name',
        children: smsProvider?.username,
      },
      {
        span: 3,
        label: 'Password',
        children: smsProvider?.password,
      },
      {
        span: 3,
        label: 'User Code',
        children: smsProvider?.userCode,
      },
      {
        span: 3,
        label: 'Company Name',
        children: smsProvider?.accountCode,
      },
      {
        span: 3,
        label: 'Message',
        children: smsProvider?.message,
      },
      {
        span: 3,
        label: 'User Code',
        children: smsProvider?.userCode,
      },
      {
        span: 3,
        label: 'Account Code',
        children: smsProvider?.accountCode,
      },
      {
        span: 3,
        label: 'Originator',
        children: smsProvider?.originator,
      },
      {
        span: 3,
        label: 'Signature',
        children: smsProvider?.companySignature,
      },
    ],
    [smsProvider]
  );

  if (!smsProvider || loading) {
    return <Spin />;
  }

  return <Descriptions className="my-descriptions" layout="horizontal" bordered items={items} />;
};
