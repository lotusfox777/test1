import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, List, Input } from 'antd';
import styled from 'styled-components';
import { listCards } from 'reducers/cards';
import {
  listCardGroups,
  addCardGroup,
  updateCardGroup,
  deleteCardGroup,
  getCardGroup,
} from 'reducers/cardGroups';
import StyleButton from 'components/Button';
import TooltipButton from 'components/TooltipButton';
import EditCardGroup from './EditCardGroup';
import DeleteCardGroup from './DeleteCardGroup';
import AddCardGroup from './AddCardGroup';

const Search = Input.Search;

const Wrapper = styled.div`
  .text-right {
    text-align: right;
  }
`;

const H3 = styled.h3`
  color: #79abe5;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

@connect(
  (state) => ({
    cardGroups: state.cardGroups,
    allCards: state.cards.content,
    allGuardAreas: state.guardAreas.content,
  }),
  {
    listCards,
    listCardGroups,
    addCardGroup,
    updateCardGroup,
    getCardGroup,
    deleteCardGroup,
  },
)
class CardGroupList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newModalVisible: false,
      editModelVisible: false,
      deleteModelVisible: false,
      editingCardGroup: undefined,
      currentPage: 0,
      search: null,
    };
  }

  loadCardGroups = () => {
    const { currentPage, search } = this.state;
    this.props.listCardGroups({ page: currentPage, search });
  };

  componentDidMount = () => {
    this.props.listCards({ page: 0, size: 999 });
    this.loadCardGroups();
  };

  handleNewModalVisible = () => {
    this.setState({
      newModalVisible: !this.state.newModalVisible,
    });
  };

  handleDeleteModelVisible = () => {
    this.setState({
      deleteModelVisible: !this.state.deleteModelVisible,
      editModelVisible: false,
    });
  };

  handleOpenEditModel = (cardGroup) => () => {
    this.props.getCardGroup(cardGroup.id);
    this.setState({ editModelVisible: true });
  };

  handleCloseEditModal = () => {
    this.setState({ editModelVisible: false });
  };

  handleAdd = (values) => {
    this.props.addCardGroup(values);
    this.handleNewModalVisible();
  };

  handleUpdate = (values) => {
    this.props.updateCardGroup(values);
    this.handleCloseEditModal();
  };

  handleDelete = (id) => () => {
    this.props.deleteCardGroup(id);
    this.handleDeleteModelVisible();
  };

  handleSearch = (search) => {
    this.setState({ search, currentPage: 0 }, this.loadCardGroups);
  };

  handlePagination = (page) => {
    this.setState(
      {
        currentPage: page - 1,
      },
      () => this.loadCardGroups(),
    );
  };

  render() {
    const { allCards, cardGroups } = this.props;

    const { newModalVisible, editModelVisible, deleteModelVisible } = this.state;

    const pagination = {
      current: cardGroups.page + 1,
      pageSize: cardGroups.size,
      total: cardGroups.total,
      onChange: this.handlePagination,
    };

    return (
      <Wrapper>
        <Row>
          <Col span={12}>
            <H3>群組名單 ({cardGroups.total})</H3>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Search placeholder="搜尋群組名單" onSearch={this.handleSearch} />
          </Col>
          <Col span={16} className="text-right">
            <StyleButton text="新增群組" onClick={this.handleNewModalVisible} />
          </Col>
        </Row>
        <div className="style-grouplist">
          <List
            loading={cardGroups.isLoading}
            dataSource={cardGroups.content}
            pagination={pagination}
            renderItem={(group) => (
              <List.Item
                actions={[
                  <TooltipButton
                    name="編輯"
                    type="edit"
                    onClick={this.handleOpenEditModel(group)}
                  />,
                ]}>
                <span>
                  {group.groupName} ({group.memberCount})
                </span>
              </List.Item>
            )}
          />
        </div>
        {newModalVisible && (
          <AddCardGroup
            onClose={this.handleNewModalVisible}
            onSubmit={this.handleAdd}
            allCards={allCards}
          />
        )}
        {editModelVisible && (
          <EditCardGroup
            cardgroup={cardGroups.data}
            allCards={allCards}
            onClose={this.handleCloseEditModal}
            onDelete={this.handleDeleteModelVisible}
            onSubmit={this.handleUpdate}
          />
        )}
        {deleteModelVisible && (
          <DeleteCardGroup
            cardgroup={cardGroups.data}
            onClose={this.handleDeleteModelVisible}
            onDelete={this.handleDelete}
          />
        )}
      </Wrapper>
    );
  }
}

export default CardGroupList;
