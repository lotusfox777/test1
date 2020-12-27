import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import {
  CARD_MANAGEMENT,
  CARD_LIST,
  SUB_MANAGEMENT,
  SUBMANAGER_LIST,
  CARDAUTHORITY_MANAGEMENT,
  CARDAUTHORITY_LIST,
  SAVEAREA_MANAGEMENT,
  SAVEAREA_LIST,
  SAVEAREA_HISTORY,
} from 'constants/routes';

const { SubMenu } = Menu;

const menuRouteMap = {
  home: {
    key: 'home',
    SubMenus: {},
  },
  [CARD_MANAGEMENT]: {
    key: CARD_MANAGEMENT,
    SubMenus: {
      CARD_LIST,
    },
  },
  [SUB_MANAGEMENT]: {
    key: SUB_MANAGEMENT,
    SubMenus: {
      SUBMANAGER_LIST,
    },
  },
  [CARDAUTHORITY_MANAGEMENT]: {
    key: CARDAUTHORITY_MANAGEMENT,
    SubMenus: {
      CARDAUTHORITY_LIST,
    },
  },
  [SAVEAREA_MANAGEMENT]: {
    key: SAVEAREA_MANAGEMENT,
    SubMenus: {
      SAVEAREA_LIST,
      SAVEAREA_HISTORY,
    },
  },
};

class SideMenu extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    const paths = props.location.pathname.split('/').slice(1);
    this.state = {
      pathname: paths[1],
      defaultOpenKey: paths[0],
    };
  }

  render() {
    const { defaultOpenKey, pathname } = this.state;

    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`/${defaultOpenKey}/${pathname}`]}
        defaultOpenKeys={[defaultOpenKey]}
        style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key={menuRouteMap[CARD_MANAGEMENT].key}>
          <Icon type="user" />
          {/*點擊回列表*/}
          <Link to={CARD_LIST}>主管理名單</Link>
        </Menu.Item>
        <Menu.Item key={menuRouteMap[SUB_MANAGEMENT].key}>
          <Icon type="team" />
          <Link to={SUBMANAGER_LIST}>副管理名單</Link>
        </Menu.Item>
        <Menu.Item key={menuRouteMap[CARDAUTHORITY_MANAGEMENT].key}>
          <Icon type="solution" />
          <Link to={CARDAUTHORITY_LIST}>授權管理</Link>
        </Menu.Item>
        <SubMenu
          key={menuRouteMap[SAVEAREA_MANAGEMENT].key}
          title={
            <span>
              <Icon type="flag" />
              守護區域管理
            </span>
          }>
          <Menu.Item key={SAVEAREA_LIST}>
            <Link to={SAVEAREA_LIST}>守護區域清單</Link>
          </Menu.Item>
          <Menu.Item key={SAVEAREA_HISTORY}>
            <Link to={SAVEAREA_HISTORY}>守護紀錄</Link>
          </Menu.Item>
        </SubMenu>
        {/*any(role => role === 'ROLE_ADMIN', roles) && <div />*/}
      </Menu>
    );
  }
}

const enhance = compose(
  connect(state => ({})),
  withRouter,
);

export default enhance(SideMenu);
