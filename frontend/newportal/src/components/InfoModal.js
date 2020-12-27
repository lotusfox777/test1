import * as React from 'react';
import { Icon, Modal } from 'antd';
import StyleButton from 'components/Button';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
	.message {
		font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
		font-size: 14px;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.75);
		width: 85%;
		display: inline-block;
	}
	.anticon.ant-modal-close-icon {
		vertical-align: middle;
	}
	.anticon {
		font-size: 24px;
		margin-right: 16px;
		vertical-align: top;
	}
	.anticon.anticon-close-circle {
		color: #f5222d;
	}
	.anticon.anticon-check-circle {
		color: #52c41a;
	}
	.anticon.anticon-info-circle {
		color: #1890ff;
	}
	.footer {
		text-align: right;
		margin-top: 28px;
	}
`;

class InfoModal extends React.Component {
 renderIcon = () => {
   switch (this.props.type) {
   case 'error':
     return <Icon type="close-circle" theme="filled" />;
   case 'success':
     return <Icon type="check-circle" theme="filled" />;
   case 'info':
     return <Icon type="info-circle" theme="filled" />;
   default:
     return <Icon type="info-circle" theme="filled" />;
   }
 };
 render() {
   const { message, onCancel, onOK } = this.props;

   return (
     <StyledModal visible={true} footer={null} onCancel={onCancel}>
       {this.renderIcon()}
       <span className="message">{message}</span>
       <div className="footer">
         <StyleButton key="confirm" text="確認" onClick={onOK} />
       </div>
     </StyledModal>
   );
 }
}

export default InfoModal;
