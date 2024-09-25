/* eslint-disable object-shorthand */
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Drawer, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FormDialog } from 'app/shared/components/FormDialog';
import { ThreeDotDropdown } from 'app/shared/components/ThreeDotDropdown';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { IManageListModel, ManageCategory, ManageCategoryStr } from 'app/shared/model/ManageModel';
import { EditManageForm } from './forms/EditManageForm';
import { ManageDetails } from './forms/ManageDetails';
import { TableToolbar } from './TableToolbar';
import { getColorByType } from 'app/shared/util/UtilityService';
import { getEntities } from './manage.reducer';

export const ManageList: React.FC = () => {
  const [manageState, setManageState] = React.useState({
    openManageDetailDrawer: false,
    infoModalOpenClose: false,
    selectedManageId: '',
  });
  const [editModalOpenClose, setEditModalOpenClose] = React.useState<boolean>(false);
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const [searchData, setSearchData] = useSetState<Partial<IQueryParams>>({ searchtext: '', size: 10 });
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const manageList = useAppSelector(state => state.manage.manageList);
  const loading = useAppSelector(state => state.manage.loading);
  const errorMessage: string = useAppSelector(state => state.manage.errorMessage);

  const columns: ColumnsType<IManageListModel> = React.useMemo(
    () => [
      {
        dataIndex: 'detection',
        title: 'Detection',
        render(_, record, __) {
          return (
            <div
              className="managelink"
              onClick={() => {
                setEditModalOpenClose(true);
                setManageState(prev => ({
                  ...prev,
                  selectedManageId: record?.uid,
                }));
              }}
            >
              {record?.detection}
            </div>
          );
        },
      },
      {
        dataIndex: 'category',
        title: 'Category',
        render: (t, record, i) => {
          return <Tag color={getColorByType(ManageCategory, record?.category)}>{Object.values(ManageCategoryStr)[record?.category]}</Tag>;
        },
      },
      {
        dataIndex: 'lastDetect',
        title: 'Last Detect',
      },
      {
        dataIndex: 'configure',
        title: '',
        width: 150,
        render: (text, record, index) => (
          <ThreeDotDropdown className="radius-rule-action-td">
            <Button
              type="link"
              icon={<SearchOutlined />}
              onClick={() => {
                setManageState(prev => ({
                  ...prev,
                  openManageDetailDrawer: true,
                  selectedManageId: record?.uid,
                }));
              }}
            >
              Details
            </Button>
            {!baseObj?.isReadOnly && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditModalOpenClose(true);
                  setManageState(prev => ({
                    ...prev,
                    selectedManageId: record?.uid,
                  }));
                }}
              >
                Edit
              </Button>
            )}
          </ThreeDotDropdown>
        ),
      },
    ],
    []
  );

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId, ...searchData }));
  }, [searchData]);

  return (
    <div>
      <TableToolbar listFiltered={listFiltered} setListFiltered={setListFiltered} setSearchData={setSearchData} />
      <Table
        rowKey={'uid'}
        columns={columns}
        dataSource={manageList}
        loading={loading}
        pagination={{
          pageSize: 100,
          total: manageList?.length,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
        }}
      />
      <FormDialog
        destroyOnClose
        open={editModalOpenClose}
        closeIcon
        styles={{
          body: {
            minHeight: '150px',
          },
        }}
        onClose={() => {
          setEditModalOpenClose(prev => false);
        }}
        maxWidth={800}
        footer={null}
        dialogTitle={modalTitle}
      >
        <EditManageForm
          setModalOpenClose={setEditModalOpenClose}
          setResultModalOpenClose={setResultModalOpenClose}
          setModalTitle={setModalTitle}
          uid={manageState?.selectedManageId}
        />
      </FormDialog>
      <Drawer
        styles={{ body: { padding: 0 } }}
        destroyOnClose
        width={640}
        title="Detection Details"
        placement="right"
        closable={true}
        onClose={() => {
          setManageState(prev => ({ ...prev, openManageDetailDrawer: false }));
        }}
        open={manageState?.openManageDetailDrawer}
      >
        <ManageDetails uid={manageState?.selectedManageId} />
      </Drawer>
    </div>
  );
};
