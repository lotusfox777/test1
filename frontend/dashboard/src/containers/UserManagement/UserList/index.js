import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Table, Input } from 'antd';
import Button from 'components/Button';
import { Status, listUsers } from 'reducers/users';
import { FORM_FIELDS } from 'constants/formFields';
import EditUserModal from './EditUserModal';

const Search = Input.Search;

const { Content } = Layout;

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = {
  listUsers,
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editModalVisible: false,
      editingUser: undefined,
      currentPage: 0,
      search: null,
    };
  }

  handleUserUpdated = () => {
    this.props.listUsers({
      body: {
        input: this.state.search,
      },
      page: this.state.currentPage,
    });
    this.setState({
      editingUser: undefined,
      editModalVisible: false,
    });
  };

  handleEditModalVisible = editingUser => {
    this.setState({
      editingUser,
      editModalVisible: !this.state.editModalVisible,
    });
  };

  handlePagination = pagination => {
    this.setState(
      {
        currentPage: pagination.current - 1,
      },
      () => {
        this.props.listUsers({
          body: { input: this.state.search },
          page: this.state.currentPage,
        });
      },
    );
  };

  handleSearch = search => {
    this.setState({ search });
    this.props.listUsers({
      body: {
        input: search,
      },
      page: this.state.currentPage,
    });
  };

  componentDidMount() {
    this.props.listUsers({
      body: {},
      page: 0,
    });
  }

  render() {
    const {
      users: { content, isLoading, totalPages },
    } = this.props;
    const { editModalVisible, editingUser, currentPage } = this.state;

    const columns = [
      {
        title: '信箱/帳號',
        dataIndex: 'email',
      },
      {
        title: '名稱',
        dataIndex: 'name',
      },
      {
        title: 'Line',
        dataIndex: 'lineBindingStatus',
        render: val => <span>{Status[val]}</span>,
      },
      {
        title: '手機號碼',
        dataIndex: 'mobileno',
      },
      {
        title: '手機驗證',
        dataIndex: 'mobileVerified',
        render: val => <span>{val ? '已驗證' : '未驗證'}</span>,
      },
      {
        title: '主管理',
        dataIndex: 'masterCardCount',
      },
      {
        title: '副管理',
        dataIndex: 'slaveCardCount',
      },
      {
        title: '',
        dataIndex: '',
        render: (_, user) => {
          return (
            <Button
              icon="edit"
              actionTypes={FORM_FIELDS.EDITABLE}
              onClick={() => this.handleEditModalVisible(user)}
            />
          );
        },
      },
    ];

    const pagination = {
      current: currentPage + 1,
      pageSize: 10,
      total: 10 * totalPages,
    };

    console.log(editingUser);

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

          {editModalVisible && (
            <EditUserModal
              userId={editingUser.id}
              mobileVerified={editingUser.mobileVerified}
              onSave={this.handleUserUpdated}
              onClose={this.handleEditModalVisible}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default UserList;
