import React, { PureComponent } from 'react';
import StyleButton from 'components/Button';
import { Input, Form, Row, Col, Upload, Icon, Modal, message, Avatar } from 'antd';
import styled from 'styled-components';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('檔案太大, 請勿超過2MB!');
  }
  return isLt2M;
}

const modalTitle = {
  fontFamily: 'MicrosoftJhengHei',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#666',
};

const footer = {
  textAlign: 'right',
  marginTop: '28px',
};

const StyleWrapper = styled.span`
  font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
  color: #4a4a4a;
`;

const StyledModal = styled(Modal)`
  .ant-form-item-required:before {
    display: none;
  }

  label[for='minor'] {
    padding-left: 5px;
  }
`;

const StyleColorPick = styled.div`
  height: 32px;
  padding: 1% 0px;
  div {
    border-radious: 5px;
    width: 40px;
    height: 18px;
    border-radius: 9px;
    display: inline-block;
    cursor: pointer;
    margin-right: 3%;
  }

  div.focus {
    border: solid 2px #3b99fc;
  }
`;

const StyleAvatarColor = styled.div`
  .avatar-uploader-button {
    display: block;
    left: 35%;
  }
`;

const StyleAvatar = styled(Upload)`
  .ant-upload.ant-upload-select-picture-card {
    background-color: transparent;
    border: none;
    text-align: center;
    margin: 0 auto;
    position: relative;
  }

  .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0px;
  }

  .ant-upload img {
    width: 120px;
    height: 120px;
    border: 3px solid #fff;
    text-align: center;
    border-radius: 99em;
    margin: 0 auto;
    background-size: cover;
    display: block;
  }

  .avatar-uploader-button {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 31.4px;
    width: 100%;
    font-size: 12px;
    font-weight: bold;
    color: #4a4a4a;
    opacity: 0.5;
    background-color: #ffffff;
  }

  .ant-upload-select:hover .avatar-uploader-button {
    display: block;
  }
`;

const StyleDefaultAvatar = styled(Avatar)`
  width: 110px !important;
  height: 110px !important;
  border-radius: 50% !important;

  i {
    position: relative;
    top: 35%;
    font-size: 32px;
  }
`;

const FormErrorBlock = styled.div`
  color: #f5222d !important;
  margin-top: 1px !important;
`;

@Form.create()
class NewCardModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      color: {
        code: null,
        error: null,
      },
      img: {
        file: null,
        base64Url: null,
      },
    };
  }

  isValidColorCode = () => {
    const {
      color: { code },
    } = this.state;
    let error = null;

    if (!code) {
      error = '請選擇顏色';
    }

    this.setState({ color: { code, error } });

    return error === null;
  };

  handleOk = () => {
    const { color, img } = this.state;
    const { onOk, form } = this.props;

    form.validateFields((err, values) => {
      const validColorCode = this.isValidColorCode();

      if (err || !validColorCode) {
        return;
      }

      const data = { ...values, colorCode: color.code };

      if (img.file) {
        data.body = new FormData();
        data.body.append('img', img.file);
      }

      this.handleCancel();
      onOk(data);
    });
  };

  handleCancel = () => {
    this.setState({
      color: {
        code: null,
        error: null,
      },
      img: {
        file: null,
        base64Url: null,
      },
    });
    this.props.form.setFields({
      major: { value: null, errors: null },
      minor: { value: null, errors: null },
      cardName: { value: null, errors: null },
      uuid: { value: null, errors: null },
    });
    this.props.onCancel();
  };

  handleUploadAvatar = ({ file }) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      this.setState((prevState) => ({
        ...prevState,
        img: {
          ...prevState.img,
          // save raw file
          file,
          // read as base64 string for reviewing before upload.
          base64Url: fileReader.result,
        },
      }));
    });
    fileReader.readAsDataURL(file);
  };

  onClickColorPick = (code) => () => {
    this.setState({
      color: {
        code,
        error: null,
      },
    });
  };

  renderColorPicks = () => {
    const colors = ['#f5b243', '#83bf6f', '#ff7e7e', '#a774d3', '#126ab4'];
    const { color } = this.state;
    return (
      <StyleColorPick>
        {colors.map((c, idx) => {
          const focus = color.code === c ? 'focus' : null;
          return (
            <div
              key={idx}
              className={focus}
              style={{ backgroundColor: c }}
              onClick={this.onClickColorPick(c)}
            />
          );
        })}
      </StyleColorPick>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
    } = this.props;

    const {
      img: { base64Url },
      color: { error },
    } = this.state;

    return (
      <StyleWrapper>
        <StyledModal
          title={<span style={modalTitle}>新增裝置</span>}
          visible={visible}
          footer={null}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="50%">
          <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <StyleAvatarColor>
                <StyleAvatar
                  name="avatar"
                  accept="image/*"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  multiple={false}
                  beforeUpload={beforeUpload}
                  customRequest={this.handleUploadAvatar}>
                  {base64Url && <img src={base64Url} alt="avatar" />}
                  {!base64Url && <StyleDefaultAvatar shape="circle" icon="user" />}
                  <div className="avatar-uploader-button">
                    <Icon type="camera-o" />
                    <span className="ant-upload-text">上傳照片</span>
                  </div>
                </StyleAvatar>
              </StyleAvatarColor>
            </Col>
            <Col span={16}>
              <Form>
                <FormItem colon={false} {...formItemLayout} label="ID">
                  {getFieldDecorator('uuid', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '請輸入ID' }],
                  })(<Input type="text" placeholder="請輸入ID" />)}
                </FormItem>
                <Row>
                  <Col span={11} offset={2}>
                    <FormItem
                      colon={false}
                      labelCol={{ span: 9 }}
                      wrapperCol={{ span: 15 }}
                      label="Major">
                      {getFieldDecorator('major', {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{ required: true, message: '此欄位必填' }],
                      })(<Input type="text" />)}
                    </FormItem>
                  </Col>
                  <Col span={11}>
                    <FormItem
                      colon={false}
                      labelCol={{ span: 7 }}
                      wrapperCol={{ span: 17 }}
                      label="Minor">
                      {getFieldDecorator('minor', {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{ required: true, message: '此欄位必填' }],
                      })(<Input type="text" />)}
                    </FormItem>
                  </Col>
                </Row>
                <FormItem colon={false} {...formItemLayout} label="名稱">
                  {getFieldDecorator('cardName', {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '請輸入ID名稱',
                      },
                    ],
                  })(<Input placeholder="請輸入ID名稱" />)}
                </FormItem>
                <FormItem colon={false} {...formItemLayout} label="標籤顏色">
                  {this.renderColorPicks()}
                  {error && <FormErrorBlock className="ant-form-explain">{error}</FormErrorBlock>}
                </FormItem>
              </Form>
            </Col>
          </Row>
          <div style={footer}>
            <StyleButton style={{ fontSize: 14 }} key="save" text="新增" onClick={this.handleOk} />
          </div>
        </StyledModal>
      </StyleWrapper>
    );
  }
}

export default NewCardModal;
