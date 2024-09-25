/* eslint-disable object-shorthand */
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Space, Spin, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { cloneRadiusRule, sortRuleByOrder } from 'app/entities/radius-rule/radiusrule.reducer';
import { DndRow } from 'app/shared/components/DndRow';
import { formatSourceLabel, getColorByType, isUserDeviceMobile } from 'app/shared/util/UtilityService';
import React from 'react';
import useMirketPortal from '../hooks/useMirketPortal';
import { IRadisRuleSortByOrder, IRadiusRuleListModel } from '../model/RadiusRulesModel';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { ThreeDotDropdown } from './ThreeDotDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { countryList } from 'app/shared/mockdata/CountryList';

interface IDragAndDropTableProps {
  // columns: ColumnsType<any>;
  loading?: boolean;
  searchData: any;
  listFiltered: boolean;
  setRadiusRuleState: (v: any) => void;
}

export const DragAndDropTable: React.FC<IDragAndDropTableProps> = ({ searchData, listFiltered, setRadiusRuleState }) => {
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const radiusrulelist = useAppSelector(state => state.radiusRule.entities);
  const loading = useAppSelector(state => state.radiusRule.loading);

  const isDeviceMobile = React.useMemo(() => isUserDeviceMobile(), []);

  const sensorsForPCUsers = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const sensorsForMobileUsers = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        // Dokunmatik eylem başlatma kısıtlamaları
        delay: 300, // Milisaniye cinsinden gecikme
        tolerance: 5, // Piksel cinsinden hareket toleransı
      },
    })
  );

  const columns: ColumnsType<IRadiusRuleListModel> = [
    {
      dataIndex: 'name',
      title: 'Rule Name',
      width: 350,
      render: (text, record, index) => {
        return <div className={!record?.isActive ? 'passive-column' : undefined}>{record?.name}</div>;
      },
    },
    {
      dataIndex: 'source',
      title: 'Source',
      render: (text, record, index) => {
        return (
          <Space className={!record?.isActive ? 'passive-column' : undefined} direction="horizontal" size={40} style={{ width: '100%' }}>
            <Space direction="vertical">
              <div className="radius-rule-source-inner">
                <FontAwesomeIcon icon={'key'} style={{ paddingRight: 8 }} />
                <div>
                  {record?.radiusClientList === null
                    ? 'All'
                    : formatSourceLabel(record?.radiusClientList?.map(rc => rc?.name || '')) || 'All'}
                </div>
              </div>
              <div className="radius-rule-source-inner">
                <FontAwesomeIcon icon={'ethernet'} style={{ paddingRight: 8 }} />
                <div>{record?.sourceAddressList === null ? '0.0.0.0/0' : formatSourceLabel(record?.sourceAddressList) || ''}</div>
              </div>
              <div className="radius-rule-source-inner">
                <FontAwesomeIcon icon={'earth-americas'} style={{ paddingRight: 8 }} />
                <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                  {record?.sourceCountryList === null || record?.sourceCountryList[0] === 'all'
                    ? 'All'
                    : formatSourceLabel(
                        countryList.filter(country => record?.sourceCountryList.includes(country.value)).map(country => country.label)
                      )}
                </div>
              </div>
              <div className="radius-rule-source-inner">
                <FontAwesomeIcon icon={record?.isParticipantRule ? 'user' : 'users'} style={{ paddingRight: 8 }} />
                <div>
                  {!record?.isParticipantRule
                    ? formatSourceLabel(record?.participantGroupList?.map(rc => rc?.name || ''))
                    : record?.isParticipantRule && record?.isAllParticipantIncluded
                    ? 'All'
                    : formatSourceLabel(record?.participantList?.map(rc => rc?.username || ''))}
                </div>
              </div>
              <Button
                type="text"
                style={{ color: 'orange' }}
                onClick={() => {
                  setRadiusRuleState(prev => ({
                    ...prev,
                    selectedRuleId: record?.uid,
                    isParticipantRule: record?.isParticipantRule,
                    openRuleDetailDrawer: true,
                  }));
                }}
              >
                More
              </Button>
            </Space>
          </Space>
        );
      },
    },
    {
      dataIndex: 'providerName',
      title: 'Provider',
      width: 250,
      render: (t, r, i) => {
        return <div className={!r.isActive ? 'passive-column' : undefined}>{r.providerName}</div>;
      },
    },
    {
      dataIndex: 'isAccept',
      title: 'Action',
      width: 200,
      render: (text, record, index) => {
        return (
          <Tag className={!record?.isActive ? 'passive-column' : undefined} color={getColorByType(Boolean, record?.isAccept)}>
            {record?.isAccept ? 'Accept' : 'Deny'}
          </Tag>
        );
      },
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
              setRadiusRuleState(prev => ({
                ...prev,
                openRuleDetailDrawer: true,
                selectedRuleId: record?.uid,
                isParticipantRule: record?.isParticipantRule,
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
                navigate(`/${baseObj?.basePath}/radius-rules/${record?.uid}`);
              }}
            >
              Edit
            </Button>
          )}
          {!baseObj?.isReadOnly && (
            <Button
              type="link"
              icon={<FontAwesomeIcon icon="copy" />}
              onClick={() => {
                dispatch(cloneRadiusRule({ radiusRuleUid: record?.uid, accountId: baseObj?.accountId }));
              }}
            >
              Clone
            </Button>
          )}
          {!baseObj?.isReadOnly && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setRadiusRuleState(prev => ({ ...prev, infoModalOpenClose: true, selectedRuleId: record?.uid }));
              }}
            >
              {'Delete'}
            </Button>
          )}
        </ThreeDotDropdown>
      ),
    },
  ];

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = radiusrulelist.findIndex(i => i.uid === active?.id);
      const overIndex = radiusrulelist.findIndex(i => i.uid === over?.id);
      const sortedList: any[] = arrayMove(radiusrulelist, activeIndex, overIndex);
      const sortedListByUid = sortedList?.map(value => value.uid);

      if (sortedListByUid?.length === radiusrulelist?.length && !listFiltered) {
        const params: IRadisRuleSortByOrder = {
          accountId: baseObj?.accountId,
          ruleUids: sortedListByUid,
        };

        setDataSource(sortedList);
        await dispatch(sortRuleByOrder(params));
      }
    }
  };

  React.useEffect(() => {
    if (radiusrulelist) setDataSource(radiusrulelist);
  }, [radiusrulelist]);

  return (
    <DndContext
      sensors={isDeviceMobile ? sensorsForMobileUsers : sensorsForPCUsers}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={dataSource?.map(i => i.uid)} strategy={verticalListSortingStrategy}>
        <Table
          components={{
            body: {
              row: DndRow,
            },
          }}
          tableLayout="auto"
          rowKey={'uid'}
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={{
            pageSize: searchData?.size,

            total: dataSource?.length,
            showTotal: total => (
              <div>
                Total <b>{total}</b> {`${total === 1 ? 'item' : 'items'}`}
              </div>
            ),
          }}
        />
      </SortableContext>
    </DndContext>
  );
};
