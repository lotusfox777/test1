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
import { withI18next } from 'locales/withI18next';

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

const mapStateToProps = (state) => ({
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

@connect(mapStateToProps, mapDispatchToProps)
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

  handleEditModalVisible = (editingCard) => {
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

  handleMapModalVisible = (editingCard) => {
    this.setState({
      editingCard,
      mapModalVisible: !this.state.mapModalVisible,
    });
  };

  handleCardHealthModalVisible = (editingCard) => {
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

  handleTableChange = (pagination) => {
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

  handleSearch = (search) => {
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

  handleSearchTypeChange = (value) => {
    this.setState({ searchType: value });
  };

  handleRegionChange = (value) => {
    const { cards, listCards } = this.props;

    listCards({
      body: { ...cards.body, regionInfoId: value },
      size: cards.size,
      page: 0,
    });
  };

  handlePageChange = (e) => {
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

  handlePageSizeChange = (size) => {
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
      t,
      cards: { total, page, size, content, isLoading, isDownloading, regions },
    } = this.props;

    const columns = [
      {
        title: t('all:Bracelet number'),
        dataIndex: 'uuid',
        render: (v, r) => `${v} (${r.major}) (${r.minor})`,
      },
      {
        title: t('all:Name'),
        dataIndex: 'name',
      },
      {
        title: t('all:ID'),
        dataIndex: 'identityId',
      },
      {
        title: t('all:Phone number'),
        dataIndex: 'contactMobile',
      },
      {
        title: t('all:Status'),
        dataIndex: 'usageStatus',
        width: 90,
        render: (val) => <span>{val === 1 ? '已使用' : '未使用'}</span>,
      },
      {
        title: t('all:Battery'),
        dataIndex: 'battery',
        width: 65,
      },
      {
        title: t('all:Main monitor phone number'),
        dataIndex: 'majorContactMobile',
      },
      {
        title: t('all:Main monitor account'),
        dataIndex: 'memberId',
      },
      {
        title: t('all:Devices type'),
        dataIndex: 'deviceType',
        render: (v) => (v === 0 ? 'beacon' : 'GPS手錶'),
      },
      {
        title: t('all:Region'),
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
          <h1>{t('menu:Bracelet management')}</h1>
          <Row style={styles.mb15}>
            <Col span={16}>
              <Select onChange={this.handlePageSizeChange} defaultValue="10">
                <Option value="10">10 {t('record/page')}</Option>
                <Option value="25">25 {t('record/page')}</Option>
                <Option value="50">50 {t('record/page')}</Option>
                <Option value="100">100 {t('record/page')}</Option>
              </Select>
              <div style={{ ...styles.ml15, display: 'inline-block' }}>
                {t('To')}
                <Input
                  onPressEnter={this.handlePageChange}
                  style={{ width: '65px', margin: '0 7px' }}
                />
                {t('Page')}
              </div>
              <Button
                icon="upload"
                onClick={this.handleExport}
                loading={isDownloading}
                style={styles.ml15}
                actionTypes={FORM_FIELDS.READABLE}>
                {t('Export')}
              </Button>
              <Button
                icon="download"
                onClick={this.handleImportModalVisible}
                style={styles.ml15}
                actionTypes={FORM_FIELDS.READABLE}>
                {t('Import')}
              </Button>
            </Col>
            <Col span={8} style={{ ...styles.textRight, ...styles.floatRight }}>
              <Button
                style={styles.mr12}
                onClick={this.handleNewModalVisible}
                actionTypes={FORM_FIELDS.EDITABLE}>
                {t('Add Bracelet')}
              </Button>
              <Button
                onClick={this.handleBatchModalVisible}
                actionTypes={FORM_FIELDS.EDITABLE}>
                {t('Batch Bracelet')}
              </Button>
            </Col>
          </Row>
          <div style={{ ...styles.mb15, ...styles.mt30, display: 'flex' }}>
            <div style={{ width: 350 }}>
              <Search
                placeholder={t('all:搜尋裝置資料')}
                addonBefore={
                  <Select
                    defaultValue={searchType}
                    onChange={this.handleSearchTypeChange}
                    style={{ width: 100 }}>
                    <Option value="input">{t('all:Bracelet number')}</Option>
                    <Option value="name">{t('all:Name')}</Option>
                    <Option value="identityId">{t('all:ID')}</Option>
                    <Option value="mobile">{t('all:Phone number')}</Option>
                  </Select>
                }
                onSearch={this.handleSearch}
              />
            </div>
            <div>
              {t('all:Region')}
              <Select
                onChange={this.handleRegionChange}
                style={{ width: 100, marginLeft: 10 }}>
                {regions.map((i) => {
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
            locale={{ emptyText: t('all:no data') }}
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

export default withI18next(['all', 'menu'])(CardList);
