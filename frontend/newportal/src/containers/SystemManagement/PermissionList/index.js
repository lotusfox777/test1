import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find, propEq } from 'ramda';
import { Layout, Row, Table, Button, Input, Col, Form } from 'antd';

import { ROLE_MAP, listManagers } from 'reducers/managers';

import EditPermissionModal from './EditPermissionModal';

const Search = Input.Search;

const { Content } = Layout;

const mapStateToProps = (state) => ({
  managers: state.managers,
});

const mapDispatchToProps = {
  listManagers,
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class PermissionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editModalVisible: false,
      editingManager: undefined,
      savingManager: false,
    };
  }

  getPermission = (func) => {
    let permission = '';
    if (func.editable) {
      permission = '◉';
    } else if (func.readable) {
      permission = '◎';
    }

    return permission;
  };

  handleSaveManager = () => {
    this.setState({
      savingManager: true,
      editModalVisible: false,
    });
  };

  handleEditModalVisible = (editingManager) => {
    this.setState({
      editingManager,
      editModalVisible: !this.state.editModalVisible,
    });
  };

  handlePagination = (pagination) => {
    this.setState(
      {
        currentPage: pagination.current - 1,
      },
      () => {
        this.props.listManagers({
          body: {},
          page: this.state.currentPage,
        });
      },
    );
  };

  handleSearch = (val) => {
    this.props.listManagers({
      body: {
        input: val,
      },
      page: this.state.currentPage,
    });
  };

  componentDidUpdate() {
    const {
      managers: { isLoading },
      form: { getFieldValue },
    } = this.props;
    const { savingManager, currentPage } = this.state;

    if (savingManager && !isLoading) {
      this.props.listManagers({
        body: {
          input: getFieldValue('input'),
        },
        page: currentPage,
      });
      this.setState({
        savingManager: false,
      });
    }
  }

  componentDidMount() {
    this.props.listManagers({
      body: {},
      page: 0,
    });
  }

  render() {
    const { editModalVisible, editingManager, addModalVisible, currentPage } = this.state;
    const {
      managers: { content, isLoading, totalPages },
      form: { getFieldDecorator },
    } = this.props;

    const columns = [
      {
        title: '帳號',
        dataIndex: 'memberId',
      },
      {
        title: '權限',
        dataIndex: 'roles[0]',
        sorter: (a, b) => a.id - b.id,
        render: (role) => <span>{ROLE_MAP[role.id]}</span>,
      },
      {
        title: '裝置管理',
        dataIndex: '',
        render: (_, row) => {
          const func = find(propEq('function', 'CARD_MANAGEMENT'))(row.managerFunctions);
          return <span>{this.getPermission(func)}</span>;
        },
      },
      {
        title: '用戶管理',
        dataIndex: '',
        render: (_, row) => {
          const func = find(propEq('function', 'MEMBER_MANAGEMENT'))(row.managerFunctions);
          return <span>{this.getPermission(func)}</span>;
        },
      },
      {
        title: '裝置管理',
        dataIndex: '',
        render: (_, row) => {
          const func = find(propEq('function', 'DEVICE_MANAGEMENT'))(row.managerFunctions);
          return <span>{this.getPermission(func)}</span>;
        },
      },
      {
        title: '系統管理',
        dataIndex: '',
        render: (_, row) => {
          const func = find(propEq('function', 'SYSTEM_MANAGEMENT'))(row.managerFunctions);
          return <span>{this.getPermission(func)}</span>;
        },
      },
      {
        title: '',
        dataIndex: '',
      },
      {
        title: '',
        dataIndex: '',
        render: (_, manager) => {
          return <Button icon="edit" onClick={() => this.handleEditModalVisible(manager)} />;
        },
      },
    ];

    const pagination = {
      defaultCurrent: currentPage,
      pageSize: 10,
      total: 10 * totalPages,
    };

    return (
      <Layout>
        <Content style={{ padding: '0px 24px 0px 8px' }}>
          <h1>系統管理 > 帳號權限管理</h1>

          <Row style={{ marginBottom: 15 }}>
            <Col span={16}>
              {getFieldDecorator('input')(
                <Search
                  placeholder="輸入管理者資訊"
                  onSearch={this.handleSearch}
                  style={{ width: 250 }}
                />,
              )}
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button onClick={() => this.handleEditModalVisible()}>新增管理者</Button>
            </Col>
          </Row>

          <Row style={{ marginBottom: 15 }}>◉ 可編輯 &nbsp; ◎ 僅查看</Row>

          <Table
            rowKey="memberId"
            columns={columns}
            dataSource={content}
            pagination={pagination}
            loading={isLoading}
            onChange={this.handlePagination}
            locale={{ emptyText: '沒有資料。' }}
          />

          {editModalVisible && (
            <EditPermissionModal
              manager={editingManager}
              onSave={this.handleSaveManager}
              onClose={this.handleEditModalVisible}
            />
          )}

          {addModalVisible && (
            <EditPermissionModal
              onSave={this.handleSaveManager}
              onClose={this.handleNewModalVisible}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default PermissionList;
