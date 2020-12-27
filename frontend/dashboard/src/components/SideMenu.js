import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose, keys } from 'ramda';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import {
  CARD_MANAGEMENT,
  CARD_LIST,
  MEMBER_MANAGEMENT,
  USER_LIST,
  DEVICE_MANAGEMENT,
  UFO_LIST,
  GUARD_AREA_LIST,
  SYSTEM_MANAGEMENT,
  PERM_LIST,
  ASSIST_FINDING_MANAGEMENT,
  SEARCH_MISSING_LIST,
} from 'constants/routes';
import functions from 'constants/functions';
import { checkUserAuth } from 'utils/authentication';
import i18n from 'i18next';

const { SubMenu } = Menu;

const menuRouteMap = {
  [CARD_MANAGEMENT]: {
    key: CARD_MANAGEMENT,
    title: i18n.t('menu:Bracelet management'),
    SubMenus: [
      {
        key: CARD_LIST,
        name: i18n.t('menu:Bracelet management'),
      },
    ],
  },
  [MEMBER_MANAGEMENT]: {
    key: MEMBER_MANAGEMENT,
    title: i18n.t('menu:Account management'),
    SubMenus: [
      {
        key: USER_LIST,
        name: i18n.t('menu:Account management'),
      },
    ],
  },
  [DEVICE_MANAGEMENT]: {
    key: DEVICE_MANAGEMENT,
    title: i18n.t('menu:Device management'),
    SubMenus: [
      {
        key: UFO_LIST,
        name: i18n.t('menu:UFO management'),
      },
      {
        key: GUARD_AREA_LIST,
        name: i18n.t('menu:Geo-fence management'),
      },
    ],
  },
  [SYSTEM_MANAGEMENT]: {
    key: SYSTEM_MANAGEMENT,
    title: i18n.t('menu:System management'),
    SubMenus: [
      {
        key: PERM_LIST,
        name: '帳號權限管理',
      },
    ],
  },
  [ASSIST_FINDING_MANAGEMENT]: {
    key: ASSIST_FINDING_MANAGEMENT,
    title: i18n.t('menu:Finding management'),
    SubMenus: [
      {
        key: SEARCH_MISSING_LIST,
        name: i18n.t('menu:Finding management'),
      },
    ],
  },
};

class SideMenu extends PureComponent {
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

  filterMenuWithUserAuth = (func) => {
    const { permissions } = this.props;
    return checkUserAuth({ permissions, func });
  };

  render() {
    const { defaultOpenKey, pathname } = this.state;

    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`/${defaultOpenKey}/${pathname}`]}
        defaultOpenKeys={[defaultOpenKey]}
        style={{ height: '100%', borderRight: 0 }}>
        {keys(functions)
          .filter((func) => this.filterMenuWithUserAuth(func))
          .map((key) => menuRouteMap[functions[key]])
          .map((menu) => (
            <SubMenu
              key={menu.key}
              title={
                <span>
                  <Icon type="setting" />
                  {menu.title}
                </span>
              }>
              {menu.SubMenus.map((meunItem) => (
                <Menu.Item key={meunItem.key}>
                  <Link to={meunItem.key}>{meunItem.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
      </Menu>
    );
  }
}

const enhance = compose(
  connect((state) => ({
    permissions: state.auth.permissions,
  })),
  withRouter,
);

export default enhance(SideMenu);
