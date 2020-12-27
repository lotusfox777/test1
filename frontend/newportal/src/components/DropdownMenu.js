import * as React from 'react';
import { withI18next } from 'locales/withI18next'

import styled from 'styled-components';
const Styled = styled.div`
	font-family: MicrosoftJhengHei;
	text-align: center;
	a:hover {
		font-family: MicrosoftJhengHei;
		font-size: 14px;
		font-weight: bold;
		color: #108ee9;
	}

	a {
		font-family: MicrosoftJhengHei;
		font-size: 14px;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.45);
	}
`;
class Content extends React.Component {
  render() {
    const { showAccountModal, logout, t } = this.props;
    return (
      <Styled>
        <div>
          <a onClick={showAccountModal}>{t('account')}</a>
        </div>
        <div style={{ marginTop: 13 }}>
          <a onClick={logout}>{t('logout')}</a>
        </div>
      </Styled>
    );
  }
}

export default withI18next(['all'])(Content);
