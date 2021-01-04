import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, List, Avatar, Tabs, Input } from 'antd';
import styled from 'styled-components';
import { isNil } from 'ramda';
import StyleButton from 'components/Button';
import TooltipButton from 'components/TooltipButton';
import {
  listCards,
  addCard,
  updateCard,
  addCards,
  getCardDetail,
  deleteCard,
  addCardInvite,
  deleteCardInvite,
  clearCardDetail,
} from 'reducers/cards';
import { listEnabledGuardAreas } from 'reducers/guardAreas';
import Image from 'components/Image';
import { DEVICE_TYPE } from 'constants/device';
import { ACTIVITY_MAP, CARD_LIST } from 'constants/routes';
import { withI18next } from 'locales/withI18next';

import NewCardModal from './NewCardModal';
import BatchCardModal from './BatchCardModal';
import EditCardModal from '../EditCardModal';
import CardGroupList from './CardGroupList';
import { HeartRateModal } from 'components/device';

import Cookies from 'js-cookie';
import fake from 'fake/func';
import { arrayToObject } from 'utils/webHelper';

import { backendURL } from 'constants/endpoint';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

const H2 = styled.h2`
  margin: 24px 0px;

  small {
    color: ${(p) => p.theme.greyishbrown};
    margin-left: 10px;
    font-size: 14px;
  }
`;

const StyleTabCtnr = styled.div`
  font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;

  .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    background-color: #fff;
    font-weight: normal;
    color: #5a5a5a;
    padding: 0px 32px;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    margin-right: 0px;
    border-radius: 4px 0px 0px 4px;
  }

  .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active,
  .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab:hover {
    background-color: #79abe5;
    color: #fff;
  }

  .ant-tabs-bar {
    border: none;
  }

  .mr9 {
    margin-right: 9px;
  }

  .mb5 {
    margin-bottom: 5px;
  }

  .text-perrywinkle {
    color: ${(p) => p.theme.perrywinkle};
    font-weight: bold;
  }

  .ant-tabs-nav .ant-tabs-tab:last-child {
    margin-left: 0px !important;
    border-radius: 0px 4px 4px 0px !important;
  }
`;

const StyleTab = styled(Tabs)`
  font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
  font-size: 16px;
  color: #5a5a5a;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;

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

  .ant-tabs-bar {
    margin-bottom: 40px;
  }

  .ant-input-search-button.ant-btn-primary {
    margin-right: 0px;
    background-color: #79abe5;
    color: #fff;
    border-color: transparent;
    height: 32px;
  }

  .ant-breadcrumb-link {
    font-size: 14px;
    line-height: 1.5;
    color: #1e3954;
  }

  .ant-list {
    margin-top: 30px;
  }

  .ant-list-split .ant-list-item:first-child {
    border-top: 1px solid #e8e8e8;
  }

  .ant-list-split .ant-list-item:last-child {
    border-bottom: 1px solid #e8e8e8;
  }

  .ant-list-split .ant-list-item {
    border: 1px solid #e8e8e8;
    border-top: none;
    padding: 3px 2%;
    height: 54px;
  }

  .style-grouplist .ant-list-split .ant-list-item {
    height: 46px;
    font-weight: bold;
    color: #4a4a4a;
  }

  .ant-list-pagination {
    margin: 69px 24px;
  }

  .ant-list-item-meta-description {
    font-size: 12px;
    color: #79abe5;
    line-height: 1.5;
  }

  .ant-list-item-meta-title {
    font-size: 16px;
    font-weight: bold;
    color: #5a5a5a;
    margin: 0px;
    padding-top: 7px;
  }

  .ant-list-item-meta-avatar {
    padding: 7px 17px 7px 0px;
    margin-right: 0px;
  }

  .ant-list-item-action-split {
    display: none;
  }
  .ant-list-item-action {
    margin-bottom: 0px;
  }
`;

