import React from 'react';
import { Modal } from 'antd';
import { rgba } from 'polished';
import { Marker, InfoWindow } from 'react-google-maps';
import GoogleMap from 'components/GoogleMapWrapper';
import useVisible from './useVisible';

export default function GooleMapModal({ width, title, onCancel, item }) {
  const [infoWindowVisible, handleInfoWindowVisible] = useVisible();

  const position = {
    lat: item.lastLat,
    lng: item.lastLng,
  };

  return (
    <Modal
      visible
      width="95%"
      title={title}
      maskStyle={{ background: rgba(0, 0, 0, 0.9) }}
      maskClosable={false}
      style={{ top: 30 }}
      bodyStyle={{ padding: 0 }}
      footer={false}
      onCancel={onCancel}>
      <div css={{ height: '92vh' }}>
        <GoogleMap center={position} options={{ fullscreenControl: false }}>
          <Marker
            position={position}
            onClick={handleInfoWindowVisible}
            title={`${item.lastLat}, ${item.lastLng}`}>
            {infoWindowVisible && (
              <InfoWindow onCloseClick={handleInfoWindowVisible}>
                <div>
                  {item.lastLat}, {item.lastLng}
                </div>
              </InfoWindow>
            )}
          </Marker>
        </GoogleMap>
      </div>
    </Modal>
  );
}
