import * as React from 'react';
import { Spin, Icon, List, Row, Col } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import StyleButton from 'components/Button';
import BasicModal from './BasicModal';
import styled from 'styled-components';
import { ACTIVITY_MAP, SAVEAREA_HISTORY } from 'constants/routes';
import { Link } from 'react-router-dom';
import { withI18next } from 'locales/withI18next'

const modalTitle = {
  fontFamily: 'MicrosoftJhengHei',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#666'
};

const loadingContainer = {
  position: 'absolute',
  bottom: 40,
  width: '100%',
  textAlign: 'center'
};

const infiniteContainer = {
  borderRadius: 4,
  overflow: 'auto',
  height: 300,
  marginTop: 10,
  paddingLeft: '5%'
};

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

  span.lightred-font {
    font-size: 16px;
    font-weight: bold;
    color: #e57992;
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

const StyleModal = styled(BasicModal)`
  .ant-modal-body {
    padding-top: 0px;
  }
`;

class CurrentGuardAreas extends React.PureComponent {
  handleInfiniteOnLoad = () => {
    const { notifyHistory, loadMore } = this.props;
    if (notifyHistory.hasMore) {
      loadMore({ page: notifyHistory.page + 1 });
    }
  };

  handleViewCardLoaction = notify => () => {
    const { pushState } = this.props;
    pushState(`${ACTIVITY_MAP}?id=${notify.id}&card_id=${notify.cardSeq}`);
    this.props.onClose()
  };

  render() {
    const { notifyHistory, isLoading, onClose, t } = this.props;

    return (
      <StyleModal
        title={<span style={modalTitle}>{t('violation alerts')}</span>}
        width="55%"
        onCancel={onClose}>
        <div style={infiniteContainer}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!isLoading && notifyHistory.hasMore}
            useWindow={false}>
            <List
              split={false}
              itemLayout="horizontal"
              dataSource={notifyHistory.content}
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
                        {/* {
                          area.notifyTypeValue === 1 ? (
                            <span dangerouslySetInnerHTML={{
                              __html: t('alart-left', {
                                name: area.cardName,
                                position: area.guardareaName,
                                time: moment(area.createTime).format('YYYY.MM.DD HH:mm:ss')
                              })
                            }}/>
                          ) : area.notifyTypeValue === 2 ? (
                            <span dangerouslySetInnerHTML={{
                              __html: t('alart-sos', {
                                name: area.cardName,
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
                        } */}
                        <span>
                          <Icon type="right" />
                        </span>
                      </div>
                    </Col>
                  </StyleList>
                </ListItem>
              )}>
              {isLoading &&
                notifyHistory.hasMore && (
                  <div style={loadingContainer}>
                    <Spin />
                  </div>
                )}
            </List>
          </InfiniteScroll>
        </div>
        <div className="footer">
          <StyleButton
            onClick={onClose}
            text={<Link to={SAVEAREA_HISTORY}>{t('view violation logs')}</Link>}
            type="lightblue"
          />

        </div>
      </StyleModal>
    );
  }
}

export default withI18next(['all'])(CurrentGuardAreas);
