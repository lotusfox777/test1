import { Row } from 'antd';
import BasicModal from 'components/BasicModal';
import styled from 'styled-components';

export const StyleWrapper = styled(Row)`
	.styled-mbr .ant-row > div {
		font-family: MicrosoftJhengHei;
		font-size: 14px;
		font-weight: bold;
		color: #1e3954;
	}

	.ant-row.account_footer {
		border-top: 1px solid #d9d9d9;
		text-align: center;
		background-color: #fafafa;
		height: 45px;
		margin-top: 49px;
		margin-bottom: 0px;
		a {
			cursor: default !important;
			text-decoration: none !important;
		}
	}

	a {
		color: #9b9b9b;
		line-height: 3;
		vertical-align: middle;
	}
	a:hover {
		color: #9b9b9b;
		text-decoration: underline;
		text-decoration-color: #9b9b9b;
	}

	.ant-divider {
		height: 3em;
	}

	a.unmout-line {
		color: #1e3954;
		font-weight: normal;
	}
	.mout-line {
		color: #79abe5;
		line-height: 3;
		vertical-align: middle;
	}

	.styled-mbr {
		margin: 0px 7.5%;
	}

	.styled-mbr .ant-row {
		margin-bottom: 10px;
	}

	.ant-input-search-button {
		font-family: MicrosoftJhengHei;
		font-size: 14px;
		font-weight: bold;
		background-color: #79abe5;
		border-color: #d9d9d9;
	}
	.anticon-edit {
		cursor: pointer;
  }

  .ant-input-search.ant-input-search-enter-button > .ant-input {
    color: #5a5a5a;
  }

  .ant-btn.ant-input-search-button.ant-btn-primary.ant-btn-loading {
    i.anticon.anticon-spin.anticon-loading {
      font-size: 12px;
    }
  }
`;

export const StyleAvatarWrap = styled.div`
	position: relative;
	text-align: center;

	.ant-upload.ant-upload-select-picture-card {
		background-color: transparent;
		border: none;
		position: relative;
		display: inline-block;
		margin: 0 auto;
	}

	.ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0px;
	}

	.ant-upload.ant-upload-select-picture-card > .ant-upload img {
		text-align: center;
		border-radius: 99em;
		background-size: cover;
		display: block;
	}

	#upload_btn #icon-camera {
		position: absolute;
		right: 6px;
		bottom: 6px;
	}

	#upload_btn {
		position: relative;
	}
`;

export const StyledModal = styled(BasicModal)`
	.ant-modal-body {
		padding: 20px 0px 0px;
	}
`;

export const StyleVerifyPhone = styled.div`
	font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
	font-weight: normal;

	.ant-input {
		font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
		font-weight: normal;
	}

	h2 {
		font-family: MicrosoftJhengHei;
		height: 21px;
		font-size: 16px;
		font-weight: bold;
		color: #1e3954;
		margin-bottom: 30px;
	}

	.footer {
		height: 45px;
		margin-right: 19px;
	}

	.styled-mbr {
		padding: 0px 7.5%;
	}

	.styled-mbr .ant-row {
		margin-bottom: 14px;
	}

	.ant-form-item-label {
		text-align: left;
	}
`;

export const StyleResetPass = styled.div`
	font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
	margin-left: 24px;
	margin-right: 20px;
	padding-bottom: 20px;
	font-weight: normal;
	color: #1e3954;
	font-size: 14px;
	line-height: 1.5;

	.ant-input {
		font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
		font-weight: normal;
	}

	.ant-form .ant-form-item-label {
		line-height: 39.9999px;
		text-align: left;
	}

	.ant-form-item-label label {
		font-family: MicrosoftJhengHei;
		font-size: 14px;
		color: #1e3954;
	}
`;
