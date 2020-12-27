import React from 'react';

export default function useVisible({ onRequestOpen } = {}) {
  const [visible, setVisible] = React.useState(false);

  const handleVisible: any = evt => {
    setVisible(prev => !prev);

    if (onRequestOpen) {
      onRequestOpen();
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return [visible, handleVisible, handleClose];
}
