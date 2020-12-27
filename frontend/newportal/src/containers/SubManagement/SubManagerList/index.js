import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Avatar, Input, List, Row, Col } from 'antd';
import styled from 'styled-components';
import Image from 'components/Image';
import TooltipButton from 'components/TooltipButton';
import { DEVICE_TYPE } from 'constants/device';
import { ACTIVITY_MAP } from 'constants/routes';
import { listCards, deleteCardInvite } from 'reducers/cards';
import { HeartRateModal } from 'components/device';

const Search = Input.Search;
const confirm = Modal.confirm;

const VICE_ADMIN = 2;

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
  font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #5a5a5a;

  .ant-list-item-action {
    margin-left: 0px;
  }

  .ant-row {
    width: 100%;
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
    padding: 3px 2%;
    height: 54px;
  }

  .ant-list-item-action {
    margin-left: 0px;
    margin-bottom: 0px;
  }
  .ant-list-item-meta-description {
    font-family: Arial;
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

  .ant-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  .ant-list-item-meta-avatar {
    padding: 7px 17px 7px 0px;
    margin-right: 0px;
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

@connect(
  (state) => ({
    cards: state.cards,
  }),
  {
    listCards,
    deleteCardInvite,
  },
)
class SubManagerList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      search: null,
      device: null,
      heartRateModalVisible: false,
    };
  }

  componentDidMount = () => {
    this.props.listCards({ type: VICE_ADMIN });
  };

  handleDelete = (item) => {
    const { deleteCardInvite } = this.props;
    confirm({
      title: `退出管理 ${item.uuid}`,
      onOk() {
        deleteCardInvite({
          id: item.id,
          major: item.major,
          minor: item.minor,
          uuid: item.uuid,
          memberId: item.memberId,
        });
      },
    });
  };

  handleViewCardLoaction = (card) => {
    const { history } = this.props;
    history.push(`${ACTIVITY_MAP}?card_id=${card.id}`);
  };

  handleHeartRateModalVisible = (val) => {
    this.setState({
      device: val,
      heartRateModalVisible: !this.state.heartRateModalVisible,
    });
  };

  handleSearch = (search) => {
    this.setState(
      {
        search,
      },
      () =>
        this.props.listCards({
          type: VICE_ADMIN,
          page: this.state.currentPage,
          search,
        }),
    );
  };

  handlePagination = (page) => {
    this.setState(
      {
        currentPage: page - 1,
      },
      () =>
        this.props.listCards({
          type: VICE_ADMIN,
          page: page - 1,
          search: this.state.search,
        }),
    );
  };

  render() {
    const { device, heartRateModalVisible } = this.state;
    const { cards } = this.props;

    const pagination = {
      current: cards.page + 1,
      pageSize: cards.size,
      total: cards.total,
      onChange: this.handlePagination,
    };

    const isLoading = cards.isLoading || cards.isDeleting;

    return (
      <React.Fragment>
        <H2>
          副管理名單
          <small>列出您被授權為副管理者之名單，副管理者僅可查看或接收裝置動態</small>
        </H2>
        <StyleDescWrap>
          <Col span={4}>副管理名單 {cards.total} 人</Col>
        </StyleDescWrap>
        <Row>
          <Col span={8}>
            <Search placeholder="搜尋ID或名稱" onSearch={this.handleSearch} />
          </Col>
        </Row>
        <StyleListContent>
          {
            <Col>
              <List
                loading={isLoading}
                itemLayout="horizontal"
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
                        name="查看動態"
                        type="environment-o"
                        onClick={() => this.handleViewCardLoaction(item)}
                      />,
                      <TooltipButton
                        name="退出管理"
                        type="logout"
                        onClick={() => this.handleDelete(item)}
                      />,
                    ]}>
                    <List.Item.Meta
                      avatar={
                        item.avatar ? (
                          <Image name={item.avatar} width="40" height="40" shape="circle" />
                        ) : (
                          <StyledAvatar shape="circle" icon="user" />
                        )
                      }
                      title={item.cardName}
                      description={item.uuid}
                    />
                  </List.Item>
                )}
              />
            </Col>
          }
        </StyleListContent>

        {heartRateModalVisible && (
          <HeartRateModal device={device} onCancel={this.handleHeartRateModalVisible} />
        )}
      </React.Fragment>
    );
  }
}

export default SubManagerList;