@connect(
  (state) => ({
    cards: state.cards,
    allGuardAreas: state.guardAreas.content,
  }),
  {
    listCards,
    addCard,
    addCards,
    updateCard,
    deleteCard,
    addCardInvite,
    deleteCardInvite,
    listEnabledGuardAreas,
    clearCardDetail,
    getCardDetail,
  },
)
class CardList extends React.Component {
  constructor(props) {
    super(props);

    const { params } = props.match;
    const isEditing = !isNil(params.id);

    if (isEditing) {
      props.clearCardDetail();
      props.getCardDetail(params.id);
    }

    this.state = {
      newModalVisible: false,
      batchModalVisible: false,
      heartRateModalVisible: false,
      editModelVisible: isEditing,
      device: undefined,
      currentPage: 0,
      search: null,
    };
  }

  loadCards = () => {
    const { search, currentPage } = this.state;
    this.props.listCards({ search, page: currentPage });
  };

  componentDidMount = () => {
    this.loadCards();
    this.props.listEnabledGuardAreas();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { params } = this.props.match;
    const isEditing = !isNil(params.id);

    if (!this.state.editModelVisible && isEditing) {
      this.getCardDetail(params.id);
      this.setState({ editModelVisible: true });
    }

    if (
      prevProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname === CARD_LIST
    ) {
      this.setState({ device: undefined, editModelVisible: false });
    }
  };

  handleSearch = (search) => {
    this.setState({ search, currentPage: 0 }, this.loadCards);
  };

  //Tab onChange
  changeTab = (key) => {
    if (key === 1) {
      this.handleEditModelVisible();
    }
  };

  handleNewModalVisible = () => {
    this.setState({
      newModalVisible: !this.state.newModalVisible,
    });
  };

  handleBatchModalVisible = () => {
    this.setState({
      batchModalVisible: !this.state.batchModalVisible,
    });
  };

  handleHeartRateModalVisible = (val) => {
    this.setState({
      device: val,
      heartRateModalVisible: !this.state.heartRateModalVisible,
    });
  };

  handleOpenEditModel = (val) => {
    this.getCardDetail(val.id);
    this.setState({ device: val, editModelVisible: true });

    const { history } = this.props;
    history.push(`${CARD_LIST}/${val.id}`);
  };

  getCardDetail = (id) => {
    this.props.clearCardDetail();
    this.props.getCardDetail(id);
  };

  handleCloseEditModal = () => {
    const { history } = this.props;
    this.setState({ editModelVisible: false }, () => history.push(`${CARD_LIST}`));
  };

  handleAddCard = (values) => {
    this.props.addCard(values);
  };

  handleAddCards = (values) => {
    this.props.addCards(values);
  };

  handleUpdateCard = (values) => {
    this.props.updateCard(values);
  };

  handleDeleteCard = (id) => {
    this.props.deleteCard({
      id,
      onCompleted: () => {
        this.handleCloseEditModal();
      },
    });
  };

  handleAddSubManager = (values) => {
    this.props.addCardInvite(values);
  };

  handleDeleteSubManager = (values) => {
    this.props.deleteCardInvite(values);
  };

  handlePagination = (page) => {
    this.setState({ currentPage: page - 1 }, this.loadCards);
  };

  handleViewCardLoaction = (card) => {
    window.location.href = `${ACTIVITY_MAP}?card_id=${card.id}`;
  };

  handleClick = () => {
    console.log('[handleClick]', Cookies.get('_dplus-dashboard_Token'));
    if (Cookies.get('_dplusToken') && Cookies.get('_dplus-dashboard_Token')) {
      window.open(`${backendURL}/card-management/card-list/index`, '_blank');

      return;
    }

    Cookies.set('_dplusUserId', Cookies.get('_dplusUserId'));
    Cookies.set('_dplus-dashboard_UserId', 'admin');
    Cookies.set('_dplus-dashboard_Token', Cookies.get('_dplusToken'));
    Cookies.set('_dplus-dashboard_Permissions', arrayToObject(fake.managerFunctions, 'function'));

    window.open(`${backendURL}/card-management/card-list/index`, '_blank');
  };

