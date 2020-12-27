import React, { Component, Fragment } from 'react';
import { Row } from 'antd';
import { connect } from 'react-redux';
import { Marker, Polyline, InfoWindow } from 'react-google-maps';
import { withIcon } from '../marker-context';

const mapStateToProps = state => ({
  cards: state.cards,
});

const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@withIcon
class CardActivities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#008844',
    };
  }

  renderInfoWindow(card) {
    return (
      <InfoWindow>
        <div style={{ width: 244 }}>
          <Row type="flex" align="middle" style={{ marginTop: 12 }}>
            <h3>
              {card.latitude}, {card.longitude}
            </h3>
          </Row>
        </div>
      </InfoWindow>
    );
  }

  render() {
    const { positions, fa, focusedMarker } = this.props;
    const { color } = this.state;

    if (!positions) {
      return null;
    }

    return (
      <Fragment>
        {positions.map((pos, idx) => {
          return (
            <Marker
              key={idx}
              position={{ lat: pos.latitude, lng: pos.longitude }}
              icon={{
                path: fa.MAP_MARKER,
                scale: 0.5,
                strokeWeight: 0,
                fillOpacity: 1,
                fillColor: color,
              }}>
              {pos.id === focusedMarker && this.renderInfoWindow(pos)}
            </Marker>
          );
        })}
        <Polyline
          options={{
            strokeColor: color,
          }}
          path={positions.map(pos => {
            return { lat: pos.latitude, lng: pos.longitude };
          })}
        />
      </Fragment>
    );
  }
}

export default CardActivities;
