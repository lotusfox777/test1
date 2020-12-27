import * as React from 'react';
import { Spin, Icon, List, Row, Col } from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import StyleButton from 'components/Button';
import BasicModal from './BasicModal';
import styled from 'styled-components';
import { ACTIVITY_MAP, SAVEAREA_HISTORY } from 'constants/routes';
import { Link } from 'react-router-dom';

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
    pushState(`${ACTIVITY_MAP}?card_id=${notify.cardSeq}`);
  };

  render() {
    const { notifyHistory, isLoading, onClose } = this.props;

    return (
      <StyleModal
        title={<span style={modalTitle}>即時守護通知</span>}
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
                        <span className="lightblue-font">{area.cardName}</span>
                        於
                        <span>
                          {moment(area.createTime).format(
                            'YYYY.MM.DD HH:mm:ss'
                          )}
                        </span>
                        {area.sos ? (
                          <React.Fragment>
                            <span>發出求救訊息</span>
                            <span className="lightred-font">
                              {area.sosMessage}
                            </span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <span>離開了守護區域</span>
                            <span className="lightblue-font">
                              {area.guardareaName}
                            </span>
                          </React.Fragment>
                        )}
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
            text={<Link to={SAVEAREA_HISTORY}>查看守護紀錄</Link>}
            type="lightblue"
          />

        </div>
      </StyleModal>
    );
  }
}

export default CurrentGuardAreas;
