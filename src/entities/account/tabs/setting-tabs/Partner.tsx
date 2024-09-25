/* eslint-disable object-shorthand */
import { Form, FormInstance, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ITenantDetail } from 'app/shared/model/tenant.model';
import React from 'react';
import { searchPartner } from '../../account.reducer';
interface IPartnerFormProps {
  form: FormInstance<any>;
}

export const Partner: React.FC<IPartnerFormProps> = ({ form }) => {
  const searchTimeout = React.useRef(null);
  const dispatch = useAppDispatch();

  const tenant: ITenantDetail = useAppSelector(state => state.account.entity);
  const loading: boolean = useAppSelector(state => state.account.partnerLoading);
  const partnerList: any[] = useAppSelector(state => state.account.partnerList);

  const handleSearch = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue.length > 2) {
        dispatch(searchPartner(newValue));
      }
    }, 500);
  };

  React.useEffect(() => {
    form.resetFields();
  }, [tenant]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Form.Item
        name="partnerId"
        label={'Partner'}
        labelCol={{ xl: 4, lg: 5, md: 6, sm: 9, xs: 9 }}
        wrapperCol={{ xl: 6, lg: 7, md: 9, sm: 15, xs: 15 }}
      >
        <Select
          allowClear
          showSearch
          loading={loading}
          placeholder={'Search Partner'}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleSearch}
          onClear={() => {
            dispatch(searchPartner(''));
          }}
          options={partnerList.map(d => ({
            value: d.uid,
            label: d.name,
          }))}
        />
      </Form.Item>
    </div>
  );
};
