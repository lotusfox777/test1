import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Marker } from 'react-google-maps';
import * as fa from 'fontawesome-markers';
// import { forEach } from 'ramda';

import {
  getCardDetail,
  clearCardDetail
} from 'reducers/cards';

import { ACTIVITY_MAP } from 'constants/routes';

const mapStateToProps = state => ({
  cards: state.cards,
  guardAreas: state.guardAreas,
  unreadNotifyHistory: state.guardAreas.unreadNotifyHistory,
});

const mapDispatchToProps = {
  getCardDetail,
  clearCardDetail,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class AllMarkers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigateToGuardAreaList: false,
      currentCardId: null
    }
  }

  // componentDidUpdate = prevProps => {
  //   if (
  //     JSON.stringify(prevProps.unreadNotifyHistory.content) !==
  //     JSON.stringify(this.props.unreadNotifyHistory.content)
  //   ) {
  //     const { onMapChange } = this.props;
  //     const bounds = new window.google.maps.LatLngBounds();
  //     forEach((x) => {
  //       if (!x.latitude || !x.longitude) {
  //         return;
  //       }
  //       bounds.extend(
  //         new window.google.maps.LatLng({
  //           lat: x.latitude,
  //           lng: x.longitude,
  //         }),
  //       );
  //     }, this.props.unreadNotifyHistory.content);
  //     onMapChange({ mapCenter: bounds.getCenter() })
  //   }
  // };

  handleMarkerClick = card => {
    const { history } = this.props;
    history.push(`${ACTIVITY_MAP}?id=${card.id}&card_id=${card.cardSeq}`);
  };

  render() {
    const { unreadNotifyHistory } = this.props;

    const handleMarkerColor = status => (
      status === 4 ? '#f6b141' : status === 5 || status === 1 ? '#84be70' : status === 6 ? '#fc7f80' : '#fe2e2e'
    )

    return (
      <Fragment>
        {unreadNotifyHistory.content.map((card, idx) => {
          const lat = card.latitude;
          const lng = card.longitude;

          if (!lat || !lng) {
            return null
          }

          return (
            <Marker
              key={idx}
              position={{ lat, lng }}
              onClick={() => this.handleMarkerClick(card)}
              icon={{
                path: fa.MAP_MARKER,
                scale: 0.5,
                strokeWeight: 0,
                fillOpacity: 1,
                fillColor: handleMarkerColor(card.notifyTypeValue)
              }}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default withRouter(AllMarkers);
