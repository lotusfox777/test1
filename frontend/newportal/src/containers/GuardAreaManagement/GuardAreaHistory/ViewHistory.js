import * as React from 'react';
import { Spin, Modal, Icon, Avatar, List, Row, Col } from 'antd';
import Image from 'components/Image';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import StyleButton from 'components/Button';
import styled from 'styled-components';
import { ACTIVITY_MAP, CARD_LIST } from 'constants/routes';
import { isNil } from 'ramda';
import { withI18next } from 'locales/withI18next'

const modalTitle = {
  fontFamily: 'MicrosoftJhengHei',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#666',
};

const loadingContainer = {
  position: 'absolute',
  bottom: 40,
  width: '100%',
  textAlign: 'center',
};

const infiniteContainer = {
  borderTop: '1px solid #d9d9d9',
  borderRadius: 4,
  overflow: 'auto',
  height: 300,
  marginTop: 20,
  paddingLeft: '5%',
};

const footer = {
  textAlign: 'right',
  marginTop: 28,
};

const button_1 = {
  marginRight: '3%',
  fontSize: 14,
};

const button_2 = {
  fontSize: 14,
};

const StyleCardInfo = styled(Row)`
  * {
    font-family: MicrosoftJhengHei;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #5a5a5a;
  }

  span {
    display: inline-block;
    margin-right: 8px;
  }

  .card-name {
    font-size: 16px;
    font-weight: bold;
    margin-right: 7px;
  }

  .card-no {
    font-family: Arial;
    font-size: 12px;
    color: #79abe5;
    margin-right: 12px;
    margin-top: 6px;
  }

  .lightblue {
    color: #79abe5;
  }

  .ant-avatar {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }

  div.guardarea-title {
    margin-right: 14px;
    display: inline-block;
  }

  .ml22 {
    margin-left: 22px;
  }

  .mr10 {
    margin-right: 10px;
  }
`;

const StyleCardWrap = styled.div`
  display: inline-block;
  div {
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 4px;
    background-color: #f7f7f7;
    border: solid 1px #e9e9e9;
    display: inline-block;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.65);
  }
`;

const StyleList = styled(Row)`
  span {
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #5a5a5a;
    display: inline-block;
    margin-right: 8px;
  }

  span.lightblue-font {
    font-size: 16px;
    font-weight: bold;
    color: #79abe5;
  }

  .area-row {
    border-bottom: 1px solid #fff;
  }

  .area-row:hover {
    cursor: pointer;
    border-bottom-color: #5a5a5a;
  }
`;

const ListItem = styled(List.Item)`
  padding-top: 18px !important;
  padding-bottom: 0px !important;
`;

class ViewHistory extends React.PureComponent {
  // TODO 查看編輯守護區域
  gotoEditModal = () => {
    const { pushState, card } = this.props;
    pushState(`${CARD_LIST}/${card.id}`);
  };

  handleViewCardLoaction = notify => () => {
    const { pushState } = this.props;
    pushState(`${ACTIVITY_MAP}?card_id=${notify.cardSeq}`);
  };

  handleInfiniteOnLoad = () => {
    const { activitiesLog, loadMore } = this.props;
    if (activitiesLog.hasMore) {
      loadMore(activitiesLog.page + 1);
    }
  };

  render() {
    const { activitiesLog, card, isLoading, guardAreas, onCancel, t } = this.props;

    return (
      <React.Fragment>
        <Modal
          title={<span style={modalTitle}>{t('violation logs')}</span>}
          visible={true}
          width="50%"
          footer={null}
          onCancel={onCancel}>
          <StyleCardInfo>
            <Col span={3} className="ml22 mr10">
              {card.avatar ? (
                <Image name={card.avatar} width="60" height="60" shape="circle" />
              ) : (
                <Avatar shape="circle" icon="user" />
              )}
            </Col>
            <Col span={19}>
              <div style={{ marginBottom: 10 }}>
                <span className="card-name">{card.cardName}</span>
                <span className="lightblue">{card.status === 1 ? t('main monitor') : null}</span>
                <div className="card-no">{card.uuid}</div>
              </div>
              <div className="guardarea-title">{t('geo-fence')}</div>
              <StyleCardWrap>
                {guardAreas.map((c, index) => (
                  <div key={`${c.id}-${index}`}>{c.name}</div>
                ))}
              </StyleCardWrap>
            </Col>
          </StyleCardInfo>
          <div style={infiniteContainer}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!isLoading && activitiesLog.hasMore}
              useWindow={false}>
              <List
                split={false}
                itemLayout="horizontal"
                dataSource={activitiesLog.content}
                loading={isLoading}
                renderItem={area => (
                  <ListItem key={area.id}>
                    <StyleList>
                      <Col>
                        <div className="area-row" onClick={this.handleViewCardLoaction(area)}>
                          {
                            area.notifyTypeValue ? (
                              <span dangerouslySetInnerHTML={{
                                __html: t(`violation-alert-${area.notifyTypeValue}`, {
                                  name: area.cardName,
                                  position: area.guardareaName ? area.guardareaName : '',
                                  time: moment(area.createTime).format('YYYY.MM.DD HH:mm:ss')
                                })
                              }}/>
                            ) : (
                              <span dangerouslySetInnerHTML={{
                                __html: t('alart-notconnected', {
                                  name: area.cardName,
                                  time: moment(area.createTime).format('YYYY.MM.DD HH:mm:ss')
                                })
                              }}/>
                            )
                          }
                          <span>
                            <Icon type="right" />
                          </span>
                          {/* <span className="lightblue-font">{area.cardName}</span> */}
                          {/* {!isNil(area.sosMessage) ? (
                            <React.Fragment>
                              <span>{t('activated SOS')}</span>
                              <span>{t('datetime-at')}</span>
                              <span>{moment(area.createTime).format('YYYY.MM.DD HH:mm:ss')}</span>
                              <span>
                                <Icon type="right" />
                              </span>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <span>{t('left fence')}</span>
                              <span>{t('datetime-at')}</span>
                              <span>{moment(area.createTime).format('YYYY.MM.DD HH:mm:ss')}</span>
                              <span className="lightblue-font">{area.guardareaName}</span>
                              <span>
                                <Icon type="right" />
                              </span>
                            </React.Fragment>
                          )} */}
                        </div>
                      </Col>
                    </StyleList>
                  </ListItem>
                )}>
                {isLoading && activitiesLog.hasMore && (
                  <div style={loadingContainer}>
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
          <div style={footer}>
            {card.status === 1 ? (
              <StyleButton
                text="查看編輯守護區域"
                type="white"
                style={button_1}
                disabled={card.type !== 1}
                onClick={this.gotoEditModal}
              />
            ) : null}
            <StyleButton style={button_2} text={t('ok')} onClick={onCancel} />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withI18next(['all'])(ViewHistory);
