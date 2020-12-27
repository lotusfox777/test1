import * as React from 'react';
import { Icon, Modal } from 'antd';
import StyleButton from 'components/Button';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
	.message {
		font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
		font-size: 14px;
		font-weight: bold;
		color: #4a4a4a;
	}
	.anticon.anticon-exclamation-circle {
		color: #faad14;
		font-size: 24px;
		margin-right: 16px;
		vertical-align: middle;
	}
	.footer {
		text-align: right;
		margin-top: 28px;
	}
`;

class WarningModal extends React.Component {
  render() {
    const { message, onCancel, onDelete } = this.props;
    return (
      <StyledModal
        {...this.props}
        visible={true}
        footer={null}
        onCancel={onCancel}>
        <Icon type="exclamation-circle" theme="filled" />
        <span className="message">{message}</span>
        <div className="footer">
          <StyleButton
            type="white"
            key="cancel"
            text="取消"
            onClick={onCancel}
            style={{ marginRight: '3%' }}
          />
          <StyleButton key="delete" text="刪除" onClick={onDelete} />
        </div>
      </StyledModal>
    );
  }
}

export default WarningModal;
