import styled from 'styled-components';
import { Col, Row, List, Upload } from 'antd';

export const Wrapper = styled.div`
  .ml15 {
    margin-left: 15px;
  }

  .mb39 {
    margin-bottom: 39px;
  }

  .mt38 {
    margin-top: 38px;
  }

  .mb92 {
    margin-bottom: 92px;
  }

  .ml20 {
    margin-left: 20px;
  }

  .mr-3--percent {
    margin-right: 3%;
  }

  .text-grey {
    color: #9b9b9b;
  }

  .font-size-sm {
    font-size: 13px;
  }

  .font-size-md {
    font-size: 14px;
  }

  .ant-btn.ant-input-search-button.ant-btn-primary.ant-btn-loading {
    i.anticon.anticon-spin.anticon-loading {
      font-size: 12px;
    }
  }

  .row--flex {
    display: flex;
    align-items: center;
  }

  .ant-form-explain {
    color: #f5222d !important;
  }
`;

export const StyleCardCol = styled(Col)`
  .ant-row {
    margin-bottom: 20px;
    font-size: 14px;
    color: #4a4a4a;
    line-height: 1.5;
  }
`;

export const StyleSubCtrlRow = styled(Row)`
  .ant-input-search.ant-input-search-enter-button > .ant-input {
    color: #5a5a5a;
  }
  hr {
    margin: 15px 0 60px 0px;
  }
  .title_01 {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: bold;
  }
  .title_02 {
    width: 351px;
    height: 21px;
    font-size: 13px;
    color: #9b9b9b;
    margin-bottom: 10px;
  }
  .title_03 {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: bold;
    padding-top: 60px;
  }
  .ant-list-item-content .ant-row {
    width: 100%;

    div:nth-child(2) {
      color: ${p => p.theme.perrywinkle};
      font-weight: 500;
    }
  }

  .ant-list-item-action > li > a {
    color: ${p => p.theme.darkbluegrey};
    text-decoration: underline;
  }

  .anticon.anticon-spin.anticon-loading {
    color: #fff !important;
  }
`;

export const StyleSubCtrlList = styled(List)`
  margin-bottopm: 139px;

  .ant-spin-container {
    height: 230px;
    overflow-y: auto;
  }

  .ant-list-item {
    height: 46px !important;
  }
`;

export const StyleColorPick = styled.div`
  div {
    border-radious: 5px;
    width: 40px;
    height: 18px;
    border-radius: 9px;
    display: inline-block;
    cursor: pointer;
    margin-right: 2%;
  }
  div.focus {
    border: solid 2px #3b99fc;
  }
`;

export const StyleGuardAreaWrapper = styled.div`
  div {
    padding: 3px 5px;
    border-radius: 4px;
    background-color: #f7f7f7;
    border: solid 1px #e9e9e9;
    display: inline-block;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.65);
  }
`;

export const StyleAvatarColor = styled.div`
  position: relative;
  div.colorPick {
    width: 26px;
    height: 26px;
    border: solid 1px #ffffff;
    border-radius: 24px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 70%;
  }
  .avatar-uploader-button {
    display: block;
    left: 35%;
  }

  .uploadBtn {
    width: 26px;
    height: 26px;
    border: solid 1px #d9d9d9;
    border-radius: 24px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    color: #1e3954;
    left: 70%;
    background: #fff;
  }

  .ant-avatar.ant-avatar-circle {
    width: 110px;
    height: 110px;
    border-radius: 55px;
  }
`;

export const StyleAvatar = styled(Upload)`
  .ant-upload.ant-upload-select-picture-card {
    background-color: transparent;
    border: none;
    position: relative;
  }

  .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0px;
  }

  .ant-upload.ant-upload-select-picture-card > .ant-upload img {
    width: 110px;
    height: 110px;
    border: 3px solid #fff;
    text-align: center;
    border-radius: 99em;
    background-size: cover;
    display: block;
  }

  .ant-avatar-string {
    top: 35%;
  }
`;
