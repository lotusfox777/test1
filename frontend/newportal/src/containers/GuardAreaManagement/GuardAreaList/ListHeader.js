import * as React from 'react';
import { Row, Col } from 'antd';

import styled from 'styled-components';

const StylePanelHeader = styled(Row)`
  font-family: MicrosoftJhengHei;
  font-size: 14px;
  /* font-weight: bold; */
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  padding-left: 20px;

  .lightblue-font {
    font-size: 14px;
    /* font-weight: bold; */
    line-height: 1.31;
    color: #79abe5;
  }

  .is-disable {
    color: #d9d9d9;
  }
`;

class ListHeader extends React.Component {
  render() {
    const guardArea = this.props.guardArea;

    return (
      <StylePanelHeader>
        <Col span={8}>{guardArea.name}</Col>
        <Col span={8} style={{ fontSize: 12, fontWeight: 'normal' }}>
          {guardArea.radius ? `${guardArea.radius}m` : '-'}
        </Col>
        <Col
          span={4}
          className={
            guardArea.guardareaEnable ? 'lightblue-font' : 'is-disable'
          }>
          {guardArea.guardareaEnable ? '啟用' : '停用'}
        </Col>
      </StylePanelHeader>
    );
  }
}

export default ListHeader;
