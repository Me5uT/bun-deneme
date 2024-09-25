import { Modal } from 'antd';
import React from 'react';
interface ModalStyles {
  body?: React.CSSProperties;
  content?: React.CSSProperties;
  footer?: React.CSSProperties;
  mask?: React.CSSProperties;
  wrapper?: React.CSSProperties;
  header?: React.CSSProperties;
}
interface IFormDialogProps {
  children: React.ReactNode;
  dialogTitle?: string;
  open: boolean;
  onClose: () => void;
  fullWidth?: boolean;
  maxWidth?: number; // updated this to number to represent max width in px
  styles?: ModalStyles;
  footer: React.ReactNode | null;
  maskClosable?: boolean;
  closeIcon?: boolean;
  destroyOnClose?: boolean;
  loading?: boolean;
  centered?: boolean;
}

export const FormDialog: React.FC<IFormDialogProps> = ({
  children,
  dialogTitle,
  open,
  maskClosable = false,
  closeIcon = null,
  onClose,
  fullWidth,
  maxWidth,
  styles,
  footer,
  loading = false,
  destroyOnClose = true,
  centered,
}) => {
  return (
    <Modal
      centered={centered}
      open={open}
      loading={loading}
      onCancel={onClose}
      width={fullWidth ? '100%' : maxWidth}
      footer={footer}
      destroyOnClose={destroyOnClose}
      title={dialogTitle}
      styles={styles}
      closeIcon={closeIcon} // Close icon removed
      maskClosable={maskClosable} // Prevent closing the modal when clicked outside
    >
      {children}
    </Modal>
  );
};
