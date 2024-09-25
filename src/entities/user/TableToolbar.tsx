import { useSetState } from 'ahooks';
import { Button, Col, Form, Input, Modal, Radio, Row, Select, Space, Switch, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { AdvancedSearchWithValue } from 'app/shared/components/AdvancedSearchWithValue';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { TagInSelect } from 'app/shared/components/TagInSelect';
import { WarnDialog } from 'app/shared/components/WarnDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { EGroupType, IGroup } from 'app/shared/model/GroupModel';
import { IParticipant, ParticipantStatusInt, ParticipantTypeInt } from 'app/shared/model/participant.model';
import { VerificationStatusInt } from 'app/shared/model/tenant.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { getPhoneCountryFromLocal } from 'app/shared/util/LocalStorage';
import { getColorByType } from 'app/shared/util/UtilityService';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React from 'react';
import PhoneInput from 'react-phone-input-2';
import { getEntities as getGroupList } from '../group/group.reducer';
import { deleteEntities, resetAllVerification } from './usertemp.reducer';

interface ITableToolbarProps {
  setModalOpenClose: (v: boolean) => void;
  setSearchData: (v: any) => void;
  selectedRowKeys: string[];
  searchData: Partial<IQueryParams>;
  actionButtons?: React.ReactNode;
  refreshing?: boolean;
  selectedRows?: IParticipant[];
}

export const TableToolbar: React.FC<ITableToolbarProps> = ({
  actionButtons,
  setModalOpenClose,
  setSearchData,
  selectedRowKeys,
  searchData,
  selectedRows,
}) => {
  const [mainSearchText, setMainSearchText] = React.useState<string>('');
  const [openAdvancedSearch, setOpenAdvancedSearch] = React.useState<boolean>(false);
  const [searchDataForExport, setSearchDataForExport] = useSetState<any>({});
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [infoModalOpenClose, setInfoModalOpenClose] = React.useState<boolean>(false);
  const [resultModalOpenCloseForDelete, setResultModalOpenCloseForDelete] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);
  const [phoneCountryCode, setPhoneCountryCode] = React.useState<string>('gb');

  const [form] = Form.useForm();
  const searchTimeout = React.useRef(null);
  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.userTemp.loading);
  const errorMessage = useAppSelector(state => state.userTemp.errorMessage);
  const groupList: IGroup[] = useAppSelector(state => state.group.entities);

  const hideSendProvisionButton = React.useMemo(() => {
    return selectedRows?.some(d => d?.participantType === ParticipantTypeInt.LDAP && d?.participantStatus === ParticipantStatusInt.Passive);
  }, [selectedRows]);

  const onDeleteAllParticipant = React.useCallback(async () => {
    await dispatch(
      deleteEntities({
        accountId: baseObj?.accountId,
        uids: selectedRowKeys,
        searchData,
      })
    );
    setInfoModalOpenClose(prev => false);
    setResultModalOpenCloseForDelete(prev => true);
  }, [selectedRowKeys]);

  const onResetAllVerification = React.useCallback(async () => {
    await dispatch(
      resetAllVerification({
        accountId: baseObj?.accountId,
        participantUids: selectedRowKeys,
        inDetail: false,
      })
    );
    setResultModalOpenClose(prev => true);
  }, [selectedRowKeys]);

  const onMainSearch = (text: string) => {
    setMainSearchText(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      const query = { searchtext: text, size: 10, page: 0 };
      setSearchData((s: IQueryParams) => ({ ...s, ...query }));

      // herhangi bir arama yapılıp yapılmadığının kontrolü
    }, 500); // 1 saniye (1000 ms) gecikme
  };

  const onFinish = (values: any) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    const serializedValues = {
      ...values,
      verificationStatus:
        Array.isArray(values?.verificationStatus) && values?.verificationStatus?.length > 0 ? values?.verificationStatus.join(',') : null,
      participantStatus:
        Array.isArray(values?.participantStatus) && values?.participantStatus?.length > 0 ? values?.participantStatus.join(',') : null,
      participantGroupUids:
        Array.isArray(values?.participantGroupUids) && values?.participantGroupUids?.length > 0
          ? values?.participantGroupUids.join(',')
          : null,
      participantType: values?.participantType === 2 ? null : values?.participantType,
    };

    setOpenAdvancedSearch(prev => false);

    searchTimeout.current = setTimeout(() => {
      setSearchData(prev => ({
        ...prev,
        ...serializedValues,
      }));
      setSearchDataForExport(prev => ({
        ...prev,
        ...serializedValues,
      }));
    }, 500);
  };

  const onClear = () => {
    form.setFieldsValue({
      displayName: '',
      username: '',
      mail: '',
      sam: '',
      participantStatus: null,
      participantType: ParticipantTypeInt.ALL,
      phone: '',
      verificationStatus: null,
      participantGroupUids: null,
      isExternal: false,
    });
  };

  const handleGroupSearch = (newValue: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current); // Mevcut zamanlayıcıyı iptal et
    }

    searchTimeout.current = setTimeout(() => {
      if (newValue) {
        dispatch(
          getGroupList({
            accountId: baseObj?.accountId,
            searchtext: newValue,
          })
        );
      }
    }, 500);
  };

  React.useEffect(() => {
    if (openAdvancedSearch) {
      setPhoneCountryCode(getPhoneCountryFromLocal());
      dispatch(
        getGroupList({
          accountId: baseObj?.accountId,
        })
      );
    }
  }, [openAdvancedSearch]);

  React.useEffect(() => {
    if (
      searchData?.displayName ||
      searchData?.isExternal === true ||
      searchData?.mail ||
      searchData?.participantGroupUids ||
      searchData?.participantType === ParticipantTypeInt.LDAP ||
      searchData?.participantType === ParticipantTypeInt.Local ||
      searchData?.phone ||
      searchData?.sam ||
      searchData?.participantStatus ||
      searchData?.username ||
      searchData?.verificationStatus ||
      searchData?.searchtext
    ) {
      setListFiltered(true);
    } else {
      setListFiltered(false);
    }
  }, [searchData]);

  React.useEffect(() => {
    if (searchData?.participantGroupUids && form) {
      const groupUIDs = searchData?.participantGroupUids.split(',');
      form.setFieldValue('participantGroupUids', groupUIDs);
    }
  }, [searchData?.participantGroupUids]);

  return (
    <div className="toolbar-container">
      <Row gutter={16} justify={'space-between'} style={{ flexWrap: 'wrap-reverse', padding: '15px 20px', alignItems: 'center' }}>
        <Col xs={10} sm={12} md={12} lg={12}>
          <Space direction="horizontal">
            <AdvancedSearchWithValue
              onMainSearch={onMainSearch}
              setOpenAdvancedSearch={setOpenAdvancedSearch}
              mainSearchText={mainSearchText}
            />
            {listFiltered && <div style={{ fontSize: '12px', marginTop: -5, color: '#f5a864' }}>{'* List has been filtered.'}</div>}
          </Space>
          <Modal
            destroyOnClose={false}
            forceRender
            title="Advanced Search"
            open={openAdvancedSearch}
            width={700}
            onCancel={() => setOpenAdvancedSearch(false)}
            footer={null}
          >
            <Form
              onFinish={onFinish}
              form={form}
              initialValues={{
                ...searchData,
                participantStatus: searchData?.participantStatus ? searchData?.participantStatus.split(',').map(a => Number(a)) : null,
                verificationStatus: searchData?.verificationStatus ? searchData?.verificationStatus.split(',').map(a => Number(a)) : null,
                participantType: searchData?.participantType ? searchData?.participantType : ParticipantTypeInt.ALL,
              }}
            >
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Form.Item name="displayName">
                    <Input allowClear placeholder={'Display Name'} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="username">
                    <Input allowClear placeholder={'Username'} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Form.Item name="mail">
                    <Input allowClear placeholder={'Mail'} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="sam">
                    <Input allowClear placeholder={'SAM Value'} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Form.Item name="participantStatus">
                    <Select
                      allowClear
                      showSearch={false}
                      mode="multiple"
                      tagRender={(props: CustomTagProps) => {
                        const { label, value, closable, onClose } = props;
                        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                          event.preventDefault();
                          event.stopPropagation();
                        };
                        return (
                          <Tag
                            color={getColorByType(ParticipantStatusInt, value)}
                            onMouseDown={onPreventMouseDown}
                            closable={closable}
                            onClose={onClose}
                            style={{ marginRight: 3 }}
                          >
                            {label}
                          </Tag>
                        );
                      }}
                      style={{ width: '100%' }}
                      placeholder="User status"
                      optionLabelProp="label"
                      options={[
                        {
                          label: Object.values(ParticipantStatusInt)[ParticipantStatusInt.Active],
                          value: ParticipantStatusInt.Active,
                        },
                        {
                          label: Object.values(ParticipantStatusInt)[ParticipantStatusInt.Lock],
                          value: ParticipantStatusInt.Lock,
                        },
                        {
                          label: Object.values(ParticipantStatusInt)[ParticipantStatusInt.Passive],
                          value: ParticipantStatusInt.Passive,
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="verificationStatus">
                    <Select
                      allowClear
                      showSearch={false}
                      mode="multiple"
                      tagRender={(props: CustomTagProps) => {
                        const { label, value, closable, onClose } = props;
                        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
                          event.preventDefault();
                          event.stopPropagation();
                        };
                        return (
                          <Tag
                            color={getColorByType(VerificationStatusInt, value)}
                            onMouseDown={onPreventMouseDown}
                            closable={closable}
                            onClose={onClose}
                            style={{ marginRight: 3 }}
                          >
                            {label}
                          </Tag>
                        );
                      }}
                      style={{ width: '100%' }}
                      placeholder="Verifaication Status"
                      optionLabelProp="label"
                      options={[
                        {
                          label: Object.values(VerificationStatusInt)[VerificationStatusInt.Verified],
                          value: VerificationStatusInt.Verified,
                        },
                        {
                          label: Object.values(VerificationStatusInt)[VerificationStatusInt.Pending],
                          value: VerificationStatusInt.Pending,
                        },
                        {
                          label: Object.values(VerificationStatusInt)[VerificationStatusInt.Failed],
                          value: VerificationStatusInt.Failed,
                        },
                        {
                          label: Object.values(VerificationStatusInt)[VerificationStatusInt.Manuel],
                          value: VerificationStatusInt.Manuel,
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Form.Item name="participantGroupUids">
                    <Select
                      allowClear
                      mode="multiple"
                      showSearch
                      tagRender={props => <TagInSelect {...props} tagColorType={EGroupType} groupList={groupList} />}
                      placeholder={'Group'}
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      onSearch={handleGroupSearch}
                      onChange={values => form.setFieldValue('participantGroupUids', values)}
                      onClear={() => {
                        dispatch(
                          getGroupList({
                            accountId: baseObj?.accountId,
                          })
                        );
                      }}
                      options={
                        groupList.map(d => ({
                          value: d.uid,
                          label: d.name,
                        })) || []
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="phone">
                    <PhoneInput country={phoneCountryCode} preferredCountries={['gb']} placeholder="Phone" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Form.Item name="participantType" label={'User Type'}>
                    <Radio.Group
                      buttonStyle="solid"
                      optionType="button"
                      options={[
                        {
                          label: Object.values(ParticipantTypeInt)[ParticipantTypeInt.ALL],
                          value: ParticipantTypeInt.ALL,
                        },
                        {
                          label: Object.values(ParticipantTypeInt)[ParticipantTypeInt.Local],
                          value: ParticipantTypeInt.Local,
                        },
                        {
                          label: Object.values(ParticipantTypeInt)[ParticipantTypeInt.LDAP],
                          value: ParticipantTypeInt.LDAP,
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item name="isExternal" label={'Is Passless'}>
                    <Switch checkedChildren={'On'} unCheckedChildren={'Off'} />
                  </Form.Item>
                </Col> */}
              </Row>

              <Form.Item
                style={{
                  marginBottom: '0px',
                }}
              >
                <Row justify={'space-between'}>
                  <Button
                    onClick={() => {
                      setOpenAdvancedSearch(false);
                    }}
                  >
                    {'Close'}
                  </Button>
                  <Space>
                    <Button onClick={onClear}>{'Clear'}</Button>
                    <Button htmlType="submit" type="primary">
                      {'Search'}
                    </Button>
                  </Space>
                </Row>
              </Form.Item>
            </Form>
          </Modal>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space style={{ paddingRight: '10px' }}>
            {!hideSendProvisionButton && selectedRowKeys.length > 1 && !baseObj?.isReadOnly && (
              <Button type="primary" loading={loading} onClick={onResetAllVerification}>
                {'Send Provision'}
              </Button>
            )}
            {selectedRowKeys.length > 1 && !baseObj?.isReadOnly && (
              <Button type="primary" danger loading={loading} onClick={() => setInfoModalOpenClose(prev => true)}>
                {'Delete Selected Users'}
              </Button>
            )}
          </Space>

          {actionButtons ? actionButtons : null}

          {!baseObj?.isReadOnly && (
            <Button className="btn-add-user" type="primary" onClick={() => setModalOpenClose(true)} style={{ marginLeft: '10px' }}>
              {'Add User'}
            </Button>
          )}
        </Col>
      </Row>
      <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'All selected users have been sent reset verification successfully.'}
        onClose={() => {
          setResultModalOpenClose(prev => false);
        }}
      />
      <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenCloseForDelete}
        message={errorMessage ? errorMessage : 'All selected users have been deleted successfully.'}
        onClose={() => {
          setResultModalOpenCloseForDelete(prev => false);
        }}
      />
      <DeleteDialog
        message="If you want to delete selected users, please click on the button below."
        type="danger"
        title="Do you want to delete selected users?"
        open={infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={() => {
          onDeleteAllParticipant();
        }}
        onCancel={() => {
          setInfoModalOpenClose(prev => false);
        }}
      />
    </div>
  );
};
