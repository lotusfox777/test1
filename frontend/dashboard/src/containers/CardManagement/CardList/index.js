import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Layout, Row, Col, Table, Select, Input } from 'antd';
import {
  getEditCard,
  getCard,
  listCards,
  exportCards,
  listRegions,
  listCardHealth,
} from 'reducers/cards';
import Button from 'components/Button';
import { FORM_FIELDS } from 'constants/formFields';
import NewCardModal from './NewCardModal';
import BatchCardModal from './BatchCardModal';
import EditCardModal from './EditCardModal';
import CardContactModal from './CardContactModal';
import ImportModal from './ImportModal';
import MapModal from './MapModal';

const { Content } = Layout;
const { Option } = Select;

const styles = {
  w100: { width: '100%' },
  mr12: { marginRight: '12px' },
  ml15: { marginLeft: '15px' },
  mb15: { marginBottom: '15px' },
  mt30: { marginTop: '30px' },
  textRight: { textAlign: 'right' },
  floatRight: { float: 'right ' },
};

const IconFolderOpenButton = styled(Button)`
  i {
    position: relative;
    top: 2px;
  }
`;

const Search = styled(Input.Search)`
  width: 220px !important;
`;

const mapStateToProps = state => ({
  cards: state.cards,
});

const mapDispatchToProps = {
  getCard,
  listCards,
  exportCards,
  getEditCard,
  listRegions,
  listCardHealth,
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class CardList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newModalVisible: false,
      batchModalVisible: false,
      editModalVisible: false,
      mapModalVisible: false,
      cardHealthModalVisible: false,
      importModalVisible: false,
      editingCard: undefined,
      currentPage: 0,
      pageSize: 10,
      searchType: 'input',
      keywordStr: '',
    };
  }

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

  handleImportModalVisible = () => {
    this.setState({
      importModalVisible: !this.state.importModalVisible,
    });
  };

  handleEditModalVisible = editingCard => {
    this.setState(
      {
        editingCard,
        editModalVisible: !this.state.editModalVisible,
      },
      () => {
        if (editingCard && editingCard.id) {
          this.props.getEditCard(editingCard.id);
        }
      },
    );
  };

  handleMapModalVisible = editingCard => {
    this.setState({
      editingCard,
      mapModalVisible: !this.state.mapModalVisible,
    });
  };

  handleCardHealthModalVisible = editingCard => {
    this.setState(
      {
        editingCard,
        cardHealthModalVisible: !this.state.cardHealthModalVisible,
      },
      () => {
        if (editingCard && editingCard.id) {
          this.props.getCard(editingCard.id);
        }
      },
    );

    // this.setState({
    //   editingCard,
    //   cardHealthModalVisible: !this.state.cardHealthModalVisible,
    // });
  };

  handleTableChange = pagination => {
    const { cards } = this.props;
    this.props.listCards({
      body: cards.body,
      size: cards.size,
      page: pagination.current - 1,
    });
  };

  handleExport = () => {
    const { cards, exportCards } = this.props;
    exportCards({ body: cards.body });
  };

  handleSearch = search => {
    const { searchType } = this.state;
    const { cards, listCards } = this.props;
    if (search !== cards.search) {
      listCards({
        body: {
          [searchType]: search,
        },
        size: cards.size,
        page: 0,
      });
    }
  };

  handleSearchTypeChange = value => {
    this.setState({ searchType: value });
  };

  handleRegionChange = value => {
    const { cards, listCards } = this.props;

    listCards({
      body: { ...cards.body, regionInfoId: value },
      size: cards.size,
      page: 0,
    });
  };

  handlePageChange = e => {
    const { cards, listCards } = this.props;
    let page = +e.target.value;

    if (Number.isInteger(page)) {
      page = page - 1;
      const isValidPage = page >= 0 && page < cards.totalPages;

      if (isValidPage) {
        listCards({
          page,
          body: cards.body,
          size: cards.size,
        });
      }
    }
  };

  handlePageSizeChange = size => {
    const { cards, listCards } = this.props;
    listCards({
      size: Number(size),
      body: cards.body,
      page: cards.page,
    });
  };

  componentDidMount = () => {
    this.props.listCards();
    this.props.listRegions();
  };

  render() {
    const {
      newModalVisible,
      batchModalVisible,
      editModalVisible,
      mapModalVisible,
      cardHealthModalVisible,
      importModalVisible,
      editingCard,
      searchType,
    } = this.state;
    const {
      cards: { total, page, size, content, isLoading, isDownloading, regions },
    } = this.props;

    const columns = [
      {
        title: '裝置號',
        dataIndex: 'uuid',
        render: (v, r) => `${v} (${r.major}) (${r.minor})`,
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '身分證字號',
        dataIndex: 'identityId',
      },
      {
        title: '聯絡電話',
        dataIndex: 'contactMobile',
      },
      {
        title: '使用狀態',
        dataIndex: 'usageStatus',
        width: 90,
        render: val => <span>{val === 1 ? '已使用' : '未使用'}</span>,
      },
      {
        title: '電量',
        dataIndex: 'battery',
        width: 65,
      },
      {
        title: '主管理電話',
        dataIndex: 'majorContactMobile',
      },
      {
        title: '主管理帳號',
        dataIndex: 'memberId',
      },
      {
        title: '裝置',
        dataIndex: 'deviceType',
        render: v => (v === 0 ? 'beacon' : 'GPS手錶'),
      },
      {
        title: '區域',
        dataIndex: 'regionInfoName',
      },
      {
        title: '',
        dataIndex: '',
        width: 140,
        render: (_, card) => {
          return (
            <span>
              <Button
                icon="edit"
                style={{ marginRight: 6 }}
                actionTypes={FORM_FIELDS.EDITABLE}
                onClick={() => this.handleEditModalVisible(card)}
              />
              <Button
                icon="environment"
                style={{ marginRight: 6 }}
                actionTypes={FORM_FIELDS.READABLE}
                onClick={() => this.handleMapModalVisible(card)}
              />
              <IconFolderOpenButton
                icon="folder-open"
                actionTypes={FORM_FIELDS.EDITABLE}
                onClick={() => this.handleCardHealthModalVisible(card)}
              />
            </span>
          );
        },
      },
    ];

    const pagination = {
      current: page + 1,
      pageSize: size,
      total,
    };

    return (
      <Layout>
        <Content style={{ padding: '0px 24px 0px 8px' }}>
          <h1>裝置管理</h1>
          <Row style={styles.mb15}>
            <Col span={16}>
              <Select onChange={this.handlePageSizeChange} defaultValue="10">
                <Option value="10">10 筆/頁</Option>
                <Option value="25">25 筆/頁</Option>
                <Option value="50">50 筆/頁</Option>
                <Option value="100">100 筆/頁</Option>
              </Select>
              <div style={{ ...styles.ml15, display: 'inline-block' }}>
                跳至
                <Input
                  onPressEnter={this.handlePageChange}
                  style={{ width: '65px', margin: '0 7px' }}
                />
                頁
              </div>
              <Button
                icon="upload"
                onClick={this.handleExport}
                loading={isDownloading}
                style={styles.ml15}
                actionTypes={FORM_FIELDS.READABLE}>
                匯出資料
              </Button>
              <Button
                icon="download"
                onClick={this.handleImportModalVisible}
                style={styles.ml15}
                actionTypes={FORM_FIELDS.READABLE}>
                匯入資料
              </Button>
            </Col>
            <Col span={8} style={{ ...styles.textRight, ...styles.floatRight }}>
              <Button
                style={styles.mr12}
                onClick={this.handleNewModalVisible}
                actionTypes={FORM_FIELDS.EDITABLE}>
                新增裝置
              </Button>
              <Button
                onClick={this.handleBatchModalVisible}
                actionTypes={FORM_FIELDS.EDITABLE}>
                批次新增
              </Button>
            </Col>
          </Row>
          <div style={{ ...styles.mb15, ...styles.mt30, display: 'flex' }}>
            <div style={{ width: 350 }}>
              <Search
                placeholder="搜尋裝置資料"
                addonBefore={
                  <Select
                    defaultValue={searchType}
                    onChange={this.handleSearchTypeChange}
                    style={{ width: 100 }}>
                    <Option value="input">裝置號</Option>
                    <Option value="name">姓名</Option>
                    <Option value="identityId">身分證字號</Option>
                    <Option value="mobile">手機號碼</Option>
                  </Select>
                }
                onSearch={this.handleSearch}
              />
            </div>
            <div>
              區域
              <Select
                onChange={this.handleRegionChange}
                style={{ width: 100, marginLeft: 10 }}>
                {regions.map(i => {
                  return (
                    <Option key={i.id} value={i.id}>
                      {i.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
          <Table
            rowKey={(record, idx) =>
              `${record.uuid}${record.major}${record.minor}${idx}`
            }
            columns={columns}
            dataSource={content}
            pagination={pagination}
            loading={isLoading}
            onChange={this.handleTableChange}
            locale={{ emptyText: '沒有資料。' }}
          />
          {newModalVisible && (
            <NewCardModal
              regions={regions}
              onClose={this.handleNewModalVisible}
            />
          )}
          {batchModalVisible && (
            <BatchCardModal
              regions={regions}
              onClose={this.handleBatchModalVisible}
            />
          )}
          {editModalVisible && (
            <EditCardModal
              card={editingCard}
              onClose={this.handleEditModalVisible}
            />
          )}
          {mapModalVisible && (
            <MapModal card={editingCard} onClose={this.handleMapModalVisible} />
          )}
          {cardHealthModalVisible && (
            <CardContactModal
              id={editingCard.id}
              onClose={this.handleCardHealthModalVisible}
            />
          )}
          {/* {cardHealthModalVisible && (
            <CardHealthModal
              item={editingCard}
              onClose={this.handleCardHealthModalVisible}
            />
          )} */}
          {importModalVisible && (
            <ImportModal
              regions={regions}
              onCancel={this.handleImportModalVisible}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default CardList;
