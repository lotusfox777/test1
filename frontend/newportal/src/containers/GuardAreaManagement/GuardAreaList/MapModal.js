import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Button, notification } from 'antd';

import GoogleMapWrapper from 'components/GoogleMapWrapper';

import { listUFOsInRoundRange, updateGuardArea } from 'reducers/guardAreas';

const mapStateToProps = state => ({
  guardAreas: state.guardAreas
});

const mapDispatchToProps = {
  listUFOsInRoundRange,
  updateGuardArea
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MapModal extends Component {
  constructor(props) {
    super(props);

    const id = String(Object.keys(props.guardAreas.byId)[0]);
    const mapCenter = {
      lat: props.guardAreas.byId[id].positionLatitude,
      lng: props.guardAreas.byId[id].positionLongitude
    };
    this.state = {
      mapCenter,
      currentGuardArea: props.guardAreas.byId[id],
      updatingGuardArea: false
    };
  }

  searchUFOs = (bounds, options) => {
    const rightUpLat = bounds.getNorthEast().lat();
    const rightUpLong = bounds.getNorthEast().lng();
    const leftLowLat = bounds.getSouthWest().lat();
    const leftLowLong = bounds.getSouthWest().lng();
    this.props.listUFOsInRoundRange({
      leftLatitude: rightUpLat,
      leftLongitude: leftLowLong,
      rightLatitude: leftLowLat,
      rightLongitude: rightUpLong,
      radius: options.radius,
      positionLatitude: options.center.lat,
      positionLongitude: options.center.lng
    });
  };

  handleUpdateGuardArea = options => {
    const { currentGuardArea } = this.state;
    const {
      ufosInRange
    } = this.props.guardAreas;

    if (ufosInRange.length === 0) {
      notification.warning({
        message: '請圈選至少一個UFO',
        description: '',
        duration: 2
      });
      return;
    }
    const ufoSeqs = ufosInRange.map(ufo => ufo.id);
    this.props.updateGuardArea(
      Object.assign({}, currentGuardArea, {
        positionLatitude: options.center.lat,
        positionLongitude: options.center.lng,
        radius: options.radius,
        ufoSeqs
      })
    );

    this.setState({
      updatingGuardArea: true
    });
  };

  componentDidUpdate(prevProps) {
    const {
      guardAreas: { isLoading }
    } = this.props;
    const { updatingGuardArea } = this.state;

    if (updatingGuardArea && !isLoading) {
      this.props.onClose();
    }
  }

  render() {
    const { onClose, readOnly, guardAreas: {ufosInRange} } = this.props;
    const {
      mapCenter,
      currentGuardArea: { radius }
    } = this.state;

    const footer = [
      <Button key="btn-close" onClick={onClose}>
        關閉
      </Button>
    ];

    return (
      <Modal
        width="75%"
        visible={true}
        maskClosable={false}
        keyboard={false}
        onCancel={onClose}
        footer={footer}
      >
        <Row style={{ marginTop: 10, height: 600 }}>
          <GoogleMapWrapper
            center={mapCenter}
            dynamicCircle={true}
            dynamicCircleRadius={radius}
            circles={ufosInRange}
            searchUFOInRoundRange={this.searchUFOs}
            onCircleAdd={this.handleUpdateGuardArea}
            onCircleCancel={this.props.onClose}
            readOnly={readOnly}
          />
        </Row>
      </Modal>
    );
  }
}

export default MapModal;
