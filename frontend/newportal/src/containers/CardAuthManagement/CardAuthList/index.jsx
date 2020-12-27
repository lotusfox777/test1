import * as React from 'react';
import { connect } from 'react-redux';
import { Input, List, Row, Col, Avatar } from 'antd';
import EditCardAuthModal from './EditCardAuthModal';
import styled from 'styled-components';
import Image from 'components/Image';
import TooltipButton from 'components/TooltipButton';
import { listCardAuth, getCardDetail, addCardAuth, deleteCardAuth } from 'reducers/cards';

const Search = Input.Search;

const H2 = styled.h2`
  margin: 24px 0px;

  small {
    color: ${(p) => p.theme.greyishbrown};
    margin-left: 10px;
    font-size: 14px;
  }
`;

const StyleDescWrap = styled(Row)`
  font-family: MicrosoftJhengHei;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #79abe5;
  margin: 40px 0px 5px 0px;
`;

const StyleListContent = styled(Row)`
  margin: 40px 0px 5px 0px;
  font-family: Arial;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #5a5a5a;

  .card-num {
    div:nth-child(1) {
      display: inline-block;
      float: left;
      margin-right: 17px;
    }

    div:nth-child(2) {
      color: #5a5a5a;
      font-size: 16px;
      font-weight: bold;
    }

    div:nth-child(3) {
      line-height: normal;
      font-size: 12px;
      color: ${(p) => p.theme.perrywinkle};
    }
  }

  .list-title {
    font-family: MicrosoftJhengHei;
    font-weight: bold;
    line-height: 1.5;
    color: #4a4a4a;
    padding: 2% 2%;
    padding-bottom: 3px;
  }

  .card-count {
    text-align: right;
    color: #79abe5;
  }

  .ant-list-item-action {
    margin-left: 0px;
    margin-bottom: 0px;
  }

  .ant-row {
    width: 100%;
  }

  .anticon {
    font-size: 23px;
  }

  .ant-list-item-action-split {
    display: none;
  }

  .ant-list-split .ant-list-item:first-child {
    border-top: 1px solid #e8e8e8;
  }

  .ant-list-split .ant-list-item:first-child:hover {
    border-top: 1px solid #d9d9d9;
  }

  .ant-list-split .ant-list-item {
    border: 1px solid #e8e8e8;
    border-top: none;
    padding: 3px 22px;
    height: 54px;
  }

  .ant-list-split .ant-list-item:hover {
    background-color: #f0f5fa;
    border: 1px solid #d9d9d9;
    border-top: none;
  }

  .ant-list-pagination {
    margin: 92px 0px 34px 0px;
  }

  .ant-pagination-item-active {
    background-color: #79abe5;
    border: transparent;
  }

  .ant-pagination-item-active a,
  .ant-pagination-item-active:focus a,
  .ant-pagination-item-active:hover a {
    color: #fff;
  }

  .text-vertical--center {
    display: flex;
    align-items: center;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  border-radius: 20px;

  > * {
    line-height: 40px;
    font-size: 18px !important;
    color: #fff !important;
  }
`;

@connect((state) => ({ cards: state.cards }), {
  listCardAuth,
  getCardDetail,
  addCardAuth,
  deleteCardAuth,
})
class CardAuthorityList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editModalVisible: false,
      editingCard: undefined,
      search: null,
    };
  }

  componentDidMount = () => {
    this.props.listCardAuth();
  };

  handleSearch = (search) => {
    this.setState({ search });
    this.props.listCardAuth({ search, page: 0 });
  };

  handleOpenEditModal = (editingCard) => () => {
    this.props.getCardDetail(editingCard.id);
    this.setState({ editModalVisible: true });
  };

  handleCloseEditModal = () => {
    this.setState({ editModalVisible: false });
  };

  handlePagination = (page) => {
    this.props.listCardAuth({
      search: this.state.search,
      page: page - 1,
    });
  };

  render() {
    const { cards, addCardAuth, deleteCardAuth } = this.props;
    const { editModalVisible } = this.state;

    const pagination = {
      current: cards.page + 1,
      pageSize: 10,
      total: 10 * cards.totalPages,
      onChange: this.handlePagination,
    };

    const editModalProps = {
      card: cards.data,
      isLoading: cards.isLoading,
      isUpdating: cards.isUpdating,
      isDeleting: cards.isDeleting,
      onClose: this.handleCloseEditModal,
      deleteCardAuth,
      addCardAuth,
    };

    return (
      <React.Fragment>
        <H2>
          授權管理
          <small>列出您所有主管理名單授權為副管理者的帳號</small>
        </H2>
        <StyleDescWrap>
          <Col span={4}>授權名單 {cards.totalAuthCount} 人</Col>
        </StyleDescWrap>
        <Row>
          <Col span={8}>
            <Search placeholder="搜尋ID或名稱" onSearch={this.handleSearch} />
          </Col>
        </Row>
        <StyleListContent>
          <Col>
            <Row className="list-title">
              <Col span={14}>裝置資訊</Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                副管理者人數
              </Col>
            </Row>
            <List
              loading={cards.isLoading}
              itemLayout="horizontal"
              dataSource={cards.content}
              pagination={pagination}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <TooltipButton
                      name="編輯"
                      type="edit"
                      onClick={this.handleOpenEditModal(item)}
                    />,
                  ]}>
                  <Row className="text-vertical--center">
                    <Col span={14} className="card-num">
                      <div>
                        {item.avatar ? (
                          <Image name={item.avatar} width="40" height="40" shape="circle" />
                        ) : (
                          <StyledAvatar shape="circle" icon="user" />
                        )}
                      </div>
                      <div>{item.cardName}</div>
                      <div>{item.uuid}</div>
                    </Col>
                    <Col span={6} className="card-count">
                      {item.authCount} 人
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Col>
        </StyleListContent>
        {editModalVisible && <EditCardAuthModal {...editModalProps} />}
      </React.Fragment>
    );
  }
}

export default CardAuthorityList;
