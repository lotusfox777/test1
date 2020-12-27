import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Layout,
  Row,
  Col,
  Table,
  Button
} from 'antd';

import {
  Status,
  listUFOs
} from 'reducers/ufos';

import NewUFOModal from './NewUFOModal';
import BatchUFOModal from './BatchUFOModal';
import EditUFOModal from './EditUFOModal';
import MapUFOModal from './MapUFOModal';

const { Content } = Layout;

const mapStateToProps = state => ({
  ufos: state.ufos
});

const mapDispatchToProps = {
  listUFOs
};

@connect(mapStateToProps, mapDispatchToProps)
class UFOList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newModalVisible: false,
      batchModalVisible: false,
      editModalVisible: false,
      mapModalVisible: false,
      editingUFO: undefined,
      currentPage: 0
    };
  }

  handleNewModalVisible = () => {
    this.setState({
      newModalVisible: !this.state.newModalVisible
    });
  };

  handleBatchModalVisible = () => {
    this.setState({
      batchModalVisible: !this.state.batchModalVisible
    });
  };

  handleEditModalVisible = editingUFO => {
    this.setState({
      editingUFO,
      editModalVisible: !this.state.editModalVisible
    });
  };

  handleMapModalVisible = editingUFO => {
    this.setState({
      editingUFO,
      mapModalVisible: !this.state.mapModalVisible
    });
  };

  handlePagination = pagination => {
    this.setState({
      currentPage: pagination.current - 1
    }, () => {
      this.props.listUFOs({
        body: {},
        page: this.state.currentPage
      });
    });
  };

  componentDidMount() {
    this.props.listUFOs({
      body: {},
      page: this.state.currentPage
    });
  }

  render() {
    const {
      newModalVisible,
      batchModalVisible,
      editModalVisible,
      mapModalVisible,
      editingUFO,
      currentPage
    } = this.state;
    const {
      ufos: {
        totalPages,
        content,
        isLoading
      }
    } = this.props;

    const columns = [{
      title: 'UFO ID',
      dataIndex: 'ufoId'
    }, {
      title: '設置時間',
      dataIndex: 'createTime',
      render: time => <span>{moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
    }, {
      title: '最後連線時間',
      dataIndex: 'updateTime',
      render: time => <span>{moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
    }, {
      title: '狀態',
      dataIndex: 'status',
      render: val => <span>{Status[val]}</span>
    }, {
      title: '備註',
      dataIndex: 'remark'
    }, {
      title: '',
      dataIndex: '',
      render: (_, ufo) => {
        return (
          <span>
            <Button
              icon="edit" 
              style={{ marginRight: 6 }}
              onClick={() => this.handleEditModalVisible(ufo)}
            />
            <Button
              icon="environment"
              onClick={() => this.handleMapModalVisible(ufo)}
            />
          </span>
        );
      }
    }];

    const pagination = {
      defaultCurrent: currentPage,
      pageSize: 10,
      total: 10 * totalPages
    };

    return (
      <Layout>
        <Content style={{ padding: '0px 24px 0px 8px' }}>
          <h1>裝置管理 > UFO管理</h1>

          <Row style={{ marginBottom: 15 }}>
            <Col span={16}></Col>
            <Col
              span={8}
              style={{ textAlign: 'right' }}
            >
              <Button
                style={{ marginRight: 12 }}
                onClick={this.handleNewModalVisible}
              >
                新增UFO
              </Button>
              <Button
                onClick={this.handleBatchModalVisible}
              >
                批次新增
              </Button>
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

          {
            newModalVisible &&
            <NewUFOModal
              onClose={this.handleNewModalVisible}
            />
          }
          {
            batchModalVisible &&
            <BatchUFOModal
              onClose={this.handleBatchModalVisible}
            />
          }
          {
            editModalVisible &&
            <EditUFOModal
              ufo={editingUFO}
              onClose={this.handleEditModalVisible}
            />
          }
          {
            mapModalVisible &&
            <MapUFOModal
              ufo={editingUFO}
              onClose={this.handleMapModalVisible}
            />
          }
        </Content>
      </Layout>
    );
  }
}

export default UFOList;
