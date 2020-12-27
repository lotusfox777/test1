import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Circle,
  Rectangle,
  InfoWindow,
} from 'react-google-maps';
import { Button, Row } from 'antd';
import { withIcon } from '../marker-context';
import { GOOGLE_MAP_KEY, DEFAULT_MAP_CENTER } from '../constants/endpoint';

class GoogleMapComponent extends Component {
  constructor(props) {
    super(props);

    this.rectangle = null;

    const defaultCenter = props.center || DEFAULT_MAP_CENTER;

    this.state = {
      defaultCenter,
      mapCenter: defaultCenter,
      directions: null,
      rectangleOption: {
        north: defaultCenter.lat + 0.003,
        south: defaultCenter.lat - 0.003,
        east: defaultCenter.lng + 0.003,
        west: defaultCenter.lng - 0.003,
      },
    };
  }

  handleRectBoundChange = () => {
    const bounds = this.rectangle.getBounds();

    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    this.setState({
      rectangleOption: {
        north: northEast.lat(),
        south: southWest.lat(),
        east: northEast.lng(),
        west: southWest.lng(),
      },
    });
  };

  handleRectAdd = () => {
    const { rectangleOption } = this.state;

    this.props.onAddClick(rectangleOption);
  };

  handleRectRemove = () => {
    const { rectangleOption } = this.state;

    this.props.onRemoveClick(rectangleOption);
  };

  handleMapClick = e => {
    if (this.props.onMapClick) {
      this.props.onMapClick(e.latLng.lat(), e.latLng.lng());
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { center } = this.props;
    const { mapCenter } = this.state;

    if (
      center &&
      (center.lat !== mapCenter.lat || center.lng !== mapCenter.lng)
    ) {
      this.setState({
        mapCenter: center,
      });
    }
  }

  render() {
    const { directions, rectangleOption, mapCenter } = this.state;
    const {
      circles,
      rectangle,
      children,
      options,
      onRef,
      ...rest
    } = this.props;

    return (
      <GoogleMap
        {...rest}
        ref={map => {
          if (onRef && map) {
            onRef(map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
          }
        }}
        defaultZoom={16}
        center={mapCenter}
        options={{ ...mapOptions, ...options }}
        onClick={this.handleMapClick}>
        {children}
        {directions && <DirectionsRenderer directions={directions} />}
        {circles &&
          circles.map((circle, idx) => {
            return (
              <Circle
                key={idx}
                center={{ lat: circle.latitude, lng: circle.longitude }}
                radius={50}
                options={{
                  strokeWeight: 0,
                  fillColor: '#aadafe',
                  fillOpacity: 0.7,
                }}
              />
            );
          })}
        {rectangle && (
          <div>
            <Rectangle
              ref={ref => (this.rectangle = ref)}
              bounds={{
                north: rectangleOption.north,
                south: rectangleOption.south,
                east: rectangleOption.east,
                west: rectangleOption.west,
              }}
              draggable={true}
              editable={true}
              options={{
                strokeColor: '#f77b7b',
                strokeOpacity: 0.5,
                fillColor: '#f77b7b',
                fillOpacity: 0.2,
              }}
              onBoundsChanged={this.handleRectBoundChange}
            />
            {/* todo: disable info window close button*/}
            <InfoWindow
              position={{
                lat: rectangleOption.north,
                lng: rectangleOption.east,
              }}>
              <Row>
                <Button
                  shape="circle"
                  icon="plus"
                  onClick={this.handleRectAdd}
                />
                <Button
                  shape="circle"
                  icon="minus"
                  onClick={this.handleRectRemove}
                />
              </Row>
            </InfoWindow>
          </div>
        )}
      </GoogleMap>
    );
  }
}

const mapOptions = {
  styles: [
    {
      featureType: 'administrative',
      elementType: 'all',
      stylers: [
        {
          saturation: '-100',
        },
      ],
    },
    {
      featureType: 'administrative.province',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 65,
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: '50',
        },
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          saturation: '-100',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'all',
      stylers: [
        {
          lightness: '30',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'all',
      stylers: [
        {
          lightness: '40',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          saturation: -100,
        },
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          hue: '#ffff00',
        },
        {
          lightness: -25,
        },
        {
          saturation: -97,
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels',
      stylers: [
        {
          lightness: -25,
        },
        {
          saturation: -100,
        },
      ],
    },
  ],
};

const GoogleMapWrapper = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withIcon,
  withScriptjs,
  withGoogleMap,
)(props => <GoogleMapComponent {...props} />);

export default GoogleMapWrapper;
