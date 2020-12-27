import React from 'react';
import { Tooltip, Icon } from 'antd';

const TooltipButton = ({ name, type, onClick, iconStyle, ...props }) => {
  return (
    <Tooltip title={name} placement="bottom" {...props}>
      <Icon type={type} className="text-20" onClick={onClick} style={iconStyle} />
    </Tooltip>
  );
};

export default TooltipButton;
