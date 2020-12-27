import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { indexOf, pathOr, compose } from 'ramda';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Layout, Icon, Menu, Col, Avatar, Popover } from 'antd';
import { rem } from 'polished';
import Image from 'components/Image';
import AccountModal from 'containers/AccountManagement/index';
import { listNotify, clearNotify } from 'reducers/guardAreas';
import { getCurrentUser } from 'reducers/users';
import { logout } from 'reducers/auth';
import { HOME, ACTIVITY_MAP, CARD_LIST } from 'constants/routes';
import CurrentGuardAreas from './CurrentGuardAreas';
import DropdownMenu from './DropdownMenu';
import { withDrawer } from '../drawer-context';
import { withI18next } from 'locales/withI18next'

const StyledMenu = styled(Col)`
  margin-left: 48px;
  font-family: MicrosoftJhengHei;

  .ant-menu-horizontal {
    border: none;
    background-color: transparent;
  }

  .ant-menu-item {
    border-bottom: 5px solid #1e3954;
    padding-left: 40px;
    padding-right: 40px;

    &:hover {
      border-bottom: 5px solid #79abe5;
    }
  }

  .ant-menu-horizontal .ant-menu-item-selected {
    border-bottom: 5px solid #79abe5;
  }

  .ant-menu-horizontal > .ant-menu-item > a {
    opacity: 0.5;
    color: #ffffff;
    font-size: 16px;
  }

  .ant-menu-horizontal > .ant-menu-item-selected > a {
    color: #79abe5;
    opacity: 1;
  }
  .ant-menu-submenu {
    z-index: 1200;
  }
`;

const StyledHeader = styled(Layout.Header)`
  display: flex;
  font-size: ${rem('24px')};
  color: white;
  white-space: nowrap;
  height: 56px;
  padding-left: 16px;
  padding-right: 8px;
  align-items: center;
  background-color: #1e3954;
  z-index: 1001;

  .b_font_14_white {
    font-family: MicrosoftJhengHei;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }

  p {
    margin-bottom: 0;
  }

  > .auth-identity {
    margin-left: auto;
    margin-right: 46.4px;
    min-width: 133px;
  }
`;

class AppHeader extends PureComponent {
  static propTypes = {
    loginId: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const pathname = pathOr('', ['history', 'location', 'pathname'], props);

    this.state = {
      notifyHistoryModalVisible: false,
      currentTab: indexOf(pathname, [ACTIVITY_MAP, HOME]) > -1 ? 'activity' : 'card',
      pathname,
    };

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const pathname = pathOr('', ['history', 'location', 'pathname'], nextProps);

    if (prevState.pathname !== pathname) {
      return {
        pathname,
        currentTab: indexOf(pathname, [ACTIVITY_MAP, HOME]) > -1 ? 'activity' : 'card',
      };
    }

    return null;
  }

  componentWillUnmount() {
    this.props.onAccountModalVisible(false);
  }

  handleSwitchTab = ({ currentTab }) => () => {
    this.setState({ currentTab });
    this.props.onDrawerVisible({
      generalDrawerVisible: true,
      detailDrawerVisible: false,
      cardActivitiesVisible: false,
    });
  };

  handleToActivityMap = () => {
    const { history, onDrawerVisible } = this.props;
    if (history.location.pathname !== ACTIVITY_MAP) {
      history.push(ACTIVITY_MAP);
      this.setState({ currentTab: 'activity', pathname: ACTIVITY_MAP });
    }
    onDrawerVisible({
      generalDrawerVisible: true,
      detailDrawerVisible: false,
      cardActivitiesVisible: false,
    });
  };

  handleLogout = () => {
    this.props.logout();
  };

  handleOpenNotifyHistoryModal = () => {
    this.setState({ notifyHistoryModalVisible: true });
    this.props.listNotify();
  };

  handleCloseNotifyHistoryModal = () => {
    this.setState({ notifyHistoryModalVisible: false });
    this.props.clearNotify();
  };

