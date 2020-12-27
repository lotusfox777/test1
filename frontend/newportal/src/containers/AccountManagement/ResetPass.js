import * as React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Row } from 'antd';
import StyleButton from 'components/Button';
import { changePassword } from 'reducers/users';
import { StyleResetPass } from './components';

const FormItem = Form.Item;

@Form.create()
@connect(
  state => ({
    isLoading: state.users.isLoading
  }),
  {
    changePassword
  }
)
class ResetPass extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { onClose } = this.props;
      const { confirm, ...rest } = values;

      this.props.changePassword({
        ...rest,
        executeOnSuccess: onClose
      });
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
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('密碼不一致, 請再確認!');
    } else {
      callback();
    }
  };

  render() {
    const {
      onClose,
      isLoading,
      form: { getFieldDecorator }
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 }
      }
    };

    return (
      <StyleResetPass>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <FormItem {...formItemLayout} label="舊密碼" colon={false}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '請輸入舊密碼'
                }
              ]
            })(<Input type="password" placeholder="請輸入舊密碼" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密碼" colon={false}>
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '密碼長度為5~20字元',
                  pattern: new RegExp(/^.{5,20}$/)
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(<Input type="password" placeholder="請輸入新密碼" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="再次輸入" colon={false}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '請再次輸入新密碼'
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(
              <Input
                type="password"
                placeholder="請再次輸入新密碼"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>
          <Row className="footer" style={{ marginTop: 83 }}>
            <StyleButton type="white" text="取消" onClick={onClose} />
            <StyleButton
              text="確認"
              loading={isLoading}
              onClick={this.handleSubmit}
            />
          </Row>
        </Form>
      </StyleResetPass>
    );
  }
}

export default ResetPass;
