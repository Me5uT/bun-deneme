import { Card, Descriptions, DescriptionsProps, Table } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IGroup } from 'app/shared/model/GroupModel';
import React from 'react';
import { getEntity } from './group.reducer';
import { getExternalSourceByGroup } from '../external-source/externalSource.reducer';
import { getParticipantByGroup } from '../user/usertemp.reducer';
import { IParticipantByGroupModel } from 'app/shared/model/participant.model';
interface GroupDetailDrawerProps {
  uid: string;
}
export const GroupDetailDrawer: React.FC<GroupDetailDrawerProps> = ({ uid }) => {
  const [searchDataForParticipant, setSearchDataForParticipant] = React.useState<IParticipantByGroupModel>({
    size: 10,
    page: 0,
    searchtext: '',
    isExcept: false,
    groupId: uid,
  });
  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

  const groupDetail: IGroup = useAppSelector(state => state.group.entity);
  const externalSourceByGroupList: IGroup[] = useAppSelector(state => state.externalSource.externalSourceByGroupList);
  const participantByGroupList = useAppSelector(state => state.userTemp.participantByGroupList);
  const participantByGroupLoading: boolean = useAppSelector(state => state.userTemp.participantByGroupLoading);
  const participantByGroupCount = useAppSelector(state => state.userTemp.participantByGroupCount);

  const items: DescriptionsProps['items'] = [
    {
      label: 'Name',
      children: groupDetail?.name,
    },
    {
      label: 'Description',
      children: groupDetail?.description,
    },
    {
      label: 'External Sources',
      children: externalSourceByGroupList.map(es => es.name).join(', ') || '-',
    },
  ];

  const columnsForParticipant = [
    { dataIndex: 'username', title: 'Username' },
    { dataIndex: 'displayName', title: 'Display Name' },
  ];

  React.useEffect(() => {
    if (uid) {
      dispatch(getEntity({ accountId: baseObj?.accountId, groupId: uid }));
    }
  }, [uid]);

  React.useEffect(() => {
    if (uid) {
      dispatch(getExternalSourceByGroup({ groupId: uid, isExcept: false, searchtext: '' }));
    }
  }, [uid]);

  React.useEffect(() => {
    dispatch(getParticipantByGroup(searchDataForParticipant));
  }, []);

  return (
    <Card loading={!groupDetail}>
      <Descriptions className="my-descriptions" column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} items={items} />
      <Table
        bordered
        columns={columnsForParticipant}
        rowKey={'uid'}
        tableLayout="fixed"
        dataSource={participantByGroupList}
        loading={participantByGroupLoading}
        pagination={{
          current: searchDataForParticipant.page + 1,
          pageSize: searchDataForParticipant.size,
          total: participantByGroupCount,
          showTotal: total => (
            <div>
              Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
            </div>
          ),
          onChange: (page, pageSize) => setSearchDataForParticipant(prev => ({ ...prev, page: page - 1, size: pageSize })),
        }}
      />
    </Card>
  );
};
