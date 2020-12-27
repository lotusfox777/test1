import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import CardList from './CardList/index';
import SubManagerList from 'containers/SubManagement/index';
import CardAuthList from 'containers/CardAuthManagement/index';
import InviteAcceptPage from './InviteAccept';
import { SideMenu } from 'components';
import styled from 'styled-components';

import { CARD_LIST, SUBMANAGER_LIST, CARDAUTHORITY_LIST, INVITE_ACCEPT } from 'constants/routes';
const { Content, Sider } = Layout;
const styleLayout = {
  overflow: 'auto',
  height: '100vh',
};
const styleInnerContent = {
  backgroundColor: '#fff',
  padding: '1% 5% 1% 5%',
  margin: '4.5% 4.5% 0px',
  marginBottom: '24px',
};

const StyleSider = styled(Sider)`
  .ant-menu li.ant-menu-item a {
    font-family: Helvetica, Arial, ‘LiHei Pro’, ‘Microsoft JhengHei’, sans-serif;
    font-family: MicrosoftJhengHei;
    font-weight: bold;
    opacity: 0.5;
    color: #ffffff;
    display: inline;
  }

  .ant-menu li.ant-menu-item:hover a,
  .ant-menu li.ant-menu-item:hover .anticon,
  .ant-menu li.ant-menu-item-selected a,
  .ant-menu li.ant-menu-item-selected .anticon,
  .ant-menu .ant-menu-submenu-title:hover,
  .ant-menu .ant-menu-submenu-title:hover .anticon {
    opacity: 1;
  }

  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon,
  .ant-menu .ant-menu-submenu-title {
    opacity: 0.5;
    color: #ffffff;
  }

  .ant-menu .ant-menu-item-selected,
  .ant-menu .ant-menu-item-active,
  .ant-menu-submenu .ant-menu-item-selected,
  .ant-menu-submenu .ant-menu-item-active,
  .ant-menu-submenu-title:hover {
    background-color: #79abe5;
  }

  .ant-layout-sider-children {
    background-color: #274664;
  }

  ul.ant-menu {
    background-color: #274664;
    height: 100vh;
  }
  .ant-menu-submenu .ant-menu {
    background: transparent;
  }
`;
const StyleContent = styled(Content)`
  * {
    font-family: ‘Microsoft JhengHei’, Helvetica, Arial, ‘LiHei Pro’, sans-serif;
    font-size: 14px;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    color: #1e3954;
  }
  .anticon {
    font-size: 23px;
    font-weight: normal;
    color: #9b9b9b;
  }
`;
export default class CardManagement extends React.Component {
  render() {
    return (
      <Layout style={styleLayout}>
        <StyleSider>
          <SideMenu />
        </StyleSider>
        <StyleContent>
          <div style={styleInnerContent}>
            <Switch>
              <Route path={`${CARD_LIST}/:id`} component={CardList} />
              <Route path={CARD_LIST} component={CardList} />
              <Route path={SUBMANAGER_LIST} component={SubManagerList} />
              <Route path={CARDAUTHORITY_LIST} component={CardAuthList} />
              <Route path={`${INVITE_ACCEPT}/:authToken`} component={InviteAcceptPage} />
            </Switch>
          </div>
        </StyleContent>
      </Layout>
    );
  }
}
