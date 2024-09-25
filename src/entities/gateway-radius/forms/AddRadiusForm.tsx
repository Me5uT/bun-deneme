import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { InputIPAddressV4 } from 'app/shared/components/InputIPAddressV4';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGatewayRadiusAddRequestModel } from 'app/shared/model/gateway.model';
import { validateIP } from 'app/shared/util/regex';
import React from 'react';
import { checkClientName, createEntity, resetErrorMessage } from '../gatewayRadius.reducer';

interface IAddRadiusModalProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}
interface CheckClientNameResponse {
  data: boolean;
}
export const AddRadiusForm: React.FC<IAddRadiusModalProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [states, setStates] = useSetState<any>({
    saveButtonDisabledKeys: [],
    addClientFieldDisabled: false,
  });

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();
  const searchTimeout = React.useRef(null);

  const errorMessage = useAppSelector(state => state.gatewayRadius.errorMessage);
  const checkedClientName = useAppSelector(state => state.gatewayRadius.checkedClientName);

  const checkLoading = useAppSelector(state => state.gatewayRadius.checkLoading);
  const loading = useAppSelector(state => state.gatewayRadius.loading);

  const _handleModalClose = () => {
    form.resetFields();
    setModalOpenClose(false);

    setStates({ saveButtonDisabledKeys: [], addClientFieldDisabled: false });
  };

  const handleSubmit = async (values: IGatewayRadiusAddRequestModel) => {
    const serializedValues: IGatewayRadiusAddRequestModel = {
      ...values,
      accountId: baseObj?.accountId,
    };

    console.log('Received values of form: ', serializedValues);
    await dispatch(createEntity(serializedValues));
    setResultModalOpenClose(true);
  };

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  return (
    <div>
      <Form
        form={form}
        onFinishFailed={e => console.error('e', e)}
        onFinish={handleSubmit}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className="add-modal-form-item"
      >
        <Form.Item
          name={'name'}
          label={'Name'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a gateway name',
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit']}
        >
          <Input placeholder={'Name'} />
        </Form.Item>

        <Form.Item name={'description'} label={'Description'}>
          <Input placeholder={'Description'} />
        </Form.Item>
        <Form.Item
          name={'samName'}
          label={'Sam Value'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter a Sam',
            },
          ]}
        >
          <Input placeholder={'Sam'} />
        </Form.Item>
        <Form.Item name={'gatewayIp'} label="Gateway IP Address" rules={[{ required: true }, { validator: validateIP }]}>
          <InputIPAddressV4 />
        </Form.Item>
        <Form.Item
          name={'authenticationPort'}
          label={'Auth Port'}
          initialValue={1812}
          rules={[
            {
              required: true,
              message: 'Please input your authentication port',
            },
          ]}
        >
          <Input placeholder={'Authentication Port'} type="number" />
        </Form.Item>

        <Form.Item
          name={'accountingPort'}
          label={'Acc Port'}
          initialValue={1813}
          rules={[
            {
              required: true,
              message: 'Please input your accounting port',
            },
          ]}
        >
          <Input placeholder={'Accounting Port'} type="number" slot={'none'} />
        </Form.Item>

        <Form.List
          name="radiusClients"
          rules={[
            {
              async validator(_, radiusClients) {
                if (!radiusClients || radiusClients.length < 1) {
                  return Promise.reject(new Error('At least one client is required!'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Space direction="vertical" style={{ width: '100%', display: 'flex' }}>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={`${key}${name}`}
                  styles={{ body: { padding: '9px', border: '2px solid lightblue', borderRadius: '8px' }, cover: {} }}
                >
                  <Form.Item
                    {...restField}
                    hasFeedback
                    name={[name, 'name']}
                    label="Radius Client"
                    rules={[
                      {
                        required: true,
                        async validator(_: any, value: string): Promise<void> {
                          try {
                            const res = (await dispatch(checkClientName({ accountId: baseObj?.accountId, name: value }))) as {
                              payload: CheckClientNameResponse;
                            };

                            const isValid = res.payload.data;

                            if (!isValid) {
                              return Promise.reject(new Error('Existed radius client!'));
                            }
                          } catch (error) {
                            return Promise.reject(new Error('Validation failed'));
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Radius Client" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'ipAddress']}
                    label={'IP Address'}
                    rules={[
                      {
                        required: true,
                        message: 'IP Address is required!',
                      },
                    ]}
                  >
                    <InputIPAddressV4 placeholder="IP Address" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'secretKey']}
                    label={'Secret Key'}
                    rules={[{ required: true, message: 'Secret Key is required!' }]}
                  >
                    <Input.Password placeholder="Secret Key" autoComplete="false" />
                  </Form.Item>

                  <Row justify={'space-between'}>
                    <Col>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          remove(name);
                        }}
                      >
                        Delete Fields
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
              <div style={{ width: '100%', marginBottom: '10px' }}>
                <Button
                  type="dashed"
                  style={{ width: '100%' }}
                  onClick={() => {
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Radius Client
                </Button>
              </div>
              {/* <Form.ErrorList errors={[<Alert key={'alert' + errors} message={errors} type="error" />]} /> */}
              <Form.ErrorList errors={errors} />
            </Space>
          )}
        </Form.List>
        <Form.Item noStyle>
          <Row justify={'space-between'}>
            <Button type="default" onClick={_handleModalClose}>
              {'Close'}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {'Save'}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};
