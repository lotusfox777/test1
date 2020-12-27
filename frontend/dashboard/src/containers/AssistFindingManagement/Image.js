import React from 'react';
import { Modal } from 'antd';
import { rgba } from 'polished';
import styled from 'styled-components';

export default function Image({ url, ...props }) {
  const [visible, setIsVislbe] = React.useState(false);

  const handleClick = () => {
    setIsVislbe(prev => !prev);
  };

  return (
    <React.Fragment>
      {visible && (
        <StyledModal
          visible
          maskStyle={{ background: rgba(0, 0, 0, 0.9) }}
          width="100%"
          style={{ top: 30 }}
          bodyStyle={{
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
          }}
          footer={null}
          onCancel={handleClick}>
          <img
            alt="example"
            style={{
              maxWidth: '100%',
              width: 'auto',
              display: 'block',
              boxShadow:
                '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
            }}
            src={url}
          />
        </StyledModal>
      )}
      <img
        width={60}
        height="auto"
        css={{ cursor: 'pointer' }}
        src={url}
        alt={url}
        onClick={handleClick}
        {...props}
      />
    </React.Fragment>
  );
}

const StyledModal = styled(Modal)`
  animation-duration: 0s !important;
  transition: none !important;

  &.ant-modal {
    .ant-modal-content {
      background: transparent;
    }

    .ant-modal-close-x {
      margin-right: 5px;
      margin-top: -23px;
      color: #fff;
      font-size: 28px;
    }
  }
`;
