import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Space, StepProps, Steps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ISmsProviderAddRequestModel } from 'app/shared/model/sms-provider.model';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formInitialValues } from './FormModel/formInitialValues';
import validationSchema from './FormModel/validationSchema';
import { CodeForm } from './forms/CodeForm';
import { InformationForm } from './forms/InformationForm';
import { createEntity, resetErrorMessage } from './sms-provider.reducer';

interface IAddSmsProviderWizardProps {
  setModalOpenClose: (v: boolean) => void;
  setResultModalOpenClose: (v: boolean) => void;
}

export const AddSmsProviderWizard: React.FC<IAddSmsProviderWizardProps> = ({ setModalOpenClose, setResultModalOpenClose }) => {
  const initialSteps: StepProps[] = [
    { title: 'Provider Info', status: 'wait' },
    { title: 'Other Info', status: 'wait' },
  ];

  const [steps, setSteps] = React.useState<StepProps[]>(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [baseObj] = useMirketPortal();

  const dispatch = useAppDispatch();
  const loading: boolean = useAppSelector(state => state.smsProvider.loading);
  const errorMessage: string = useAppSelector(state => state.smsProvider.errorMessage);

  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const items = steps.map(item => ({ key: item.title, title: item.title }));

  const _renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <InformationForm />;

      case 1:
        return <CodeForm />;

      default:
        return <div>{'Page Not Found'}</div>;
    }
  };

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

  const _handleSubmit = React.useCallback(
    async (values: any) => {
      console.log('onSubmit values:', values);

      updateStepsStatus();
      if (isLastStep) {
        const serializedValues: ISmsProviderAddRequestModel = {
          ...values,
          accountId: baseObj?.accountId,
        };

        await dispatch(createEntity(serializedValues));
        // _handleModalClose();
        setResultModalOpenClose(true);
      } else {
        setActiveStep(prev => prev + 1);
      }
    },
    [activeStep]
  );

  const _handleModalClose = () => {
    methods.reset(); // Reset form fields
    setModalOpenClose(false);
    setActiveStep(0);
  };

  const _handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  React.useEffect(() => {
    if (errorMessage === '') {
      _handleModalClose();
      dispatch(resetErrorMessage());
    }
  }, [errorMessage]);

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
              minHeight: '480px',
              padding: '20px 5px 0px 5px',
            }}
          >
            {_renderStepContent(activeStep)}

            <Space style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '25px' }}>
              <Button onClick={_handleModalClose}> {'Close'}</Button>
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
