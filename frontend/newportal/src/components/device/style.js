import { Modal } from 'antd';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-family: MicrosoftJhengHei;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.31;
    letter-spacing: normal;
  }

  .ant-modal-body {
    padding-top: 8px;
  }

  .ant-form .ant-form-item-label {
    line-height: 39.9px;
  }

  .footer {
    text-align: right;
    margin-top: 28px;
  }
`;
