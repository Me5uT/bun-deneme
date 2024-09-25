import { Button, Form, Input, Row } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { InputIPAddressV4 } from 'app/shared/components/InputIPAddressV4';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import React from 'react';
import { useParams } from 'react-router-dom';
import { checkClientName, createClient, updateClient } from '../gatewayRadius.reducer';
import { ipRegex } from 'app/shared/util/regex';

interface IAddEditClientFormProps {
  formType?: 'add' | 'edit';

  item?: any;
  setStates: (arg: any) => void;
  ids?: string[];
}
export const AddEditClientForm: React.FC<IAddEditClientFormProps> = ({ setStates, formType, item, ids }) => {
  const searchTimeout = React.useRef(null);
  const { id } = useParams<'id'>();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const checkLoading = useAppSelector(state => state.gatewayRadius.checkLoading);
  const clientLoading = useAppSelector(state => state.gatewayRadius.clientLoading);
  const checkedClientName = useAppSelector(state => state.gatewayRadius.checkedClientName);

  const [baseObj] = useMirketPortal();

  const handleSubmit = async (values: { name: string; ipAddress: string; secretKey: string }) => {
    switch (formType) {
      case 'edit':
        await dispatch(
          updateClient({
            accountId: baseObj?.accountId,
            uid: item?.uid,
            gatewayId: id,
            ...values,
          })
        );
        setStates({
          modalOpenClose: false,
          resultModalOpenClose: true,
        });
        break;

      case 'add':
        await dispatch(
          createClient({
            accountId: baseObj?.accountId,
            gatewayId: id,
            ...values,
          })
        );
        setStates({
          modalOpenClose: false,
          resultModalOpenClose: true,
        });
        break;
      default:
        console.log('Form submitted but not valid form type');

        break;
    }
  };

  const validateIP = (rule: any, value: string) => {
    if (value && ids.includes(value)) {
      return Promise.reject('IP Address is used!');
    }
    if (value && !ipRegex.test(value)) {
      return Promise.reject('Invalid IP address!');
    }
    return Promise.resolve();
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={formType === 'edit' ? { name: item?.name, ipAddress: item?.ipAddress, secretKey: item?.secretKey } : {}}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className="add-modal-form-item"
      >
        <Form.Item
          hasFeedback
          name={'name'}
          label="Radius Client"
          rules={[
            {
              required: true,
              // message: 'Please enter a valid client name',
              async validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('Radius Client is required'));
                }

                // setgroupDNStatusFlag(prev => true);

                if (searchTimeout.current) {
                  clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
                }

                try {
                  // Wrap the dispatch in a promise to await its completion
                  const result = await new Promise((resolve, reject) => {
                    searchTimeout.current = setTimeout(() => {
                      if (value.length > 0) {
                        dispatch(checkClientName({ accountId: baseObj?.accountId, uid: formType === 'edit' ? item?.uid : '', name: value }))
                          .then((response: any) => {
                            // Assume the action updates the checkStatus in the redux state

                            if (response.payload?.data) {
                              // Adjust based on how your action returns success
                              resolve('');
                            } else {
                              reject(new Error('Invalid Radius Client'));
                            }
                          })
                          .catch(error => reject(new Error('Validation failed due to an error')));
                      }
                      if (value === '') {
                        reject(new Error('Radius Client is required'));
                      }
                      if (value === null) {
                        resolve('');
                      }
                    }, 1100);
                  });

                  return Promise.resolve(result);
                } catch (error) {
                  return Promise.reject(error);
                }
              },
            },
          ]}
          // help={checkedClientName === false ? 'Invalid client name' : ''}
          validateTrigger="onChange"
          validateStatus={checkLoading ? 'validating' : checkedClientName ? 'success' : checkedClientName === false ? 'error' : ''}
        >
          <Input placeholder="Client Name" />
        </Form.Item>

        <Form.Item
          name={'ipAddress'}
          label="IP Address"
          rules={[{ required: true, message: 'Please input your IP address!' }, { validator: validateIP }]}
        >
          <InputIPAddressV4 />
        </Form.Item>

        <Form.Item name={'secretKey'} label="Secret Key" rules={[{ required: true, message: 'Missing Secret Key' }]}>
          <Input.Password placeholder="Secret Key" />
        </Form.Item>

        <Form.Item noStyle>
          <Row justify={'space-between'}>
            <Button
              type="default"
              onClick={() => {
                setStates(prev => ({
                  ...prev,
                  modalOpenClose: false,
                  selectedItemId: '',
                  item: null,
                }));
              }}
            >
              {'Close'}
            </Button>
            <Button type="primary" htmlType="submit" loading={clientLoading}>
              {'Save'}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};
