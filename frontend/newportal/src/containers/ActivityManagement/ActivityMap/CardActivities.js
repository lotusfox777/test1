import React, { Component, Fragment } from 'react';
import { find, propEq } from 'ramda';
import { connect } from 'react-redux';
import { Marker, Polyline, InfoWindow } from 'react-google-maps';
import * as fa from 'fontawesome-markers';
import { Row } from 'antd';
import { API_ROOT } from '../../../constants/endpoint';
import { Link } from 'react-router-dom';
import { CARD_LIST } from '../../../constants/routes';

const mapStateToProps = state => ({
  cards: state.cards
});

const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class CardActivities extends Component {
  constructor(props) {
    super(props);

    const card = find(propEq('id', props.cardId))(props.cards.content);

    this.state = {
      color: card ? card.colorCode : '#008844',
      cardId: card ? card.id : null,
      currentCard: card
    };
  }

  handleClick = (idx, pos) => () => {
    if (this.props.isDetailMode) {
      this.props.onFocusMarker(idx, { lat: pos.latitude, lng: pos.longitude });
    } else {
      this.props.getCardDetail(this.state.cardId);
    }
  };

  renderInfoWindow(currentCardId) {
    const {
      currentCard
    } = this.state;

    return (
      <InfoWindow>
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
            <h3><Link to={CARD_LIST}>{currentCard.cardName}</Link></h3>
          </Row>
        </div>
      </InfoWindow>
    );
  }

  render() {
    const { positions, cardId, focusedMarker } = this.props;
    const { color } = this.state;

    if (!positions) {
      return null;
    }

    return (
      <Fragment>
        {positions.map((pos, idx) => {
          const markerColor = idx === focusedMarker ? '#ff0000' : color;
          return (
            <Marker
              key={cardId + idx}
              position={{ lat: pos.latitude, lng: pos.longitude }}
              icon={{
                path: fa.MAP_MARKER,
                scale: 0.5,
                strokeWeight: 0,
                fillOpacity: 1,
                fillColor: markerColor
              }}
              onClick={this.handleClick(idx, pos)}
            >
              {idx === focusedMarker && this.renderInfoWindow()}
            </Marker>
          );
        })}
        <Polyline
          options={{
            strokeColor: color
          }}
          path={positions.map(pos => {
            return { lat: pos.latitude, lng: pos.longitude };
          })}
          onClick={this.handleClick}
        />
      </Fragment>
    );
  }
}

export default CardActivities;
