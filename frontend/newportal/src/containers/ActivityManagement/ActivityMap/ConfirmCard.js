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
import { CARD_LIST, ACTIVITY_MAP } from 'constants/routes';
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

  handleMarkerClick = card => {
    const { history } = this.props;
    history.push(`${ACTIVITY_MAP}?id=${card.id}&card_id=${card.cardSeq}`);
  };

  render() {
    const { unreadNotifyHistory } = this.props;

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
                fillColor: '#fe2e2e'
              }}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default withRouter(ConfirmCard);
