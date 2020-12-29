import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Row, Button, List, Col } from 'antd';
import { find, propEq } from 'ramda';
import { Marker, InfoWindow } from 'react-google-maps';
import * as fa from 'fontawesome-markers';
import { isNil } from 'ramda';
import { withI18next } from 'locales/withI18next';

import {
  listCardsCurrentInfo,
  getCardDetail,
  clearCardDetail
} from 'reducers/cards';
import { getGuardArea, readNotify } from 'reducers/guardAreas';

import { API_ROOT, REFRESH_INTERVAL } from 'constants/endpoint';
import { SAVEAREA_LIST, CARD_LIST, ACTIVITY_MAP } from 'constants/routes';

const ListItem = styled(List.Item)`
  &:hover {
    background-color: #f0f5fa;
    cursor: pointer;
  }
`;

const mapStateToProps = state => ({
  cards: state.cards,
  guardAreas: state.guardAreas
});

const mapDispatchToProps = {
  listCardsCurrentInfo,
  getCardDetail,
  clearCardDetail,
  getGuardArea,
  readNotify
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class CardMarkers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigateToGuardAreaList: false
    };

    this.interval = null;
    this.isCardFocused = false;
  }

  handleMarkerClick = id => {
    this.props.getCardDetail(id);
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

  componentDidMount() {
    const {
      listCardsCurrentInfo,
      focusingCardMarkerId,
      onMapChange
    } = this.props;

    listCardsCurrentInfo(
      focusingCardMarkerId
        ? {
          id: focusingCardMarkerId,
          onMapChange
        }
        : {}
    );

    this.interval = setInterval(() => {
      listCardsCurrentInfo({ search: this.props.search });
    }, 1000 * REFRESH_INTERVAL);
  }

  componentDidUpdate = prevProps => {
    const { navigateToGuardAreaList } = this.state;

    const {
      history,
      onMapChange,
      focusingCardMarkerId: currentCardId,
      cards: { content },
      guardAreas: { isLoadingGuardArea }
    } = this.props;

    const { focusingCardMarkerId: prevCardId } = prevProps;

    if (!isLoadingGuardArea && navigateToGuardAreaList) {
      history.push(SAVEAREA_LIST);
    }

    if (currentCardId !== prevCardId) {
      const card = find(propEq('id', currentCardId))(content);

      if (card && card.current) {
        onMapChange({
          mapCenter: {
            lat: card.current.latitude,
            lng: card.current.longitude
          }
        });
      }
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleReadNotify = () => {
    const { location, history } = this.props;
    const params = new URLSearchParams(location.search);
    const hasId = !isNil(params.get('id'));
    if (hasId) {
      this.props.readNotify({ id: params.get('id') })
      history.push(ACTIVITY_MAP);
    }
    this.props.clearCardDetail()
  }

  renderInfoWindow(currentCardId) {
    const {
      cards: { currentCard },
      clearCardDetail,
      t
    } = this.props;

    if (!currentCard || currentCard.id !== currentCardId) {
      return null;
    }

    return (
      <InfoWindow onCloseClick={clearCardDetail}>
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
              {t('view trace')}
            </Button>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Col span={6}>
              <Button
                type="primary"
                style={{ width: '90%', backgroundColor: '#79abe5' }}
                onClick={() => this.handleReadNotify()}>
                {t('confirm')}
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                style={{ width: '90%', backgroundColor: '#79abe5' }}
                onClick={clearCardDetail}>
                {t('pending')}
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                style={{ width: '90%', backgroundColor: '#79abe5' }}
                onClick={() => this.handleReadNotify()}>
                911
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type="default"
                style={{ float: 'right', width: '90%' }}
                onClick={clearCardDetail}>
                {t('cancel')}
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
    const { cards, focusingCardMarkerId } = this.props;

    return (
      <Fragment>
        {cards.content.map((card, idx) => {
          if (!card.current) {
            return null;
          }

          const highlight = focusingCardMarkerId === card.id;
          const lat = card.current.latitude;
          const lng = card.current.longitude;

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
                fillColor: highlight ? '#fe2e2e' : card.colorCode
              }}
            >
              {this.renderInfoWindow(card.id)}
            </Marker>
          );
        })}
      </Fragment>
    );
  }
}

export default withI18next(['all'])(withRouter(CardMarkers));
