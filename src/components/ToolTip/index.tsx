import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string;
}

const ToolTip: React.FC<TooltipProps> = ({ className, title, children }) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default ToolTip;
