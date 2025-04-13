
import React from 'react';
import { Collapse, Box } from '@mui/material';

const Collapsible = ({ open, children, ...props }) => {
  return (
    <Box {...props}>
      {children}
    </Box>
  );
};

const CollapsibleTrigger = ({ children, onClick, ...props }) => {
  return (
    <Box onClick={onClick} sx={{ cursor: 'pointer' }} {...props}>
      {children}
    </Box>
  );
};

const CollapsibleContent = ({ open, children, ...props }) => {
  return (
    <Collapse in={open} {...props}>
      {children}
    </Collapse>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
