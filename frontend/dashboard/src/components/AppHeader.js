import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Layout, Button } from 'antd';
import { rem } from 'polished';
import * as actions from 'actions';

const StyledHeader = styled(Layout.Header)`
  display: flex;
  font-size: ${rem('24px')};
  color: white;
  white-space: nowrap;
  height: 64px;
  padding-left: 16px;
  padding-right: 8px;
  align-items: center;
  min-width: fit-content;

  p {
    margin-bottom: 0;
  }

  > .auth-identity {
    margin-left: auto;

    > .user-name {
      font-size: 18px;
      margin-right: 8px;
    }

    > * {
      vertical-align: middle;
    }
  }
`;

class AppHeader extends PureComponent {
  static propTypes = {
    loginId: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
  };

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    return (
      <StyledHeader>
        <p>DPlus 後台管理系統</p>
        <div className="auth-identity">
          <span className="user-name">{`歡迎回來, ${this.props.loginId}`}</span>
          <Button ghost onClick={this.handleLogout}>
            登出
          </Button>
        </div>
      </StyledHeader>
    );
  }
}

const mapStateToProps = state => ({
  loginId: state.auth.loginId,
});

export default connect(
  mapStateToProps,
  {
    logout: actions.logout,
  },
)(AppHeader);
