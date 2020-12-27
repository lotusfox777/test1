import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Layout, Row, Col, Table, Select, Input } from 'antd';
import Cookies from 'js-cookie';
import Button from 'components/Button';
import { Status, listUFOs } from 'reducers/ufos';
import { FORM_FIELDS } from 'constants/formFields';
import { downloadCSV } from 'utils/webHelper';
import { API_ROOT } from 'constants/endpoint';
import { toQueryString } from 'apis/index';
import NewUFOModal from './NewUFOModal';
import BatchUFOModal from './BatchUFOModal';
import EditUFOModal from './EditUFOModal';
import MapUFOModal from './MapUFOModal';

const { Content } = Layout;

const { Search } = Input;

const mapStateToProps = state => ({
  ufos: state.ufos,
});

const mapDispatchToProps = {
  listUFOs,
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class UFOList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newModalVisible: false,
      batchModalVisible: false,
      editModalVisible: false,
      mapModalVisible: false,
      editingUFO: undefined,
      currentPage: 0,
      keyword: null,
      ufoState: null,
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

  handleEditModalVisible = editingUFO => () => {
    this.setState({
      editingUFO,
      editModalVisible: !this.state.editModalVisible,
    });
  };

  handleMapModalVisible = editingUFO => () => {
    this.setState({
      editingUFO,
      mapModalVisible: !this.state.mapModalVisible,
    });
  };

  handleQuery = () => {
    this.props.listUFOs({
      body: {
        input: this.state.keyword,
        alive: this.state.ufoState,
      },
      page: this.state.currentPage,
      size: this.props.ufos.size,
    });
  };

  handleSearch = input => {
    if (this.state.keyword !== input) {
      this.setState({ keyword: input, currentPage: 0 }, this.handleQuery);
    }
  };

  handleStateChange = ufoState => {
    this.setState({ ufoState }, this.handleQuery);
  };

  handlePagination = pagination => {
    this.setState(
      {
        currentPage: pagination.current - 1,
      },
      this.handleQuery,
    );
  };

  handleExport = async () => {
    let params = {
      alive: this.state.ufoState,
      input: this.state.keyword,
    };

    const text = await fetch(
      `${API_ROOT}/v1/ufo/list/export?${toQueryString(params)}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.set('_dplus-dashboard_Token')}`,
        },
      },
    ).then(response => response.text());

    downloadCSV({ text, filename: 'UFO清單' });
  };

  componentDidMount() {
    this.props.listUFOs({
      body: {},
      page: this.state.currentPage,
    });
  }

  render() {
    const {
      newModalVisible,
      batchModalVisible,
      editModalVisible,
      mapModalVisible,
      editingUFO,
    } = this.state;
    const {
      ufos: { totalPages, content, isLoading, page, size },
    } = this.props;

    const columns = [
      {
        title: 'UFO ID',
        dataIndex: 'ufoId',
      },
      {
        title: '設置時間',
        dataIndex: 'createTime',
        render: time => (
          <span>{moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        ),
      },
      {
        title: '最後連線時間',
        dataIndex: 'connectTime',
        render: time => (
          <span>{time && moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        ),
      },
      {
        title: 'ALIVE',
        dataIndex: 'alive',
        render: val => <span>{Status[val]}</span>,
      },
      {
        title: '備註',
        dataIndex: 'remark',
      },
      {
        title: '',
        dataIndex: '',
        render: (_, ufo) => {
          return (
            <span>
              <Button
                icon="edit"
                style={{ marginRight: 6 }}
                actionTypes={FORM_FIELDS.EDITABLE}
                onClick={this.handleEditModalVisible(ufo)}
              />
              <Button
                icon="environment"
                actionTypes={FORM_FIELDS.READABLE}
                onClick={this.handleMapModalVisible(ufo)}
              />
            </span>
          );
        },
      },
    ];

    const pagination = {
      current: page + 1,
      pageSize: size,
      total: 10 * totalPages,
    };

    return (
      <Layout>
        <Content style={{ padding: '0px 24px 0px 8px' }}>
          <h1>裝置管理 > UFO管理</h1>

          <Row style={{ marginBottom: 15 }}>
            <Col
              span={24}
              style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Search
                  placeholder="搜尋UFO資料"
                  style={{ width: 260, marginRight: 30 }}
                  onSearch={this.handleSearch}
                />
                狀態
                <Select
                  allowClear
                  onChange={this.handleStateChange}
                  style={{ width: 100, marginLeft: 10 }}>
                  <Select.Option value={1}>連線</Select.Option>
                  <Select.Option value={0}>離線</Select.Option>
                </Select>
                <Button
                  style={{ marginLeft: 16 }}
                  actionTypes={FORM_FIELDS.EDITABLE}
                  onClick={this.handleExport}>
                  匯出
                </Button>
              </div>
              <div>
                <Button
                  style={{ marginRight: 12 }}
                  actionTypes={FORM_FIELDS.EDITABLE}
                  onClick={this.handleNewModalVisible}>
                  新增UFO
                </Button>
                <Button
                  onClick={this.handleBatchModalVisible}
                  actionTypes={FORM_FIELDS.EDITABLE}>
                  批次新增
                </Button>
              </div>
            </Col>
          </Row>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={content}
            pagination={pagination}
            loading={isLoading}
            onChange={this.handlePagination}
            locale={{ emptyText: '沒有資料。' }}
          />

          {newModalVisible && (
            <NewUFOModal onClose={this.handleNewModalVisible} />
          )}
          {batchModalVisible && (
            <BatchUFOModal onClose={this.handleBatchModalVisible} />
          )}
          {editModalVisible && (
            <EditUFOModal
              ufo={editingUFO}
              onClose={this.handleEditModalVisible()}
            />
          )}
          {mapModalVisible && (
            <MapUFOModal
              ufo={editingUFO}
              onClose={this.handleMapModalVisible()}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default UFOList;
