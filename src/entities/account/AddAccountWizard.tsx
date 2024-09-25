import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Space, StepProps, Steps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { systemSettings } from 'app/shared/mockdata/SystemSettings';
import { ITenant, LicenceTypeInt, TenantTypeInt } from 'app/shared/model/tenant.model';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formInitialValues } from './FormModel/formInitialValues';
import validationSchema from './FormModel/validationSchema';
import { createEntity, resetErrorMessage } from './account.reducer';
import { AccountForm } from './forms/AccountForm';
import { LicenseForm } from './forms/LicenseForm';
import { OptionalForm } from './forms/OptionalForm';

interface IAddAccountWizardProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddAccountWizard: React.FC<IAddAccountWizardProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const initialSteps: StepProps[] = React.useMemo(
    () => [
      { title: 'Account', status: 'wait' },
      { title: 'License', status: 'wait' },
      { title: 'Optional', status: 'wait' },
    ],
    []
  );

  const [steps, setSteps] = React.useState<StepProps[]>(initialSteps);
  const [activeStep, setActiveStep] = React.useState(0);

  const [baseObj] = useMirketPortal();

  const items = React.useMemo(() => steps.map(item => ({ key: item.title, title: item.title })), []);

  const currentValidationSchema = React.useMemo(() => validationSchema[activeStep], [activeStep]);
  const isLastStep = React.useMemo(() => activeStep === steps.length - 1, [activeStep]);

  const dispatch = useAppDispatch();
  const errorMessage: string = useAppSelector(state => state.account.errorMessage);
  const loading: boolean = useAppSelector(state => state.account.loading);

  const _renderStepContent = React.useCallback(
    (step: number) => {
      switch (step) {
        case 0:
          return <AccountForm />;
        case 1:
          return <LicenseForm />;
        case 2:
        default:
          return <OptionalForm />;
        // default:
        //   return <div>{'Page not found'}</div>;
      }
    },
    [activeStep]
  );

  const methods = useForm({
    defaultValues: formInitialValues,
    resolver: yupResolver(currentValidationSchema as any),
    mode: 'onSubmit',
  });

  const updateStepsStatus = React.useCallback(() => {
    setSteps(prev =>
      prev.map((step, index) => {
        if (index === activeStep) {
          return { ...step, status: 'finish' };
        }
        return step;
      })
    );
  }, [activeStep]);

  const _handleSubmit = async (values: any) => {
    console.log('onSubmit values:', values);

    updateStepsStatus();
    if (isLastStep) {
      const serializedValues: ITenant = {
        ...values,
        accountId: baseObj?.accountId,
        accountType: baseObj?.tenantType === TenantTypeInt.MIRKET ? values.accountType : TenantTypeInt.ENDUSER,
        domain: values.ownerMail.split('@')[1],
        licenceCount: values.licenceType !== LicenceTypeInt.Demo ? values.licenceCount : 5,
        expireDate:
          values.licenceType !== LicenceTypeInt.Demo
            ? dayjs(values.expireDate).valueOf()
            : dayjs()
                .add(dayjs.duration({ days: systemSettings.demo_values.expire_days }))
                .valueOf(),
      };

      await dispatch(createEntity(serializedValues));
      // _handleModalClose();
      setResultModalOpenClose(true);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const _handleModalClose = () => {
    setModalOpenClose(false);
    setActiveStep(prev => 0);
    methods.reset();
  };

  const _handleBack = React.useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, [activeStep]);

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

  React.useEffect(() => {
    const subscription = methods.watch((value: Partial<ITenant>, { name, type }) => {
      if (name === 'ownerMail') {
        const alias = value.ownerMail ? value.ownerMail.split('@')[1]?.split('.')[0] : '';
        methods.setValue('alias', alias);
      } else if (name === 'licenceType' && (value.licenceType as any) === LicenceTypeInt.Demo) {
        methods.setValue('licenceCount', Number(systemSettings.demo_values.user_count));
        methods.setValue(
          'expireDate',
          dayjs()
            .add(dayjs.duration({ days: systemSettings.demo_values.expire_days }))
            .toString()
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  return (
    <React.Fragment>
      <Steps current={activeStep} items={items} style={{ display: 'flex', flexDirection: 'row', paddingTop: '-16px', flexWrap: 'wrap' }} />
      <hr />
      <React.Fragment>
        <FormProvider {...methods}>
          <form
            className="add-modal-form-item"
            onSubmit={methods.handleSubmit(_handleSubmit, errors => {
              console.log('form submit error:', errors);
            })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '450px',
              padding: '20px 5px 0px 5px',
            }}
          >
            {_renderStepContent(activeStep)}

            <Space style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px' }}>
              <Button onClick={_handleModalClose}>{'Close'}</Button>
              <Space>
                <Button onClick={_handleBack} disabled={activeStep === 0}>
                  {'Back'}
                </Button>
                <Button htmlType="submit" type="primary" loading={loading}>
                  {isLastStep ? 'Save' : 'Next'}
                </Button>
              </Space>
            </Space>
          </form>
        </FormProvider>
      </React.Fragment>
    </React.Fragment>
  );
};
