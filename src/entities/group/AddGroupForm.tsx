import { Button, Form, Input, Row } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGroup } from 'app/shared/model/GroupModel';
import React from 'react';
import { createEntity, reset, resetErrorMessage } from './group.reducer';

const { TextArea } = Input;
interface IAddGroupModalProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddGroupForm: React.FC<IAddGroupModalProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();
  const loading = useAppSelector(state => state.group.loading);
  const errorMessage = useAppSelector(state => state.group.errorMessage);

  const _handleModalClose = () => {
    setModalOpenClose(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    const serializedValues: IGroup = {
      ...values,
      accountId: baseObj?.accountId,
      participantGroupType: 0,
    };

    console.log('Received values of form: ', serializedValues);
    await dispatch(createEntity(serializedValues));
    // _handleModalClose();
    setResultModalOpenClose(true);
  };

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  return (
    <div style={{ paddingTop: '10px' }}>
      <Form form={form} onFinish={handleSubmit} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} className="add-modal-form-item">
        <Form.Item
          name={'name'}
          label={'Name :'}
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please input group name.',
            },
          ]}
        >
          <Input placeholder={'Name'} />
        </Form.Item>

        <Form.Item
          name={'description'}
          label={'Description :'}
          rules={[
            {
              required: false,
              type: 'string',
              message: 'Please input description.',
            },
          ]}
        >
          <TextArea placeholder={'Description'} rows={3} />
        </Form.Item>

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
