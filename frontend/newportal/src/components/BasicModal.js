import * as React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
	.ant-row {
		margin-bottom: 16px;
	}
	.ant-row > div,
	.ant-form-item-label label {
		font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
		font-size: 14px;
		font-weight: normal;
		color: #4a4a4a;
	}
	.ant-row .label {
		padding: 1.5% 0px;
	}
	.ant-row a.delete-btn {
		font-size: 14px;
		line-height: normal;
		color: #f5222d;
		line-height: 3;
		vertical-align: middle;
	}
	.ant-row a.delete-btn:hover {
		color: #f5222d;
		text-decoration: underline;
		text-decoration-color: #f5222d;
	}
	.ant-modal-header {
		height: 48px;
		padding-top: 12px;
	}
	.ant-modal-title {
		font-family: 'MicrosoftJhengHei';
		font-size: 16px;
		font-weight: bold;
		color: #666;
	}
	.ant-modal-body {
		padding-top: 20px;
		padding-bottom: 30px;
	}
	.footer {
		text-align: right;
		margin-top: 28px;
	}
	.ant-btn:nth-child(2) {
		margin-left: 5%;
	}
`;

class BasicModal extends React.Component {
  render() {
    return <StyledModal {...this.props} visible={true} footer={null} />;
  }
}

export default BasicModal;
