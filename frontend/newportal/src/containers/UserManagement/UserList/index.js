import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Layout,
  Row,
  Table,
  Button,
  Input
} from 'antd';

import {
  Status,
  listUsers
} from 'reducers/users';

import EditUserModal from './EditUserModal';

const Search = Input.Search;

const { Content } = Layout;

const mapStateToProps = state => ({
  users: state.users
});

const mapDispatchToProps = {
  listUsers
};

@connect(mapStateToProps, mapDispatchToProps)
class UserList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editModalVisible: false,
      editingUser: undefined,
      currentPage: 0
    };
  }

  handleUserUpdated = () => {
    this.props.listUsers({
      body: {},
      page: this.state.currentPage
    });
    this.setState({
      editingUser: undefined,
      editModalVisible: false
    });
  };

  handleEditModalVisible = editingUser => {
    this.setState({
      editingUser,
      editModalVisible: !this.state.editModalVisible
    });
  };

  handlePagination = pagination => {
    this.setState({
      currentPage: pagination.current - 1
    }, () => {
      this.props.listUsers({
        body: {},
        page: this.state.currentPage
      });
    });
  };

  handleSearch = val => {
    this.props.listUsers({
      body: {
        input: val
      },
      page: this.state.currentPage
    });
  };

  componentDidMount() {
    this.props.listUsers({
      body: {},
      page: 0
    });
  }

  render() {
    const {
      users: {
        content,
        isLoading,
        totalPages
      }
    } = this.props;
    const {
      editModalVisible,
      editingUser,
      currentPage
    } = this.state;

    const columns = [{
      title: '信箱/帳號',
      dataIndex: 'email'
    }, {
      title: '名稱',
      dataIndex: 'name'
    }, {
      title: 'Line',
      dataIndex: 'lineBindingStatus',
      render: val => <span>{Status[val]}</span>
    }, {
      title: '手機號碼',
      dataIndex: 'mobileno'
    }, {
      title: '手機驗證',
      dataIndex: 'mobileVerified',
      render: val => <span>{val ? '已驗證' : '未驗證'}</span>
    }, {
      title: '主管理',
      dataIndex: 'masterCardCount'
    }, {
      title: '副管理',
      dataIndex: 'slaveCardCount'
    }, {
      title: '',
      dataIndex: '',
      render: (_, user) => {
        return (
          <Button
            icon="edit" 
            onClick={() => this.handleEditModalVisible(user)}
          />
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
          <h1>用戶管理</h1>

          <Row>
            <Search
              placeholder="搜尋帳號"
              onSearch={this.handleSearch}
              style={{ width: 200 }}
            />
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
            editModalVisible &&
            <EditUserModal
              userId={editingUser.id}
              onSave={this.handleUserUpdated}
              onClose={this.handleEditModalVisible}
            />
          }
        </Content>
      </Layout>
    );
  }
}

export default UserList;
