/* eslint-disable object-shorthand */
import { useSetState } from 'ahooks';
import { Drawer } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteDialog } from 'app/shared/components/DeleteDialog';
import { DragAndDropTable } from 'app/shared/components/DragAndDropTable';
import { FormDialog } from 'app/shared/components/FormDialog';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddRadiusRuleWizard } from './AddRadiusRuleWizard';
import { TableToolbar } from './TableToolbar';
import { RadiusRuleDetailForm } from './forms/RadiusRuleDetailForm';
import { deleteEntity, getEntities } from './radiusrule.reducer';
import { BackTopButton } from 'app/shared/components/BackTopButton';

export const RadiusRuleList: React.FC = () => {
  const [radiusRuleState, setRadiusRuleState] = React.useState<any>({
    openRuleDetailDrawer: false,
    infoModalOpenClose: false,
    selectedRuleId: '',
    isParticipantRule: false,
  });
  const [addModalOpenClose, setAddModalOpenClose] = React.useState<boolean>(false);
  const [searchData, setSearchData] = useSetState<Partial<IQueryParams>>({ searchtext: '', size: 10 });
  const [resultModalOpenClose, setResultModalOpenClose] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [baseObj] = useMirketPortal();
  const loading = useAppSelector(state => state.radiusRule.loading);
  const participantByRuleLoading = useAppSelector(state => state.radiusRule.participantByRuleLoading);
  const groupByRuleLoading = useAppSelector(state => state.radiusRule.groupByRuleLoading);
  const errorMessage: string = useAppSelector(state => state.radiusRule.errorMessage);

  React.useEffect(() => {
    dispatch(getEntities({ accountId: baseObj?.accountId, ...searchData }));
  }, [searchData]);

  return (
    <div>
      <TableToolbar
        listFiltered={listFiltered}
        setListFiltered={setListFiltered}
        setModalOpenClose={setAddModalOpenClose}
        setSearchData={setSearchData}
      />
      <DragAndDropTable listFiltered={listFiltered} searchData={searchData} setRadiusRuleState={setRadiusRuleState} />
      <FormDialog
        destroyOnClose
        open={addModalOpenClose}
        onClose={() => {
          setAddModalOpenClose(false);
        }}
        maxWidth={900}
        centered
        closeIcon
        footer={null}
        dialogTitle="Add Radius Rule"
        styles={{
          header: {
            marginBottom: '20px',
          },
          content: {
            padding: '20px 24px 0px 24px',
          },
        }}
      >
        <AddRadiusRuleWizard setModalOpenClose={setAddModalOpenClose} setResultModalOpenClose={setResultModalOpenClose} />
      </FormDialog>
      <DeleteDialog
        message="If you want to delete this radius rule, please click on the button below."
        type="danger"
        title="Do you  want to delete this radius rule?"
        open={radiusRuleState?.infoModalOpenClose}
        okText={'Delete'}
        okType="danger"
        iconFade={true}
        confirmLoading={loading}
        onOk={() => {
          dispatch(deleteEntity({ uid: radiusRuleState?.selectedRuleId, accountId: baseObj?.accountId, onDetail: false }));
          setRadiusRuleState(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
        onCancel={() => {
          setRadiusRuleState(prev => ({ ...prev, infoModalOpenClose: false }));
        }}
      />
      {/* <WarnDialog
        modalType={errorMessage ? 'error' : 'success'}
        open={resultModalOpenClose}
        message={errorMessage ? errorMessage : 'Done successfully.'}
        onClose={() => {
          setResultModalOpenClose(prev => false);
        }}
      /> */}
      <Drawer
        styles={{ body: { padding: 0 } }}
        destroyOnClose
        width={640}
        title="Radius Rule Details"
        placement="right"
        closable={true}
        loading={loading || groupByRuleLoading || participantByRuleLoading}
        onClose={() => {
          setRadiusRuleState(prev => ({ ...prev, openRuleDetailDrawer: false }));
        }}
        open={radiusRuleState?.openRuleDetailDrawer}
      >
        <RadiusRuleDetailForm uid={radiusRuleState?.selectedRuleId} isParticipantRule={radiusRuleState?.isParticipantRule} />
      </Drawer>
      <BackTopButton />
    </div>
  );
};
