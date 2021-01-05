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
  STATUS_AND_COLOR,
} from 'constants/routes';
import { withI18next } from 'locales/withI18next'

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
      STATUS_AND_COLOR,
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
    const { t } = this.props;

    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`/${defaultOpenKey}/${pathname}`]}
        defaultOpenKeys={[defaultOpenKey]}
        style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key={menuRouteMap[CARD_MANAGEMENT].key}>
          <Icon type="user" />
          {/*點擊回列表*/}
          <Link to={CARD_LIST}>{t('main monitor list')}</Link>
        </Menu.Item>
        <Menu.Item key={menuRouteMap[SUB_MANAGEMENT].key}>
          <Icon type="team" />
          <Link to={SUBMANAGER_LIST}>{t('assisted monitor list')}</Link>
        </Menu.Item>
        <Menu.Item key={menuRouteMap[CARDAUTHORITY_MANAGEMENT].key}>
          <Icon type="solution" />
          <Link to={CARDAUTHORITY_LIST}>{t('authorization management')}</Link>
        </Menu.Item>
        <SubMenu
          key={menuRouteMap[SAVEAREA_MANAGEMENT].key}
          title={
            <span>
              <Icon type="flag" />
              {t('geo-fence management')}
            </span>
          }>
          <Menu.Item key={SAVEAREA_LIST}>
            <Link to={SAVEAREA_LIST}>{t('geo-fence list')}</Link>
          </Menu.Item>
          <Menu.Item key={SAVEAREA_HISTORY}>
            <Link to={SAVEAREA_HISTORY}>{t('violation logs')}</Link>
          </Menu.Item>
          <Menu.Item key={STATUS_AND_COLOR}>
            <Link to={STATUS_AND_COLOR}>{t('status and color')}</Link>
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
  withI18next(['all']),
);

export default enhance(SideMenu);