  handleOpenAccountModal = () => {
    this.props.onAccountModalVisible(true);
    this.props.getCurrentUser();
  };

  handleCloseAccountModal = () => {
    this.props.onAccountModalVisible(false);
  };

  renderPopover = () => {
    const { t } = this.props
    return (
      <div className="test">
        <div>
          <a onClick={this.handleAccountModal}>{t('account')}</a>
        </div>
        <div>
          <a onClick={this.handleLogout}>{t('logout')}</a>
        </div>
      </div>
    );
  };

  render() {
    const {
      listNotify,
      notifyHistory,
      isLoading,
      isUpdatingEmail,
      currentUser,
      history,
      accountModalVisible,
      t,
    } = this.props;
    const { notifyHistoryModalVisible, currentTab } = this.state;

    return (
      <StyledHeader>
        <img
          onClick={this.handleToActivityMap}
          srcSet="/img/logo-lg-white@2x.png"
          alt=""
          style={{ height: 38, width: 110, cursor: 'pointer' }}
        />
        <StyledMenu>
          <Menu style={{ marginTop: '3px' }} mode="horizontal" selectedKeys={[currentTab]}>
            <Menu.Item key="activity">
              <Link
                to={ACTIVITY_MAP}
                onClick={this.handleSwitchTab({
                  currentTab: 'activity',
                })}>
                {t('search trace')}
              </Link>
            </Menu.Item>
            <Menu.Item key="card">
              <Link to={CARD_LIST} onClick={this.handleSwitchTab({ currentTab: 'card' })}>
                {t('bracelet management')}
              </Link>
            </Menu.Item>
          </Menu>
        </StyledMenu>
        <div className="auth-identity">
          <img
            style={{ cursor: 'pointer', marginRight: 26 }}
            src="/img/icon-bell.png"
            srcSet="/img/icon-bell@2x.png 2x,/img/icon-bell@3x.png 3x"
            alt="即時守護通知"
            onClick={this.handleOpenNotifyHistoryModal}
          />
          {currentUser.profileImg && (
            <Image
              width={32}
              height={32}
              name={currentUser.profileImg}
              shape="circle"
              style={{
                marginRight: 12,
                marginTop: 2,
                border: '1px solid #fff',
              }}
            />
          )}
          {!currentUser.profileImg && (
            <Avatar style={{ marginRight: 12 }} size={32} src="/img/avatar-pic.png" />
          )}
          <Popover
            placement="bottom"
            content={
              <DropdownMenu
                showAccountModal={this.handleOpenAccountModal}
                logout={this.handleLogout}
              />
            }>
            <span className="b_font_14_white">{currentUser.name || currentUser.email}</span>
            <Icon style={{ fontSize: 9, marginLeft: 4 }} type="caret-down" theme="outlined" />
          </Popover>
        </div>
        {notifyHistoryModalVisible && (
          <CurrentGuardAreas
            loadMore={listNotify}
            notifyHistory={notifyHistory}
            pushState={history.push}
            isLoading={isLoading}
            onClose={this.handleCloseNotifyHistoryModal}
          />
        )}
        {accountModalVisible && (
          <AccountModal
            isLoading={isLoading}
            isUpdatingEmail={isUpdatingEmail}
            currentUser={currentUser}
            onClose={this.handleCloseAccountModal}
          />
        )}
      </StyledHeader>
    );
  }
}

const mapStateToProps = (state) => ({
  loginId: state.auth.loginId,
  notifyHistory: state.guardAreas.notifyHistory,
  currentUser: state.users.currentUser,
  isLoading: state.guardAreas.isLoading || state.users.isLoading,
  isUpdatingEmail: state.users.isUpdatingEmail,
});

const mapDispatchToProps = {
  logout,
  clearNotify,
  listNotify,
  getCurrentUser,
};

export default compose(
  withRouter,
  withDrawer,
  connect(mapStateToProps, mapDispatchToProps),
  withI18next(['all']),
)(AppHeader);
