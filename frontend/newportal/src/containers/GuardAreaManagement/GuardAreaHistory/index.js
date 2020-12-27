import * as React from 'react';
import { connect } from 'react-redux';
import { Avatar, Input, List, Row, Col } from 'antd';
import ViewHistory from './ViewHistory';
import styled from 'styled-components';
import Image from 'components/Image';
import TooltipButton from 'components/TooltipButton';
import {
  listCards,
  listAllCards,
  getCardDetail,
  listNotifyByCard,
  clearCardActivities,
} from 'reducers/cards';
import { thousandSeparators } from 'utils/webHelper';

const Search = Input.Search;

const StyleDescWrap = styled(Row)`
  font-weight: bold;
  line-height: 1.5;
  color: #79abe5;
  margin: 25px 0px 5px 0px;

  div > span {
    cursor: pointer;
  }
`;

const StyleListContent = styled(Row)`
  margin: 40px 0px 5px 0px;
  font-size: 12px;
  color: #5a5a5a;

  .card-name {
    font-size: 16px;
    font-weight: 600;
    padding-right: 9px;
  }
  .card-main {
    color: #9b9b9b;
    font-size: 14px;
    font-weight: normal;
  }
  .card-savearea {
    color: #79abe5;
    font-weight: bold;
    font-size: 12px;
  }
  .ant-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;

    > * {
      line-height: 40px;
      font-size: 18px !important;
      color: #fff !important;
    }
  }
  .ant-list-item-action {
    margin-left: 0px;
    margin-bottom: 0px;
  }

  .ant-list-item-meta {
    justify-content: center;
    align-items: center;
  }

  .ant-list-item-meta-description {
    font-size: 12px;
    color: #79abe5;
  }

  .ant-list-item-meta-title {
    font-size: 16px;
    font-weight: bold;
    width: max-content;
  }
  .ant-list-item-meta-avatar {
  }
  .ant-row {
    width: 100%;
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
    padding: 3px 2%;
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

  .ant-list__header {
    margin-left: 7px;
    font-weight: 600;
    border-bottom: none;
    margin-bottom: -7px;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  .left-12 {
    left: 12px;
  }
`;

const H2 = styled.h2`
  small {
    color: ${(p) => p.theme.greyishbrown};
    margin-left: 10px;
    font-size: 14px;
  }
`;

@connect(
  (state) => ({
    cards: state.cards,
  }),
  {
    getCardDetail,
    listCards,
    listAllCards,
    listNotifyByCard,
    clearCardActivities,
  },
)
class GuardAreaHistory extends React.PureComponent {
  state = {
    currentPage: 0,
    currentCard: null,
    search: null,
    visible: false,
    cardType: -1,
  };

  loadCards = () => {
    const { search, currentPage, cardType } = this.state;
    this.props.listCards({ search, type: cardType, page: currentPage });
  };

  componentDidMount = () => {
    this.props.listAllCards();
    this.loadCards();
  };

  handleChangeCardType = (cardType) => () => {
    this.setState({ cardType }, this.loadCards);
  };

  handlePagination = (page) => {
    this.setState({ currentPage: page - 1 }, this.loadCards);
  };

  handleSearch = (search) => {
    this.setState({ search, currentPage: 0 }, this.loadCards);
  };

  handleOpenModal = (item) => () => {
    this.setState({ visible: true, currentCard: item });
    this.props.clearCardActivities();
    this.props.listNotifyByCard({ id: item.id });
    this.props.getCardDetail(item.id);
  };

  handleCloseModal = () => {
    this.setState({ visible: false });
  };

  handleModalPagination = (page) => {
    const { listNotifyByCard } = this.props;
    const { currentCard } = this.state;

    listNotifyByCard({ page, id: currentCard.id });
  };

  render() {
    const { cards, history } = this.props;
    const { visible, currentCard } = this.state;

    const pagination = {
      current: cards.page + 1,
      total: cards.total,
      pageSize: cards.size,
      onChange: this.handlePagination,
    };

    return (
      <React.Fragment>
        <H2>
          守護紀錄
          <small>列出所有裝置離開守護區域之紀錄</small>
        </H2>
        <StyleDescWrap>
          <Col span={4}>
            <span onClick={this.handleChangeCardType(1)}>
              主管理名單 ({cards.primaryCardCount})
            </span>
          </Col>
          <Col>
            <span onClick={this.handleChangeCardType(2)}>
              副管理名單 ({cards.secondaryCardCount})
            </span>
          </Col>
        </StyleDescWrap>
        <Row>
          <Col span={8}>
            <Search placeholder="搜尋ID或名稱" onSearch={this.handleSearch} />
          </Col>
        </Row>
        <StyleListContent>
          <Col>
            <List
              header={
                <Row className="ant-list__header">
                  <Col span={4}>裝置 (主/副管理名單)</Col>
                  <Col span={14} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    守護區域數
                  </Col>
                  <Col span={2} offset={4}>
                    查看紀錄
                  </Col>
                </Row>
              }
              loading={cards.isLoading}
              dataSource={cards.content}
              pagination={pagination}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <TooltipButton
                      name="查看紀錄"
                      type="eye-o"
                      onClick={this.handleOpenModal(item)}
                    />,
                  ]}>
                  <Row>
                    <Col span={10}>
                      <List.Item.Meta
                        avatar={
                          item.avatar ? (
                            <Image name={item.avatar} width="40" height="40" shape="circle" />
                          ) : (
                            <Avatar shape="circle" icon="user" />
                          )
                        }
                        title={
                          <div>
                            {item.cardName && <span className="card-name">{item.cardName}</span>}
                            {item.type === 1 ? <span className="card-main">主管理名單</span> : null}
                          </div>
                        }
                        description={item.uuid}
                      />
                    </Col>
                    <Col
                      span={9}
                      style={{
                        height: '48px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                      <div className="card-savearea text-left">
                        守護區域 {thousandSeparators(item.guardareaCount || 0)}
                      </div>
                    </Col>
                  </Row>
                  {/* <div className="card-savearea text-left">
                    守護區域 {thousandSeparators(item.guardareaCount || 0)}
                  </div> */}
                  {/* <Row>
                    <Col
                      span={14}
                      style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div className="card-savearea text-left">
                        守護區域 {thousandSeparators(item.guardareaCount || 0)}
                      </div>
                    </Col>
                  </Row> */}
                </List.Item>
              )}
            />
          </Col>
        </StyleListContent>
        {visible && (
          <ViewHistory
            onCancel={this.handleCloseModal}
            loadMore={this.handleModalPagination}
            card={currentCard}
            pushState={history.push}
            guardAreas={cards.data.guardareaList}
            activitiesLog={cards.activitiesLog}
            isLoading={cards.isLoading}
          />
        )}
      </React.Fragment>
    );
  }
}

export default GuardAreaHistory;
