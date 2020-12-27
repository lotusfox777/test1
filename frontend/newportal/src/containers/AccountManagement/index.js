import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  Modal,
  Form,
  Avatar,
  Divider,
  Input,
  Row,
  Col,
  Upload,
  Icon,
  message,
  Spin,
  Button,
} from 'antd';
import { isNil } from 'ramda';
import StyleButton from 'components/Button';
import Image from 'components/Image';
import {
  getCurrentUser,
  getLineBindingUrl,
  resetLineBindingUrl,
  bindingLine,
  unbindingLine,
  bindingMobile,
  verifyPhone,
  getVerifyCode,
  changeEmail,
  updateUser,
} from 'reducers/users';
import { StyleWrapper, StyledModal, StyleAvatarWrap } from './components';
import VerifyPhone from './VerifyPhone';
import ResetPass from './ResetPass';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const Search = styled(Input.Search)`
  input {
    font-size: 12px !important;
  }
`;

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('檔案太大, 請勿超過2MB!');
  }
  return isLt2M;
}

@Form.create()
@connect(
  state => ({
    verifyPhone: state.users.verifyPhone,
    lineOAuthParams: state.users.lineOAuthParams,
  }),
  {
    getCurrentUser,
    getLineBindingUrl,
    resetLineBindingUrl,
    getVerifyCode,
    bindingLine,
    bindingMobile,
    unbindingLine,
    verifyPhone,
    changeEmail,
    updateUser,
  },
)
class AccountInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editName: false,
      editEmail: false,
      editPass: false,
    };

    this.inputNameRef = React.createRef();
    this.inputEmailRef = React.createRef();

    this.enableMessageListener = false;
    this.closeChecker = null;
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.lineOAuthParams.url && !prevProps.lineOAuthParams.url) {
      const { url } = this.props.lineOAuthParams;
      const popup = window.open(
        url,
        '_blank',
        'width=500,height=700,menubar=no,directories=no,location=no,toolbar=no,titlebar=no,scrollbars=no,resizable=no',
      );

      this.addMessageListener();
      this.handleCloseWindow(popup);
    }
  };

  componentWillUnmount = () => {
    this.removeMessageListener();
  };

  handleCloseWindow = popup => {
    this.closeChecker = setInterval(() => {
      if (popup == null || popup.closed) {
        this.props.resetLineBindingUrl();
        clearInterval(this.closeChecker);
      }
    }, 500);
  };

  addMessageListener = () => {
    window.addEventListener('message', this.handleMessageListener);
    this.enableMessageListener = true;
  };

  removeMessageListener = () => {
    if (this.enableMessageListener) {
      window.removeEventListener('message', this.handleMessageListener);
      this.enableMessageListener = false;
    }
  };

  handleMessageListener = event => {
    if (event.data.lineOAuthSuccess) {
      this.props.getCurrentUser();
      this.removeMessageListener();
    }
  };

  handleUpdateName = name => {
    if (name.trim() === '') {
      return;
    }

    this.props.updateUser({ name });
    this.handleEditName();
  };

  handleVerifyEmail = () => {
    const { form } = this.props;
    form.validateFields(['email'], (err, values) => {
      if (err) {
        return;
      }
      this.props.changeEmail({
        body: {
          email: values.email,
        },
        executeOnSuccess: this.handleEditEmail,
      });
    });
  };

  handleUploadAvatar = ({ file }) => {
    const request = {};
    request.body = new FormData();
    request.body.append('img', file);

    this.props.updateUser(request);
  };

  handleBindingLine = () => {
    this.props.getLineBindingUrl({ oathToken: 'newportal' });
  };

  handleUnbindLine = () => {
    confirm({
      title: '確定解除Line綁定?',
      content: '一旦解除將無法接收即時守護通知',
      onOk: () => {
        this.props.unbindingLine();
      },
    });
  };

  //綁定手機
  handleEditPhone = () => {
    this.setState({
      editPhone: !this.state.editPhone,
    });
  };

  handleEditName = () => {
    this.setState(
      {
        editName: !this.state.editName,
      },
      () => {
        if (this.state.editName) {
          this.inputNameRef.current.focus();
        }
      },
    );
  };

  handleEditEmail = () => {
    this.setState(
      {
        editEmail: !this.state.editEmail,
      },
      () => {
        if (this.state.editEmail) {
          this.inputEmailRef.current.focus();
        }
      },
    );
  };

  handleKeyDown = editField => e => {
    if (e.keyCode === 27) {
      this.setState({ [editField]: false });
    }
  };

  //修改密碼
  handleEditPass = () => {
    this.setState({
      editPass: !this.state.editPass,
    });
  };

  handleCancel = e => {
    if (e.keyCode === 27) {
      return;
    }

    this.props.onClose();
  };

  render() {
    const { editName, editEmail, editPhone, editPass } = this.state;

    const {
      form: { getFieldDecorator },
      currentUser,
      isLoading,
      isUpdatingEmail,
      verifyPhone: { isSended, isSending, isVerifying },
      getVerifyCode,
      verifyPhone,
    } = this.props;

    return (
      <React.Fragment>
        <StyledModal
          title="帳戶管理"
          width="42%"
          style={{ minWidth: 399 }}
          onCancel={this.handleCancel}>
          {editPhone ? (
            <VerifyPhone
              isSended={isSended}
              isSending={isSending}
              isVerifying={isVerifying}
              verifyPhone={verifyPhone}
              hasPhone={!isNil(currentUser.mobileno)}
              getVerifyCode={getVerifyCode}
              onClose={this.handleEditPhone}
            />
          ) : (
            <Spin spinning={isLoading}>
              <StyleWrapper>
                <Row>
                  <Col
                    span={8}
                    offset={8}
                    style={{
                      marginBottom: 36,
                    }}>
                    <StyleAvatarWrap
                      style={{
                        marginTop: 20,
                        marginBottom: 17,
                      }}>
                      <Upload
                        name="avatar"
                        accept="image/*"
                        listType="picture-card"
                        showUploadList={false}
                        multiple={false}
                        beforeUpload={beforeUpload}
                        customRequest={this.handleUploadAvatar}>
                        <div id="upload_btn">
                          {currentUser.profileImg && (
                            <Image
                              ref={c => (this.userAvatar = c)}
                              width="110"
                              height="110"
                              name={currentUser.profileImg}
                              alt="avatar"
                            />
                          )}
                          {!currentUser.profileImg && (
                            <Avatar size={110} shape="circle" src="/img/avatar-pic.png" />
                          )}
                          <img
                            id="icon-camera"
                            src="/img/icon-camera.png"
                            srcSet="/img/icon-camera@2x.png 2x,/img/icon-camera@3x.png 3x"
                            alt="上傳照片"
                          />
                        </div>
                      </Upload>
                    </StyleAvatarWrap>
                  </Col>
                </Row>
                {editPass ? (
                  <ResetPass onClose={this.handleEditPass} />
                ) : (
                  <div>
                    <div className="styled-mbr">
                      <Row>
                        <Col span={4}> 名稱 </Col>
                        {editName ? (
                          <Col span={20}>
                            <Search
                              ref={this.inputNameRef}
                              defaultValue={currentUser.name}
                              enterButton="確認"
                              onKeyDown={this.handleKeyDown('editName')}
                              onSearch={this.handleUpdateName}
                            />
                          </Col>
                        ) : (
                          <div>
                            <Col span={14}> {currentUser.name} </Col>
                            <Col span={2}>
                              <Icon type="edit" onClick={this.handleEditName} />
                            </Col>
                          </div>
                        )}
                      </Row>
                      <Row>
                        <Col span={4}> email </Col>
                        {editEmail ? (
                          <Col span={20}>
                            <FormItem>
                              {getFieldDecorator('email', {
                                rules: [
                                  {
                                    type: 'email',
                                    message: 'E-mail格式不合',
                                  },
                                ],
                                initialValue: currentUser.email,
                              })(
                                <Search
                                  ref={this.inputEmailRef}
                                  enterButton={
                                    <Button
                                      type="primary"
                                      loading={isUpdatingEmail}
                                      style={{
                                        width: 103,
                                        textAlign: 'center',
                                      }}
                                      onClick={this.handleVerifyEmail}>
                                      發認證信
                                    </Button>
                                  }
                                  onKeyDown={this.handleKeyDown('editEmail')}
                                  onSearch={this.handleVerifyEmail}
                                />,
                              )}
                            </FormItem>
                          </Col>
                        ) : (
                          <div>
                            <Col span={14}> {currentUser.email} </Col>
                            <Col span={2}>
                              <Icon type="edit" onClick={this.handleEditEmail} />
                            </Col>
                          </div>
                        )}
                      </Row>
                      <Row>
                        {currentUser.mobileno ? (
                          <div>
                            <Col span={4}> 手機號碼 </Col>
                            <Col span={14}> {currentUser.mobileno} </Col>
                            <Col span={2}>
                              <Icon type="edit" onClick={() => this.handleEditPhone(false)} />
                            </Col>
                          </div>
                        ) : null}
                      </Row>
                      <Row>
                        {currentUser.ilineBindingStatus === -1 ? null : (
                          <div>
                            <Col span={4} className="mout-line">
                              Line 已綁定
                            </Col>
                            <Col span={6}>
                              <a onClick={this.handleUnbindLine} className="unmout-line">
                                解除綁定
                              </a>
                            </Col>
                          </div>
                        )}
                      </Row>
                      <Row>
                        {currentUser.mobileno ? null : (
                          <Col
                            style={{
                              marginBottom: 10,
                            }}>
                            <StyleButton text="新增手機號碼" onClick={this.handleEditPhone} />
                          </Col>
                        )}
                        {currentUser.ilineBindingStatus === -1 ? (
                          <Col>
                            <StyleButton text="綁定Line" onClick={this.handleBindingLine} />
                          </Col>
                        ) : null}
                        <Col
                          style={{
                            marginTop: 38,
                          }}>
                          <StyleButton
                            type="darkblue"
                            text="修改密碼"
                            onClick={this.handleEditPass}
                          />
                        </Col>
                      </Row>
                    </div>
                    <Row className="account_footer">
                      <Col span={12}>
                        <a>
                          主管理名單 {currentUser.masterCards.length}人
                          <Divider
                            style={{
                              float: 'right',
                            }}
                            type="vertical"
                          />
                        </a>
                      </Col>
                      <Col span={12}>
                        <a> 副管理名單 {currentUser.slaveCards.length}人 </a>
                      </Col>
                    </Row>
                  </div>
                )}
              </StyleWrapper>
            </Spin>
          )}
        </StyledModal>
      </React.Fragment>
    );
  }
}

export default AccountInfo;
