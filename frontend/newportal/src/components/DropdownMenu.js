import * as React from 'react';

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
    const { showAccountModal, logout } = this.props;
    return (
      <Styled>
        <div>
          <a onClick={showAccountModal}>帳戶管理</a>
        </div>
        <div style={{ marginTop: 13 }}>
          <a onClick={logout}>登出</a>
        </div>
      </Styled>
    );
  }
}

export default Content;
