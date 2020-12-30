import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Modal, List, Input, Row, Col, Avatar, Button, Form } from 'antd';
import Image from 'components/Image';
import StyleButton from '../../../components/Button';
import { withI18next } from 'locales/withI18next'

const confirm = Modal.confirm;
const Search = Input.Search;

const H4 = styled.h4`
  font-weight: bold;
`;

const StyleContent = styled.div`
  font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
  font-size: 14px;
  color: #4a4a4a;
  h2 {
    color: #79abe5;
    font-size: 16px;
    font-weight: bold;
  }
  h3 {
    font-weight: bold;
  }

  .mb90 {
    margin-bottom: 90px;
  }

  .ant-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  .ant-avatar > * {
    line-height: 40px;
  }

  .anticon.anticon-spin.anticon-loading {
    color: #fff !important;
  }
`;

const StyleSubCtrlList = styled(List)`
  margin-bottopm: 139px;
  .ant-spin-container {
    max-height: 230px;
    overflow-y: auto;
  }
  .ant-row {
    width: 100%;
  }

  .ant-list-item-content .ant-row {
    div:nth-child(2) {
      color: ${p => p.theme.perrywinkle};
      font-size: 13px;
      font-weight: 500;
    }
  }

  .ant-list-item-action > li > a {
    color: ${p => p.theme.darkbluegrey};
    text-decoration: underline;
  }
`;

const StyleSendEmail = styled(Search)`
  .ant-btn-primary {
    margin-right: 0px;
    background-color: #79abe5;
    color: #fff;
    border: 1px solid #79abe5;
    height: 32px;
  }

  .ant-btn-primary:hover {
    background-color: #6d98ca;
    color: #fff;
    border: 1px solid #6d98ca;
  }
`;

const Card = styled.div`
  margin-bottom: 19px;

  div:nth-child(1) {
    float: left;
    margin-right: 17px;
  }

  div:nth-child(2) {
    font-size: 16px;
    font-weight: bold;
  }

  div:nth-child(3) {
    font-size: 12px;
    color: ${p => p.theme.perrywinkle};
  }
`;

const styles = {
  modalBody: {
    paddingTop: '19px'
  }
};

@Form.create()
class EditCardAuthModal extends PureComponent {
  handleClose = () => {
    this.props.onClose();
  };

  handleAdd = memberId => {
    if (!memberId) {
      return;
    }

    const { card, form, addCardAuth } = this.props;
    const errors = form.getFieldError('memberId');
    const hasErrors = Array.isArray(errors) && errors.length > 0;

    if (hasErrors) {
      return;
    }

    addCardAuth({
      id: card.id,
      uuid: card.uuid,
      memberId,
      major: card.major,
      minor: card.minor
    });

    form.resetFields();
  };

  handleDelete = memberInfo => () => {
    const { deleteCardAuth, card } = this.props;
    confirm({
      title: '確認要刪除此副管理者帳號?',
      onOk() {
        deleteCardAuth({
          id: card.id,
          uuid: card.uuid,
          memberId: memberInfo.memberId,
          major: card.major,
          minor: card.minor
        });
      }
    });
  };

  render() {
    const {
      card,
      onClose,
      isUpdating,
      isLoading,
      isDeleting,
      form: { getFieldDecorator },
      t,
    } = this.props;
    const footer = [
      <StyleButton
        type="lightblue"
        key="save"
        text={t('confirm')}
        onClick={this.handleClose}
      />
    ];

    return (
      <Modal
        visible={true}
        width="55%"
        title={t('edit authorization list')}
        footer={footer}
        onCancel={onClose}
        bodyStyle={styles.modalBody}>
        <StyleContent>
          <Card>
            <div>
              {card.avatar ? (
                <Image
                  name={card.avatar}
                  width="40"
                  height="40"
                  shape="circle"
                />
              ) : (
                <Avatar shape="circle" icon="user" />
              )}
            </div>
            <div>{card.cardName}</div>
            <div>{card.uuid}</div>
          </Card>
          <H4>{t('assisted monitor list')}</H4>
          <StyleSubCtrlList
            style={{
              margin: '6px 0px 29px 0px'
            }}
            bordered
            loading={isLoading || isDeleting}
            dataSource={card.cardAuthorities}
            renderItem={sub => (
              <List.Item
                actions={[
                  <a onClick={this.handleDelete(sub.memberInfo)}>
                    {sub.status === 0 ? '取消' : '刪除'}
                  </a>
                ]}>
                <Row>
                  <Col span={18}>{sub.memberInfo.memberId}</Col>
                  <Col span={6}>{sub.status === 0 ? '已發送授權' : null}</Col>
                </Row>
              </List.Item>
            )}
          />
          <H4>{t('add assisted monitor list')}</H4>
          <Form className="mb90">
            <Form.Item>
              {getFieldDecorator('memberId', {
                rules: [{ type: 'email', message: 'E-mail格式不合' }]
              })(
                <StyleSendEmail
                  placeholder={t('please type email of assisted monitor')}
                  enterButton={
                    <Button
                      type="primary"
                      loading={isUpdating}
                      onClick={this.handleAdd}>
                      {t('send')}
                    </Button>
                  }
                  onSearch={this.handleAdd}
                />
              )}
            </Form.Item>
          </Form>
        </StyleContent>
      </Modal>
    );
  }
}

export default withI18next(['all'])(EditCardAuthModal);
