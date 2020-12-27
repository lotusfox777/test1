import { Button, Col, Form, Icon, Modal, Row, Upload } from 'antd';
import Input from 'antd/lib/input/Input';
import Cookies from 'js-cookie';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerEmailConfirm } from 'reducers/register';
import styled from 'styled-components';

import { setHeader } from '../../apis';
import { API_ROOT } from '../../constants/endpoint';

const FormItem = Form.Item;

const StyledModal = styled(Modal).attrs({
  bordered: false,
  visible: true,
  footer: false,
})`
  margin: 0 auto;

  .ant-card-head-title {
    font-size: 20px;
    text-align: center;
  }
`;

const mapStateToProps = state => ({
  reg: state.register,
  token: '',
});

const mapDispatchToProps = {
  registerEmailConfirm,
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@Form.create()
export default class RegisterActivePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      loading: false,
      imageUrl: '/img/avatar-pic.png',
      imageFile: undefined,
      user: '',
      token: this.props.match.params.subPath,
    };
  }

  getBase64 = img => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        imageUrl: reader.result,
      });
    });
    reader.readAsDataURL(img);
  };

  handleSubmit = e => {
    const {
      form: { validateFields },
      reg,
    } = this.props;
    const { token, imageFile } = this.state;

    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append('img', imageFile);
        formData.append('password', values.password);
        formData.append('token', token);

        xhr.open('POST', `${API_ROOT}/v1/registedSetupPassword`);

        // !!! WTF, have to remove content-type header or this header will missout 'boundary=...'
        // xhr.setRequstHeader('Content-Type', 'multipart/form-data');
        xhr.onload = () => {
          console.log(xhr.response);
          const response = JSON.parse(xhr.response);

          if (response.message === '此認証連結已失效') {
            Modal.error({
              title: '',
              content: '此認証連結已失效.',
            });
            return;
          }

          const responseData = response.data;

          Cookies.set('_dplusToken', responseData.authToken);
          Cookies.set('_dplusUserId', reg.userid);
          setHeader({
            Authorization: `Bearer ${token}`,
          });

          window.location = '/';
        };

        xhr.onerror = () => {
          console.log('[error]', xhr);
          Modal.error({
            title: '',
            content: '此認証連結已失效.',
          });
        };
        xhr.send(formData);
      }
    });
  };
  // 處理比較密碼
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密碼不一致, 請再確認!');
    } else {
      callback();
    }
  };

  //照片上傳
  beforeUpload = imageFile => {
    this.getBase64(imageFile);
    this.setState({
      imageFile,
    });
    return false;
  };

  componentDidMount = () => {
    const { registerEmailConfirm } = this.props;
    registerEmailConfirm({ token: this.state.token });
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const { reg } = this.props;
    if (prevProps.reg.isEmailConfirmDone !== reg.isEmailConfirmDone) {
      if (reg.isEmailConfirmDone && reg.errMsg !== '') {
        Modal.error({
          title: '',
          content: reg.errMsg,
        });
      }
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      reg,
    } = this.props;

    // 上傳照片
    const uploadButton = (
      <div className="avatar-uploader-button">
        <Icon type={this.state.loading ? 'loading' : 'camera-o'} />
        <span className="ant-upload-text">上傳照片</span>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const title = '歡迎回來, ' + reg.username;

    return (
      <StyledModal title={title} width="50%">
        <Row>
          <Col span={10} style={{ textAlign: 'center' }}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action=""
              beforeUpload={this.beforeUpload}>
              <img src={imageUrl} alt="avatar" width="190" />
              {uploadButton}
            </Upload>
          </Col>
          <Col span={8}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="密碼">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '密碼長度為5~20字元',
                      pattern: new RegExp(/^.{5,20}$/),
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input type="password" placeholder="請輸入您的密碼" />)}
              </FormItem>
              <FormItem label="再次輸入密碼">
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '請再次您的密碼',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
              </FormItem>
              <Row>
                <Col style={{ marginTop: 50 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button">
                    確認
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}
