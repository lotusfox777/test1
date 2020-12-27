import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './Login/index';
import Register from './Register/index';
import RegisterActivePage from './RegisterActive/index';
import Forgotpassword from './Restpass/index';
import { LOGIN_PAGE, REGISTER, REGISTER_ACTIVE, RESETPASS } from 'constants/routes';
import styled from 'styled-components';
import moment from 'moment';

const { Content, Footer } = Layout;
const StyleLayout = styled(Layout)`
  background-image: url('/img/main_bg.png');
  min-height: 100vh;

  #content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #content #inner {
    background-color: rgb(121, 171, 229, 0.5);
    padding: 69px 0 78px 0px;
    border-radius: 5px;
    width: 70%;
    max-width: 1000px;
    min-width: 750px;
    max-height: 655px;
  }

  #footer {
    font-family: 'Microsoft JhengHei', 'LiHei Pro', Helvetica, Arial, sans-serif;
    font-size: 10px;
    color: #fff;
    padding: 10px 0px;
    text-align: center;
    background-color: #1e3954;
    height: 36px;
  }
`;
const siderStyle = {
  height: 562,
  borderRight: '1px solid #1e3954',
  textAlign: 'center',
  width: '24%',
  minWidth: 180,
  maxWidth: 247,
  float: 'left',
};
const contrStyle = {
  width: '76%',
  maxWidth: 753,
  float: 'left',
};
export default class Auth extends React.Component {
  render() {
    return (
      <StyleLayout>
        <Content id="content">
          <div id="inner">
            <div style={siderStyle}>
              <img
                style={{ width: 160, height: 55 }}
                src="/img/logo-lg@2x.png"
                srcSet="/img/logo-lg@2x.png 2x,/img/logo-lg@3x.png 3x"
                alt="Dplus"
              />
            </div>
            <div style={contrStyle}>
              <Switch>
                <Route exact path="/" component={Login} />
                <Route path={LOGIN_PAGE} component={Login} />
                <Route path={REGISTER} component={Register} />
                <Route path={`${RESETPASS}/:subPath`} component={Forgotpassword} />
                <Route path={`${REGISTER_ACTIVE}/:subPath`} component={RegisterActivePage} />
                <Route component={Login} />
              </Switch>
            </div>
          </div>
        </Content>
        <Footer id="footer">Copyright &copy; {moment().year()} All Rights Reserved.</Footer>
      </StyleLayout>
    );
  }
}
