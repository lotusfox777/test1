import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Modal, Input, Row, Col, Table, Button } from 'antd';

import { Status } from 'reducers/ufos';

import { listGuardAreaUFOs, deleteGuardAreaUFOs } from 'reducers/guardAreas';

const Search = Input.Search;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
  guardAreas: state.guardAreas
});

const mapDispatchToProps = {
  listGuardAreaUFOs,
  deleteGuardAreaUFOs
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class UFOListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      currentPage: 0
    };
  }

  handleSelectRows = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    });
  };

  handlePagination = pagination => {
    this.setState(
      {
        currentPage: pagination.current - 1
      },
      () => {
        this.props.listGuardAreaUFOs({
          body: {
            id: this.props.guardArea.id
          },
          page: this.state.currentPage
        });
      }
    );
  };

  handleDelete = () => {
    const {
      deleteGuardAreaUFOs,
      guardArea: { id }
    } = this.props;
    const { selectedRowKeys } = this.state;

    confirm({
      title: '確定要刪除UFO?',
      onOk() {
        deleteGuardAreaUFOs({
          id,
          ufoSeqs: selectedRowKeys
        });
      }
    });
  };

  componentDidMount() {
    this.props.listGuardAreaUFOs({
      body: {
        id: this.props.guardArea.id
      }
    });
  }

  render() {
    const {
      guardArea: { id },
      guardAreas: { isLoading, ufos, ufosTotalPages },
      onClose
    } = this.props;
    const { currentPage } = this.state;

    const columns = [
      {
        title: 'UFO ID',
        dataIndex: 'ufoId',
        render: id => <span>#{id}</span>
      },
      {
        title: '設置時間',
        dataIndex: 'createTime',
        render: time => (
          <span>{moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        )
      },
      {
        title: '最後連線時間',
        dataIndex: 'updateTime',
        render: time => (
          <span>{moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        )
      },
      {
        title: 'ALIVE',
        dataIndex: 'status',
        render: val => <span>{Status[val]}</span>
      },
      {
        title: '座標',
        dataIndex: '',
        render: (_, ufo) => {
          return (
            <span>
              {ufo.latitude}, {ufo.longitude}
            </span>
          );
        }
      }
    ];

    const rowSelection = {
      onChange: this.handleSelectRows
    };

    const pagination = {
      defaultCurrent: currentPage,
      pageSize: 10,
      total: 10 * ufosTotalPages
    };

    const footer = [
      <Button key="close" type="primary" onClick={onClose}>
        關閉
      </Button>
    ];

    return (
      <Modal
        width="75%"
        title={`守護區域 #${id} UFO清單`}
        visible={true}
        onCancel={onClose}
        footer={footer}
        maskClosable={false}
      >
        <Row style={{ marginBottom: 15 }} gutter={16}>
          <Col span={6}>
            <Search placeholder="輸入UFO資訊" onSearch={this.handleSearch} />
          </Col>
          <Col span={6}>
            <Button onClick={this.handleDelete}>刪除</Button>
          </Col>
        </Row>

        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={ufos}
          pagination={pagination}
          isLoading={isLoading}
          locale={{ emptyText: '沒有資料。' }}
        />
      </Modal>
    );
  }
}

export default UFOListModal;
