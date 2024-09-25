/* eslint-disable no-constant-condition */
import { animated, useSpring, useTrail } from '@react-spring/web';
import { Button, Modal, ModalProps, Typography } from 'antd';
import React from 'react';

interface IInformationDialogProps extends ModalProps {
  modalType?: 'success' | 'error';
  message?: string;
  onClose?: () => void;
}

const WarnDialogComponent: React.FC<IInformationDialogProps> = props => {
  const animationStyle = useSpring({
    strokeDashoffset: props.open ? 0 : 100,
    config: { duration: 1000 },
    delay: 300,
  });

  const shakeStyle = useSpring({
    from: { x: 0 },
    to: { x: props.open ? 1 : 0 },
    config: { tension: 300, friction: 10 },
    delay: 300,
  });

  const stars = Array.from({ length: 9 });

  const starAnimations = stars.map((_, index) =>
    useSpring({
      from: { opacity: 0 },
      async to(next) {
        while (true) {
          await next({ opacity: 1 });
          await next({ opacity: 0 });
        }
      },
      config: { duration: 1000 },
      delay: index * 160, // Her yıldız için farklı gecikme süresi
      reset: true,
    })
  );

  return (
    <Modal
      {...props}
      destroyOnClose={props.destroyOnClose ? props?.destroyOnClose : true}
      style={{
        borderRadius: '12px',
        padding: '36px',
        textAlign: 'center',
      }}
      styles={{ footer: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }}
      footer={[
        <Button
          key={'asd'}
          style={{
            color: props.modalType === 'error' && 'blue',
            backgroundColor: props.modalType === 'error' && 'lavender',
            border: 'none',
            fontWeight: 'normal',
            padding: '10px 24px',
            margin: '20px 0px',
            height: 'auto',
          }}
          type={'primary'}
          onClick={props.onClose}
        >
          Ok, got it!
        </Button>,
      ]}
      closable={false}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px', position: 'relative' }}>
          <animated.svg
            width="100"
            height="100"
            viewBox="0 0 50 50"
            style={{
              transform: shakeStyle.x
                .to({
                  range: [0, 0.25, 0.5, 0.75, 1],
                  output: [0, -5, 5, -5, 0],
                })
                .to(x => `translateX(${x}px)`),
            }}
          >
            <circle cx="25" cy="25" r="22" fill="none" stroke={props.modalType === 'success' ? '#a1e4b6' : '#f6a8a8'} strokeWidth="3" />
            <animated.path
              fill="none"
              stroke={props.modalType === 'success' ? 'green' : 'red'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={100}
              strokeDashoffset={animationStyle.strokeDashoffset}
              d={props.modalType === 'success' ? 'M14,26 L22,34 L36,18' : 'M16,16 L34,34 M34,16 L16,34'}
            />
          </animated.svg>
          {props.modalType === 'success' &&
            stars.map((_, index) => (
              <animated.div
                className={'star'}
                key={index}
                style={{
                  ...starAnimations[index],
                  position: 'absolute',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,

                  backgroundColor: 'yellow',
                  borderRadius: '50%',
                }}
              />
            ))}
        </div>
      </div>
      <Typography.Text
        style={{
          fontSize: '16px',
          fontWeight: 'normal',
          margin: '30px 0px',
        }}
      >
        {props.message}
      </Typography.Text>
    </Modal>
  );
};

export const WarnDialog = React.memo(WarnDialogComponent);
