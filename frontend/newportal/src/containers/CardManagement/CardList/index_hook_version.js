import React, { useEffect, useState } from 'react';
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

import NewCardModal from './NewCardModal';
import BatchCardModal from './BatchCardModal';
import EditCardModal from '../EditCardModal';
import CardGroupList from './CardGroupList';
import HeartRateModal from './HeartRateModal';
import useModalVisible from 'hooks/useModalVisible';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

const H2 = styled.h2`
  margin: 24px 0px;

  small {
    color: ${p => p.theme.greyishbrown};
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
    color: ${p => p.theme.perrywinkle};
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

const mapStateToProps = state => ({
  cards: state.cards,
  allGuardAreas: state.guardAreas.content,
});

const mapDispatchToProps = {
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
};

const CardList = props => {
  const [search, setSearch] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  const [newModalVisible, handleNewModalVisible] = useModalVisible();
  const [batchModalVisible, handleBatchModalVisible] = useModalVisible();

  const { params } = props.match;
  const isEditing = !isNil(params.id);

  // const { cards, allGuardAreas, history } = props;
  useEffect(() => {
    props.listCards({ search, page: currentPage });
    props.listEnabledGuardAreas();
  }, []);

  const handleSearch = values => {
    setSearch(values);
    setCurrentPage(0);
    props.listCards({ values, page: 0 });
  };

  //Tab onChange
  const changeTab = key => {
    if (key === 1) {
      handleEditModelVisible();
    }
  };

  const handleOpenEditModel = editingCard => () => {
    this.getCardDetail(editingCard.id);
    this.setState({ editingCard, editModelVisible: true });

    const { history } = this.props;
    history.push(`${CARD_LIST}/${editingCard.id}`);
  };

  const getCardDetail = id => {
    this.props.clearCardDetail();
    this.props.getCardDetail(id);
  };

  const handleCloseEditModal = () => {
    const { history } = this.props;
    this.setState({ editModelVisible: false }, () => history.push(`${CARD_LIST}`));
  };

  const handleAddCard = values => {
    this.props.addCard(values);
  };

  const handleAddCards = values => {
    this.props.addCards(values);
  };

  const handleUpdateCard = values => {
    this.props.updateCard(values);
  };

  const handleDeleteCard = id => {
    this.props.deleteCard({
      id,
      onCompleted: () => {
        this.handleCloseEditModal();
      },
    });
  };

  const handleAddSubManager = values => {
    this.props.addCardInvite(values);
  };

  const handleDeleteSubManager = values => {
    this.props.deleteCardInvite(values);
  };

  const handlePagination = page => {
    this.setState({ currentPage: page - 1 }, this.loadCards);
  };

  const handleViewCardLoaction = card => () => {
    window.location.href = `${ACTIVITY_MAP}?card_id=${card.id}`;
  };

  return (
    <React.Fragment>
      <H2>
        主管理名單
        <small>列出您為主管理者之裝置名單，可在此編輯群組及裝置資訊</small>
      </H2>
      <StyleTabCtnr></StyleTabCtnr>
      <NewCardModal
        visible={newModalVisible}
        onOk={handleAddCard}
        onCancel={handleNewModalVisible}
      />
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CardList);
