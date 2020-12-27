import * as React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import StyleButton from 'components/Button';
import { StyleVerifyPhone } from './components';
import Countdown from 'react-countdown-now';

const FormItem = Form.Item;

@Form.create()
class VerifyPhone extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCountdown: false
    };
  }

  handleOk = () => {
    const { verifyPhone, form, onClose } = this.props;
    verifyPhone({
      authToken: form.getFieldValue('code'),
      executeOnSuccess: onClose
    });
  };

  sendVerifyPhone = () => {
    const { getVerifyCode, form } = this.props;
    getVerifyCode({ mobileno: form.getFieldValue('mobile') });
    this.setState({ isCountdown: true });
  };

  handleCountDownCompelte = () => {
    this.setState({ isCountdown: false });
  };

  renderButton = () => {
    const { isSending, isSended } = this.props;
    const { isCountdown } = this.state;

    if (isCountdown) {
      return (
        <Countdown
          date={Date.now() + 1000 * 180}
          intervalDelay={1000}
          precision={3}
          onComplete={this.handleCountDownCompelte}
          renderer={props => (
            <Button disabled>
              驗證碼已發送
              {props.minutes}: {props.seconds}
            </Button>
          )}
        />
      );
    }
    if (isSended) {
      return (
        <StyleButton
          type="darkblue"
          loading={isSending}
          text="重新發送驗證碼"
          onClick={this.sendVerifyPhone}
        />
      );
    }
    return (
      <StyleButton
        type="darkblue"
        loading={isSending}
        text="發送驗證碼"
        onClick={this.sendVerifyPhone}
      />
    );
  };

  render() {
    const {
      onClose,
      hasPhone,
      form: { getFieldDecorator },
      isVerifying
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };

    return (
      <React.Fragment>
        <StyleVerifyPhone>
          <div className="styled-mbr">
            <h2>{hasPhone ? '新增手機號碼' : '修改手機號碼'}</h2>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label="手機號碼" colon={false}>
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        message: '格式需為09XXXXXXXX',
                        pattern: new RegExp(/^[09]{2}[0-9]{8}$/)
                      }
                    ]
                  })(<Input type="text" placeholder="請輸入您的手機" />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ textAlign: 'right', marginBottom: 27 }}>
              <Col span={24}>{this.renderButton()}</Col>
            </Row>
            <Row style={{ marginBottom: 183 }}>
              <Col>
                <FormItem {...formItemLayout} label="驗證碼" colon={false}>
                  {getFieldDecorator('code')(
                    <Input type="text" placeholder="請輸入手機驗證碼" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row className="footer">
            <StyleButton type="white" text="取消" onClick={onClose} />
            <StyleButton
              onClick={this.handleOk}
              text="確認"
              loading={isVerifying}
            />
          </Row>
        </StyleVerifyPhone>
      </React.Fragment>
    );
  }
}

export default VerifyPhone;
