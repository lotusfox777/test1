import { Form, Row } from 'antd';
import styled from 'styled-components';
export const StyledModal = styled.div`
  max-width: 400px;
  margin: 0 auto;

  div.title_01 {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #1e3954;
  }

  div.title_02 {
    font-size: 16px;
    font-weight: normal;
    text-align: center;
  }

  .ant-form-item-label {
    line-height: 21px;
  }

  .ant-form-item label {
    font-size: 18px;
    font-weight: bold;
  }

  .ant-form-item.n_font label {
    font-size: 18px;
    font-weight: normal;
  }

  .ant-form-item.label-email label {
    font-family: Arial;
    font-size: 18px;
    font-weight: normal;
  }

  .ant-input {
    height: 40px;
  }

  .mt_9 {
    margin-top: 9px;
  }

  .mt_17 {
    margin-top: 17px;
  }

  .mb_27 {
    margin-bottom: 27.4px;
  }

  .mb_32 {
    margin-bottom: 32px;
  }

  .mb_34 {
    margin-bottom: 34px;
  }

  .mb_36 {
    margin-bottom: 36px;
  }

  .mb_40 {
    margin-bottom: 40px;
  }

  .mb_50 {
    margin-bottom: 7%;
  }

  .mt_50 {
    margin-top: 50px;
  }

  .mb_51 {
    margin-bottom: 51px;
  }

  .mb_90 {
    margin-bottom: 90px;
  }

  .mb_124 {
    margin-bottom: 124px;
  }

  .font_style_14 {
    font-size: 14px;
    font-weight: normal;
    color: #4a4a4a;
  }

  .btn_type_h40 {
    font-size: 16px;
    height: 40px;
    width: 100%;
    min-width: 290px;
  }
`;

export const Link = styled.span`
  color: #1e3954;
  &:hover {
    cursor: pointer;
    color: #79abe5;
  }
`;

export const RowM = styled(Row)`
  margin-top: 50px;
`;
export const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;

export const StyleAvatarWrap = styled.div`
  .ant-upload.ant-upload-select-picture-card {
    background-color: transparent;
    border: none;
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

export const AvatarSize = {
  height: 140,
  width: 140
};
