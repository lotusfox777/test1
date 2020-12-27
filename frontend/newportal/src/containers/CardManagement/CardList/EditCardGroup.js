import * as React from 'react';
import styled from 'styled-components';
import { Row, Col, Input, Form, Select } from 'antd';
import { find, propEq } from 'ramda';
import StyleButton from 'components/Button';
import BasicModal from 'components/BasicModal';

const FormItem = styled(Form.Item)`
  .ant-form-item-required:before {
    display: none;
  }

  .ant-form-item-label {
    text-align: left;
  }
`;

const StyledRow = styled(Row)`
  padding-left: 14px;

  &.mb0 {
    margin-bottom: 0px;
  }

  .text-left {
    text-align: left;
  }
`;

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 18
  }
};

@Form.create()
class EditCardGroup extends React.PureComponent {
  // TODO 編輯
  handleSave = () => {
    const {
      form: { validateFields },
      cardgroup: { id },
      allCards,
      onSubmit
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      const cardGroup = { id, groupName: values.groupName };

      cardGroup.cardInfos = values.cardInfos.map(id => {
        const card = find(propEq('id', +id))(allCards);
        return {
          uuid: card.uuid,
          major: card.major,
          minor: card.minor
        };
      });

      onSubmit(cardGroup);
    });
  };

  render() {
    const {
      onClose,
      onDelete,
      allCards,
      cardgroup,
      form: { getFieldDecorator }
    } = this.props;
    return (
      <BasicModal title="編輯群組" onOk={this.handleSave} onCancel={onClose}>
        <Form>
          <StyledRow className="mb0">
            <FormItem {...formItemLayout} label="群組名稱">
              {getFieldDecorator('groupName', {
                rules: [{ required: true, message: '此欄位必填' }],
                initialValue: cardgroup ? cardgroup.groupName : null
              })(<Input placeholder="群組名稱" readOnly />)}
            </FormItem>
          </StyledRow>
          <StyledRow>
            <FormItem {...formItemLayout} label="名單">
              {getFieldDecorator('cardInfos', {
                rules: [{ required: true, message: '請至少選擇一個守護名單' }],
                initialValue: cardgroup
                  ? cardgroup.cardInfos.map(x => String(x.id))
                  : []
              })(
                <Select mode="multiple" placeholder="選取守護名單" allowClear>
                  {allCards.map(x => (
                    <Select.Option key={x.id} value={String(x.id)}>
                      {x.cardName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </StyledRow>
          <StyledRow className="footer">
            <Col span={4} className="text-left">
              <a onClick={onDelete} className="delete-btn">
                刪除群組
              </a>
            </Col>
            <Col span={20}>
              <StyleButton
                style={{ marginRight: '9px' }}
                type="white"
                key="cancel"
                text="取消"
                onClick={onClose}
              />
              <StyleButton key="save" text="確認" onClick={this.handleSave} />
            </Col>
          </StyledRow>
        </Form>
      </BasicModal>
    );
  }
}

export default EditCardGroup;
