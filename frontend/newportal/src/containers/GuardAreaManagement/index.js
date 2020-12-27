import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { SideMenu } from 'components';
import GuardAreaList from 'containers/GuardAreaManagement/GuardAreaList/index';
import GuardAreaHistory from 'containers/GuardAreaManagement/GuardAreaHistory/index';

import styled from 'styled-components';
import { SAVEAREA_LIST, SAVEAREA_HISTORY } from 'constants/routes';
const { Content, Sider } = Layout;

const styleInnerContent = {
  backgroundColor: '#fff',
  padding: '17px 5% 1% 5%'
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
  margin: 29px 4.5% 0px;
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
  .breadcrumb {
    color: #1e3954;
  }
  .breadcrumb span {
    padding: 0px 5px;
  }
`;
export default class DeviceManagement extends PureComponent {
  renderBreadcrumb = () => {
    switch (this.props.location.pathname) {
    case SAVEAREA_LIST:
      return (
        <div className="breadcrumb">
            守護區域管理
          <span>/</span>
            守護區域清單
        </div>
      );
    case SAVEAREA_HISTORY:
      return (
        <div className="breadcrumb">
            守護區域管理
          <span>/</span>
            守護區域記錄
        </div>
      );
    default:
      return null;
    }
  };
  render() {
    return (
      <Layout>
        <StyleSider>
          <SideMenu />
        </StyleSider>
        <StyleContent>
          {this.renderBreadcrumb()}
          <div style={styleInnerContent}>
            <Switch>
              <Route path={SAVEAREA_LIST} component={GuardAreaList} />
              <Route path={SAVEAREA_HISTORY} component={GuardAreaHistory} />
            </Switch>
          </div>
        </StyleContent>
      </Layout>
    );
  }
}
