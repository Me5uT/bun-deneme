import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Select, Slider, Spin, Switch } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/user/usertemp.reducer';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGatewayRadiusAddRequestModel } from 'app/shared/model/gateway.model';
import React from 'react';
import { getEntity, resetErrorMessage } from '../manage.reducer';

interface IEditManageFormModalProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
  setModalTitle: (v: string) => void;
  uid: string;
}

export const EditManageForm: React.FC<IEditManageFormModalProps> = ({ setModalOpenClose, setResultModalOpenClose, uid, setModalTitle }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();
  const searchTimeout = React.useRef(null);

  const entity = useAppSelector(state => state.manage.entity);
  const loading = useAppSelector(state => state.manage.loading);
  const errorMessage = useAppSelector(state => state.manage.errorMessage);
  const userList = useAppSelector(state => state.userTemp.entities);
  const userLoading = useAppSelector(state => state.userTemp.loading);

  const threatSCR = Form.useWatch('threatScore', form);
  const certaincySCR = Form.useWatch('certaincyScore', form);

  const _handleModalClose = () => {
    form.resetFields();
    setModalOpenClose(false);
  };

  const handleSubmit = (values: IGatewayRadiusAddRequestModel) => {
    console.log('Received values of form: ', values);
    // await dispatch(createEntity(serializedValues));
    setModalOpenClose(false);
  };

  const onSearchUser = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getEntities({ searchtext: newValue, accountId: baseObj?.accountId, page: 0, size: 5 }));
    }, 500);
  };

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId, page: 0, size: 5 }));
    dispatch(getEntity({ accountId: baseObj?.accountId, uid }));
  }, []);

  React.useEffect(() => {
    if (entity?.detection) {
      form.setFieldValue('threatScore', entity?.threatScore);
      form.setFieldValue('certaincyScore', entity?.certaincyScore);

      setModalTitle(entity?.detection);
    }
  }, [entity]);

  if (loading || !entity?.uid) return <Spin />;

  return (
    <Form
      className="add-modal-form-item"
      form={form}
      layout={'horizontal'}
      onFinish={handleSubmit}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={entity}
    >
      <Form.Item name={'excludeUsers'} label={'Exclude Users'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 14, md: 14, xl: 16 }}>
        <Select
          allowClear
          showSearch
          mode="multiple"
          loading={userLoading}
          placeholder={'Exclude Users'}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          onSearch={v => onSearchUser(v)}
          onFocus={() => dispatch(getEntities({ searchtext: '', accountId: baseObj?.accountId, page: 0, size: 5 }))}
          options={[
            {
              value: 'all',
              label: 'All',
            },
            ...userList.map(d => ({
              value: d.uid,
              label: d.username,
            })),
          ]}
          onChange={selectedItems => {
            switch (true) {
              case selectedItems[0] === 'all' && selectedItems.length > 1: {
                const filteredItems = selectedItems.filter(item => item !== 'all');
                form.setFieldValue('excludeUsers', filteredItems);

                break;
              }
              case selectedItems[selectedItems.length - 1] === 'all': {
                form.setFieldValue('excludeUsers', ['all']);

                break;
              }
              case selectedItems.length === 0: {
                form.setFieldValue('excludeUsers', ['all']);

                break;
              }

              default: {
                form.setFieldValue('excludeUsers', selectedItems);
                break;
              }
            }
          }}
        />
      </Form.Item>

      <Form.Item name="excludeIPs" label={'Exclude IPs'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 14, md: 14, xl: 16 }}>
        <Select mode="tags" placeholder={'Exclude IPs'} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="threatScore" label={'Threat Score'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 14, md: 14, xl: 16 }}>
        <Row>
          <Col span={19}>
            <Slider
              min={0}
              max={100}
              value={threatSCR}
              onChange={v => {
                form.setFieldValue('threatScore', v);
              }}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={0}
              max={100}
              style={{ margin: '0 16px' }}
              value={threatSCR}
              onChange={v => {
                if (v < 101 && v >= 0) form.setFieldValue('threatScore', v);
              }}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item name="certaincyScore" label={'Certaincy Score'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 14, md: 14, xl: 16 }}>
        <Row>
          <Col span={19}>
            <Slider
              min={0}
              max={100}
              value={certaincySCR}
              onChange={v => {
                form.setFieldValue('certaincyScore', v);
              }}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={0}
              max={100}
              style={{ margin: '0 16px' }}
              value={certaincySCR}
              onChange={v => {
                if (v < 101 && v >= 0) form.setFieldValue('certaincyScore', v);
              }}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item name="status" label={'Status'} labelCol={{ sm: 8, md: 8, xl: 6 }} wrapperCol={{ sm: 14, md: 14, xl: 16 }}>
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>

      <Form.Item noStyle>
        <Row justify={'space-between'}>
          <Button
            type="default"
            onClick={() => {
              setModalOpenClose(false);
            }}
          >
            Close
          </Button>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
};
