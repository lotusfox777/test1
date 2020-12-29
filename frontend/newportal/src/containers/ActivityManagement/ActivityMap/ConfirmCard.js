import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Row, Button, List, Col } from 'antd';
import { Marker, InfoWindow } from 'react-google-maps';
import * as fa from 'fontawesome-markers';
import { isNil } from 'ramda';

import {
  getCardDetail,
  clearCardDetail
} from 'reducers/cards';

import { API_ROOT } from 'constants/endpoint';
import { CARD_LIST } from 'constants/routes';
import { readNotify } from 'reducers/guardAreas';

const ListItem = styled(List.Item)`
  &:hover {
    background-color: #f0f5fa;
    cursor: pointer;
  }
`;

const mapStateToProps = state => ({
  cards: state.cards,
  guardAreas: state.guardAreas,
  unreadNotifyHistory: state.guardAreas.unreadNotifyHistory,
});

const mapDispatchToProps = {
  getCardDetail,
  clearCardDetail,
  readNotify,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class ConfirmCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigateToGuardAreaList: false,
      currentCardId: null
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { location } = this.props;
    if (prevProps.location.search !== location.search) {
      const params = new URLSearchParams(location.search);
      const currentId = Number(params.get('id'));
      this.setState({ currentCardId: currentId })
    }
  }

  handleMarkerClick = id => {
    this.setState({ currentCardId: id })
  };

  handleGuardAreaClick = id => {
    this.props.getGuardArea(id);
    this.setState({
      navigateToGuardAreaList: true
    });
  };

  handleActivities = id => {
    this.props.goToDetailSearch(id);
  };

  handleReadNotify = id => {
    this.props.readNotify({ id })
    this.handleMarkerClick(null)
  }

  renderInfoWindow(currentCard) {
    const { currentCardId } = this.state;

    if (currentCard.id !== currentCardId) {
      return null;
    }

    return (
      <InfoWindow onCloseClick={() => this.handleMarkerClick(null)}>
        <div style={{ width: 244 }}>
          <Row type="flex" align="middle" style={{ marginTop: 12 }}>
            <img
              alt="無照片"
              src={
                currentCard.avatar
                  ? `${API_ROOT}/v1/file/${currentCard.avatar}`
                  : '/img/avatar-pic.png'
              }
              style={{
                width: 67,
                height: 67,
                borderRadius: 40,
                marginRight: 12
              }}
            />
            <h3><Link to={`${CARD_LIST}/${currentCardId}`}>{currentCard.cardName}</Link></h3>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Button
              type="primary"
              style={{ width: '100%', backgroundColor: '#79abe5' }}
              onClick={() => this.handleActivities(currentCardId)}>
              顯示動態
            </Button>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Col span={12}>
              <Button
                type="primary"
                style={{ width: '90%', backgroundColor: '#79abe5' }}
                onClick={() => this.handleReadNotify(currentCard.id)}>
                確定
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="default"
                style={{ float: 'right', width: '90%' }}
                onClick={() => this.handleMarkerClick(null)}>
                取消
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 18 }}>
            <div style={{ marginBottom: 6 }}>守護區域</div>
            <List
              style={{ maxHeight: 200, overflowY: 'scroll' }}
              bordered
              dataSource={currentCard.guardareaList}
              renderItem={item => (
                <ListItem onClick={() => this.handleGuardAreaClick(item.id)}>
                  {item.name}
                </ListItem>
              )}
            />
          </Row>
        </div>
      </InfoWindow>
    );
  }

  render() {
    const { unreadNotifyHistory } = this.props;

    return (
      <Fragment>
        {unreadNotifyHistory.content.map((card, idx) => {
          const lat = card.latitude;
          const lng = card.longitude;

          if (card.lat && card.lng) {
            return null;
          }

          return (
            <Marker
              key={idx}
              position={{ lat, lng }}
              onClick={() => this.handleMarkerClick(card.id)}
              icon={{
                path: fa.MAP_MARKER,
                scale: 0.5,
                strokeWeight: 0,
                fillOpacity: 1,
                fillColor: '#fe2e2e'
              }}
            >
              {this.renderInfoWindow(card)}
            </Marker>
          );
        })}
      </Fragment>
    );
  }
}

export default withRouter(ConfirmCard);
