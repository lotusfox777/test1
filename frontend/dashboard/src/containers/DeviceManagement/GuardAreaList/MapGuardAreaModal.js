import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uniqBy, filter, findIndex, propEq } from 'ramda';
import { Modal, Form, Row, Button, notification } from 'antd';
import { Marker } from 'react-google-maps';
import GoogleMapWrapper from 'components/GoogleMapWrapper';
import { addGuardArea, listUFOsInRange } from 'reducers/guardAreas';
import { withIcon } from 'marker-context';

const confirm = Modal.confirm;

const mapStateToProps = state => ({
  guardAreas: state.guardAreas,
});

const mapDispatchToProps = {
  addGuardArea,
  listUFOsInRange,
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@withIcon
class MapGuardAreaModal extends Component {
  constructor(props) {
    super(props);

    let tempCenter;

    if (props.guardArea) {
      tempCenter = {
        lat: props.guardArea.positionLatitude,
        lng: props.guardArea.positionLongitude,
      };
    }
    this.state = {
      gettingUFOs: false,
      ufos: props.ufos || [],
      action: '',
      waittingForCenter: false,
      tempCenter,
      isViewMode: props.isViewMode,
    };
  }

  filterDuplicatedUFOs = selectedUFOs => {
    const { action, ufos } = this.state;

    if (action === 'add') {
      return uniqBy(item => item.ufoId, selectedUFOs.concat(ufos));
    } else if (action === 'remove') {
      // ufos: [{1}, {2}, {3}]
      // selectedUFOs: [{2}]
      // newUFOs: [{1}, {3}]
      const newUFOs = filter(ufo => {
        return findIndex(propEq('ufoId', ufo.ufoId), selectedUFOs) === -1;
      }, ufos);
      return newUFOs;
    }
  };

  handleListAreaUfos = (coordinates, action) => {
    const range = {
      leftLatitude: coordinates.north,
      leftLongitude: coordinates.west,
      rightLatitude: coordinates.south,
      rightLongitude: coordinates.east,
    };

    this.setState({
      gettingUFOs: true,
      action,
    });
    this.props.listUFOsInRange(range);
  };

  handleConfirm = () => {
    if (this.state.isViewMode) {
      // 從查看模式進入編輯模式
      this.setState({
        isViewMode: false,
      });
      return;
    }

    this.setState({
      waittingForCenter: true,
    });

    notification.info({
      message: '請點選畫面設定系統守護區域中心',
      description: '',
      duration: 0,
      placement: 'bottomRight',
    });
  };

  handleSave = (lat, lng) => {
    const { onOk, onClose } = this.props;
    const { ufos } = this.state;

    this.setState(
      {
        tempCenter: {
          lat,
          lng,
        },
      },
      () => {
        confirm({
          title: '確定設定此中心點?',
          onOk() {
            notification.destroy();
            const ufoSeqs = ufos.map(ufo => ufo.id);
            onOk(ufoSeqs, lat, lng);
            onClose();
          },
        });
      },
    );
  };

  componentDidUpdate(prevProps) {
    const {
      guardAreas: { isLoading, ufosInRange },
    } = this.props;
    const { gettingUFOs } = this.state;

    if (gettingUFOs && !isLoading) {
      this.setState({
        gettingUFOs: false,
        ufos: this.filterDuplicatedUFOs(ufosInRange),
      });
    }
  }

  render() {
    const { onClose, guardArea, title, fa } = this.props;
    const { ufos, waittingForCenter, tempCenter, isViewMode } = this.state;

    const footer = [
      <Button key="close" onClick={onClose}>
        取消
      </Button>,
      <Button key="confirm" type="primary" onClick={this.handleConfirm}>
        {isViewMode ? '編輯範圍' : '確認範圍'}
      </Button>,
    ];

    let defaultCenter;

    if (guardArea) {
      defaultCenter = {
        lat: parseFloat(guardArea.positionLatitude.toFixed(6)),
        lng: parseFloat(guardArea.positionLongitude.toFixed(6)),
      };
    }

    const mapProps = {
      circles: ufos,
      center: defaultCenter,
    };

    if (!isViewMode) {
      mapProps.rectangle = !waittingForCenter;
      mapProps.onAddClick = val => this.handleListAreaUfos(val, 'add');
      mapProps.onRemoveClick = val => this.handleListAreaUfos(val, 'remove');
      mapProps.onMapClick = waittingForCenter ? this.handleSave : null;
    }

    return (
      <Modal
        width="95%"
        title={`裝置管理 > 守護區域管理 > ${title}`}
        style={{ top: 20 }}
        visible={true}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        footer={waittingForCenter ? null : footer}>
        <Row style={{ marginTop: 10, height: 650 }}>
          <GoogleMapWrapper {...mapProps}>
            {tempCenter && (
              <Marker
                position={tempCenter}
                icon={{
                  path: fa.HEART,
                  scale: 0.5,
                  strokeWeight: 0.2,
                  strokeColor: 'black',
                  strokeOpacity: 0.5,
                  fillColor: '#477400',
                  fillOpacity: 1,
                }}
              />
            )}
          </GoogleMapWrapper>
        </Row>
      </Modal>
    );
  }
}

export default MapGuardAreaModal;