  render() {
    const { cards, allGuardAreas, history, t } = this.props;
    const {
      device,
      search,
      newModalVisible,
      batchModalVisible,
      editModelVisible,
      heartRateModalVisible,
    } = this.state;

    const pagination = {
      current: cards.page + 1,
      total: cards.total,
      pageSize: cards.size,
      onChange: this.handlePagination,
    };
    console.log('histp', this.props);

    return (
      <React.Fragment>
        <H2>
          {t('main monitor list')}
          {/* <small>列出您為主管理者之裝置名單，可在此編輯群組及裝置資訊</small> */}
        </H2>
        <StyleTabCtnr>
          <StyleTab onTabClick={this.changeTab} type="card">
            <TabPane tab={t('individual list')} key="1">
              <React.Fragment>
                <Row>
                  {!editModelVisible ? (
                    <Col>
                      <Row className="mb5">
                        <Col className="text-perrywinkle">
                          {t('main monitor list')} {cards.total} {t('persons')}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <Search
                            defaultValue={search}
                            placeholder={t('id or name')}
                            onSearch={this.handleSearch}
                          />
                        </Col>
                        <Col span={16} style={{ textAlign: 'right' }}>
                          <StyleButton
                            className="mr9"
                            text={t('add bracelet')}
                            onClick={this.handleNewModalVisible}
                          />
                          <StyleButton
                            type="darkblue"
                            text={t('batch bracelet')}
                            onClick={this.handleBatchModalVisible}
                          />
                        </Col>
                      </Row>
                      <List
                        loading={cards.isLoading}
                        dataSource={cards.content}
                        pagination={pagination}
                        renderItem={(item) => (
                          <List.Item
                            actions={[
                              item.deviceType === DEVICE_TYPE.GPSWatch ? (
                                <TooltipButton
                                  name="查看心率"
                                  type="folder"
                                  onClick={() => this.handleHeartRateModalVisible(item)}
                                />
                              ) : null,
                              <TooltipButton
                                name="編輯"
                                type="edit"
                                onClick={() => this.handleOpenEditModel(item)}
                              />,
                              <TooltipButton
                                name="查看動態"
                                type="environment-o"
                                onClick={() => this.handleViewCardLoaction(item)}
                              />,
                            ]}>
                            <List.Item.Meta
                              avatar={
                                item.avatar ? (
                                  <Image name={item.avatar} width="40" height="40" shape="circle" />
                                ) : (
                                  <Avatar
                                    shape="circle"
                                    icon="user"

                                    // style={{ cursor: 'pointer' }}
                                    // onClick={() => this.handleClick()}
                                  />
                                )
                              }
                              title={item.cardName}
                              description={item.uuid}
                            />
                          </List.Item>
                        )}
                      />
                    </Col>
                  ) : (
                    <Col>
                      <EditCardModal
                        card={cards.data}
                        pushState={history.push}
                        allGuardAreas={allGuardAreas}
                        isLoading={cards.isLoading}
                        isUpdating={cards.isUpdating}
                        isDeleting={cards.isDeleting}
                        onUpdateCard={this.handleUpdateCard}
                        onAddSubManager={this.handleAddSubManager}
                        onDeleteCard={this.handleDeleteCard}
                        onDeleteSubManager={this.handleDeleteSubManager}
                        onClose={this.handleCloseEditModal}
                      />
                    </Col>
                  )}
                </Row>
              </React.Fragment>
            </TabPane>
            <TabPane tab={t('group list')} key="2">
              <CardGroupList />
            </TabPane>
          </StyleTab>
        </StyleTabCtnr>
        {batchModalVisible && (
          <BatchCardModal onOk={this.handleAddCards} onCancel={this.handleBatchModalVisible} />
        )}
        {heartRateModalVisible && (
          <HeartRateModal device={device} onCancel={this.handleHeartRateModalVisible} t={t} />
        )}
        <NewCardModal
          visible={newModalVisible}
          onOk={this.handleAddCard}
          onCancel={this.handleNewModalVisible}
        />
      </React.Fragment>
    );
  }
}

export default withI18next(['all'])(CardList);
