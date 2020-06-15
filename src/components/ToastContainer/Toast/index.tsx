import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { useToast, ToastMessage } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  toast: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast: handleRemoveToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemoveToast(toast.id);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [handleRemoveToast, toast.id]);

  return (
    <Container
      hasDescription={Number(!!toast.description)}
      type={toast.type}
      style={style}
    >
      {icons[toast.type || 'info']}

      <div>
        <strong>{toast.title}</strong>
        <p>{toast.description}</p>

        <button type="button" onClick={() => handleRemoveToast(toast.id)}>
          <FiXCircle size={18} />
        </button>
      </div>
    </Container>
  );
};

export default Toast;
