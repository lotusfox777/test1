import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Tag } from 'antd';

import GoogleMapWrapper from 'components/GoogleMapWrapper';

import { Status } from 'reducers/ufos';

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MapUFOModal extends Component {
  renderInfo() {
    const { ufo } = this.props;

    return (
      <div>
        <Row style={{ marginTop: 15 }} type="flex" gutter={24}>
          <Col>
            <span style={{ marginRight: 12 }}>UFO ID</span>
            <Tag>{ufo.ufoId}</Tag>
          </Col>
          <Col>
            <span style={{ marginRight: 12 }}>座標</span>
            <Tag>{ufo.latitude}</Tag>
            <Tag>{ufo.longitude}</Tag>
          </Col>
          <Col>
            <span style={{ marginRight: 12 }}>ALIVE</span>
            <Tag>{Status[ufo.alive]}</Tag>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { ufo, onClose } = this.props;

    const center = {
      lat: ufo.latitude,
      lng: ufo.longitude
    };

    return (
      <Modal
        width="95%"
        title={`裝置管理 > UFO管理 > #${ufo.ufoId} 定位`}
        style={{ top: 20 }}
        visible={true}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        cancelText="關閉"
      >
        <Row style={{ marginTop: 10, height: 400 }}>
          <GoogleMapWrapper circles={[ufo]} center={center} />
        </Row>

        {this.renderInfo()}
      </Modal>
    );
  }
}

export default MapUFOModal;
