import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { SideMenu } from 'components';
import GuardAreaList from 'containers/GuardAreaManagement/GuardAreaList/index';
import GuardAreaHistory from 'containers/GuardAreaManagement/GuardAreaHistory/index';
import Colors from 'containers/GuardAreaManagement/Colors/index';
import { withI18next } from 'locales/withI18next'

import styled from 'styled-components';
import { SAVEAREA_LIST, SAVEAREA_HISTORY, STATUS_AND_COLOR } from 'constants/routes';
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
class DeviceManagement extends PureComponent {
  renderBreadcrumb = () => {
    const { t } = this.props
    switch (this.props.location.pathname) {
    case SAVEAREA_LIST:
      return (
        <div className="breadcrumb">
            {t('geo-fence management')}
          <span>/</span>
            {t('geo-fence list')}
        </div>
      );
    case SAVEAREA_HISTORY:
      return (
        <div className="breadcrumb">
          {t('geo-fence management')}
          <span>/</span>
          {t('violation logs')}
        </div>
      );
    default:
      return null;
    }
  };
  render() {
    const {
      history: {
        location: { pathname },
      },
    } = this.props;

    return (
      <Layout>
        <StyleSider width="360">
          <SideMenu />
        </StyleSider>
        <StyleContent className={pathname === '/guardarea-management/colors' ? 'mt-0 mb-0 ml-0 mr-0' : ''}>
          {this.renderBreadcrumb()}
          <div style={styleInnerContent} className={pathname === '/guardarea-management/colors' ? 'pt-0 pb-0 pl-0 pr-0' : ''}>
            <Switch>
              <Route path={SAVEAREA_LIST} component={GuardAreaList} />
              <Route path={SAVEAREA_HISTORY} component={GuardAreaHistory} />
              <Route path={STATUS_AND_COLOR} component={Colors} />
            </Switch>
          </div>
        </StyleContent>
      </Layout>
    );
  }
}
export default withI18next(['all'])(DeviceManagement)
