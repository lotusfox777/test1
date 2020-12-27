import * as React from 'react';
import * as moment from 'moment';
import { Switch, Row, Col, Modal } from 'antd';
import StyleButton from 'components/Button';
import styled from 'styled-components';
import { withI18next } from 'locales/withI18next'

const { confirm } = Modal;

const StylePanelWrap = styled.div`
  font-family: MicrosoftJhengHei;
  font-size: 14px;
  /* font-weight: bold; */
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #4a4a4a;
  padding: 14px 14px 0px 14px; //16px

  .ant-row {
    margin-bottom: 24px;
    vertical-align: middle;
  }

  .ant-row a.delete-btn {
    font-size: 14px;
    line-height: normal;
    color: #f5222d;
    line-height: 3;
    vertical-align: middle;
  }
  .ant-row a.delete-btn:hover {
    color: #f5222d;
    text-decoration: underline;
    text-decoration-color: #f5222d;
  }

  .view-date span {
    margin-right: 15px;
    display: block;
    float: left;
  }
  .view-date span:last-child {
    margin-right: 0px;
  }

  .lightblue-font {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.31;
    color: #79abe5;
  }

  .text-vertical--center {
    display: flex;
    align-items: center;
  }

  .text--greyishbrown {
    color: ${p => p.theme.greyishbrown};
  }

  label {
    font-weight: 500;
  }
`;

const StyleCardWrap = styled.div`
  div {
    padding: 2px 16px;
    border-radius: 4px;
    background-color: #f7f7f7;
    border: solid 1px #e9e9e9;
    display: inline-block;
    margin-right: 5px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
  }
`;

const gutter = {
  marginRight: '9px'
};

class ViewGuardArea extends React.PureComponent {
  handleDelete = () => {
    const { onDelete, guardArea } = this.props;
    confirm({
      title: '確認刪除守護區域?',
      onOk() {
        onDelete(guardArea.id);
      }
    });
  };

  render() {
    const {
      guardArea,
      onChangeEnable,
      onClickEdit,
      onViewRange,
      disableEdit,
      t
    } = this.props;

    const startTime = moment(guardArea.startTime);
    const endTime = moment(guardArea.endTime);

    return (
      <StylePanelWrap>
        <Row>
          <Col span={8} className="lightblue-font">
            {guardArea.name}
          </Col>
          <Col span={8}>
            {t('range')}：{' '}
            {guardArea.isSystemArea ? (
              <span className="text--greyishbrown">依系統設定</span>
            ) : (
              `${guardArea.radius}m`
            )}
          </Col>
          <Col span={8} className="text-vertical--center">
            <span style={gutter}>{t('status')}</span>
            <Switch
              checked={guardArea.guardareaEnable}
              onChange={onChangeEnable(guardArea)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>{t('available time')}</Col>
          <Col span={20} className="view-date">
            <span>
              {startTime.isValid() ? startTime.format('YYYY.MM.DD HH:mm') : '-'}
            </span>
            <span>{t('datetime-to')}</span>
            <span>
              {endTime.isValid() ? endTime.format('YYYY.MM.DD HH:mm') : '-'}
            </span>
          </Col>
        </Row>
        <Row className="text-vertical--center">
          <Col span={4}>{t('device list')}</Col>
          <Col>
            <StyleCardWrap>
              {guardArea.cards.map(c => (
                <div key={c.id}>{c.cardName}</div>
              ))}
              {guardArea.cardGroups.map(c => (
                <div key={c.id}>{c.groupName}</div>
              ))}
            </StyleCardWrap>
          </Col>
        </Row>
        <Row className="footer">
          {!guardArea.isSystemArea ? (
            <Col span={4}>
              <a onClick={this.handleDelete} className="delete-btn">
                {t('delete')}
              </a>
            </Col>
          ) : null}
          <Col
            span={guardArea.isSystemArea ? 20 : 16}
            style={{ textAlign: 'right' }}
          >
            <StyleButton
              style={gutter}
              type="white"
              text={t('view range')}
              onClick={onViewRange}
            />
            <StyleButton
              text={t('edit')}
              onClick={onClickEdit(guardArea)}
              disabled={disableEdit}
            />
          </Col>
        </Row>
      </StylePanelWrap>
    );
  }
}

export default withI18next(['all'])(ViewGuardArea)
