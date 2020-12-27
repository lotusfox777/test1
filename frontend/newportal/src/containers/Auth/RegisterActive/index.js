import { Col, Form, Modal, Row, Upload } from 'antd';
import Input from 'antd/lib/input/Input';
import { setHeader } from 'apis';
import StyleButton from 'components/Button';
import { API_ROOT } from 'constants/endpoint';
import Cookies from 'js-cookie';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerEmailConfirm } from 'reducers/register';

import { AvatarSize, StyleAvatarWrap, StyledModal } from '../components';

const FormItem = Form.Item;

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
      user: '',
      token: this.props.match.params.subPath,
    };
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleSubmit = e => {
    const {
      form: { validateFields },
      reg,
    } = this.props;
    const { token, imageUrl } = this.state;

    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append('img', imageUrl);
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
  handleChange = info => {
    this.getBase64(info.file.originFileObj, readerresult =>
      this.setState({
        imageUrl: readerresult,
        loading: false,
      }),
    );
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

    const imageUrl = this.state.imageUrl;
    const title = '歡迎回來, ' + reg.username;
    return (
      <StyledModal>
        <div className="title_01 mb_34">
          {title}
          <div className="title_02">請設定您的基本資料</div>
        </div>
        <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
          <Row>
            <Col span={10} style={{ textAlign: 'center' }}>
              <StyleAvatarWrap>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={this.handleChange}>
                  <div id="upload_btn">
                    <img style={AvatarSize} src={imageUrl} alt="avatar" />
                    <div id="icon-camera">
                      <img src="/img/icon-camera.png" alt="上傳照片" />
                    </div>
                  </div>
                </Upload>
              </StyleAvatarWrap>
            </Col>
            <Col span={14}>
              <FormItem label="密碼" colon={false} className="mb_50">
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
                })(
                  <Input
                    type="password"
                    placeholder="請輸入至少5~20個字元,不含標點符號"
                  />,
                )}
              </FormItem>
              <FormItem label="再次輸入密碼" colon={false} className="mb_90">
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '請再次輸入您的密碼',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(
                  <Input
                    type="password"
                    placeholder="請再次輸入您的密碼"
                    onBlur={this.handleConfirmBlur}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row className="mb_50">
            <StyleButton
              className="btn_type_h40"
              type="darkblue"
              text="確認"
              htmlType="submit"
            />
          </Row>
        </Form>
      </StyledModal>
    );
  }
}
