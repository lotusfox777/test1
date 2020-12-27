import React, { PureComponent } from 'react';
import { Spin, Icon, Layout } from 'antd';

export default class OAuth extends PureComponent {
  state = {
    opener: window.opener ? true : false,
  };

  componentDidMount = () => {
    if (window.opener) {
      window.opener.postMessage({ lineOAuthSuccess: true }, window.location.origin);
      window.close();
    }
  };

  render() {
    return this.state.opener ? (
      <Spin
        spinning
        style={{ color: 'black', marginTop: '30px' }}
        indicator={<Icon type="loading-3-quarters" spin theme="outlined" />}>
        <Layout>
          <Layout.Content />
        </Layout>
      </Spin>
    ) : (
      <a href="/">請回首頁</a>
    );
  }
}
