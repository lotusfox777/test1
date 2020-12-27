/* global google */
import React, { Component, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import * as fa from 'fontawesome-markers';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Circle,
  Rectangle,
  InfoWindow,
  Marker,
} from 'react-google-maps';
import { last, slice, isNil } from 'ramda';
import { notification, Button, Row, Slider } from 'antd';
import { GOOGLE_MAP_KEY, DEFAULT_MAP_CENTER } from '../constants/endpoint';

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

class GoogleMapComponent extends Component {
  static defaultProps = {
    defaultZoom: 16,
  };

  constructor(props) {
    super(props);

    this.rectangle = null;
    this.dynamicCircle = null;

    const mapCenter = props.center || DEFAULT_MAP_CENTER;

    this.state = {
      mapCenter,
      directions: null,
      rectangleOption: {
        north: mapCenter.lat + 0.003,
        south: mapCenter.lat - 0.003,
        east: mapCenter.lng + 0.003,
        west: mapCenter.lng - 0.003,
      },
      dynamicCircleOption: {
        radius: props.dynamicCircleRadius || 500,
        center: mapCenter,
        readOnly: props.readOnly,
      },
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (prevState.mapCenter !== nextProps.center && !isNil(nextProps.center)) {
      return {
        mapCenter: nextProps.center,
      };
    }

    return null;
  };

  handleRectBoundChange = () => {
    const bounds = this.rectangle.getBounds();

    this.setState({
      rectangleOption: {
        north: bounds.f.f,
        south: bounds.f.b,
        east: bounds.b.f,
        west: bounds.b.b,
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

  handleDynamicCircleRadiusChange = r => {
    const { dynamicCircleOption } = this.state;

    dynamicCircleOption.radius = r;

    this.setState(
      {
        dynamicCircleOption,
      },
      () => {
        const bounds = this.dynamicCircle.getBounds();
        this.props.searchUFOInRoundRange(bounds, dynamicCircleOption);
      },
    );
  };

  handleDynamicCircleCenterChanged = event => {
    const { dynamicCircleOption } = this.state;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    dynamicCircleOption.center = {
      lat,
      lng,
    };
    this.setState({
      dynamicCircleOption,
    });
  };

  handleDynamicCircleDragEnd = () => {
    const bounds = this.dynamicCircle.getBounds();
    this.props.searchUFOInRoundRange(bounds, this.state.dynamicCircleOption);
  };

  handleDynamicCircleConfirm = () => {
    this.props.onCircleAdd(this.state.dynamicCircleOption);
  };

  componentDidUpdate(prevProps, prevState) {
    const { routes, center, dynamicCircle } = this.props;
    const { mapCenter, dynamicCircleOption } = this.state;

    if (prevProps.routes !== routes) {
      if (routes.length === 0) {
        notification.info({
          message: '查無資料',
          description: '請選擇其他時間區段',
        });
        this.setState({
          directions: null,
        });
        return;
      }

      const start = routes[0];
      const end = last(routes);
      const config = {
        origin: new google.maps.LatLng(start.latitude, start.longitude),
        destination: new google.maps.LatLng(end.latitude, end.longitude),
        travelMode: google.maps.TravelMode.WALKING,
      };

      if (routes.length >= 3) {
        // exclude the first & the last route
        config.waypoints = slice(1, routes.length - 1, routes).map(route => {
          return {
            location: new google.maps.LatLng(route.latitude, route.longitude),
          };
        });
      }

      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route(config, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }

    if (center && (center.lat !== mapCenter.lat || center.lng !== mapCenter.lng)) {
      this.setState({
        mapCenter: center,
      });
    }

    if (dynamicCircle && dynamicCircle !== prevProps.dynamicCircle) {
      // update dynamic circle center to current map center
      const currentCenter = this.map.getCenter();
      this.setState(
        {
          dynamicCircleOption: {
            ...dynamicCircleOption,
            center: {
              lat: currentCenter.lat(),
              lng: currentCenter.lng(),
            },
          },
        },
        () => {
          // trigger first time ufo searching
          this.handleDynamicCircleDragEnd();
        },
      );
    }
  }

  renderDynamicCircle() {
    const {
      state: {
        dynamicCircleOption: { center, radius, readOnly },
      },
      props: { creatingGuardArea = false },
    } = this;
    const marks = {
      0: '中心',
      500: '500m',
      1000: '1km',
      1500: '1.5km',
      2000: '2km',
    };

    return (
      <Fragment>
        <Circle
          ref={ref => (this.dynamicCircle = ref)}
          center={center}
          radius={radius}
          options={{
            strokeWeight: 1,
            strokeColor: '#317c31',
            fillOpacity: 0,
          }}
        />
        <Marker
          draggable={!readOnly}
          onDrag={this.handleDynamicCircleCenterChanged}
          onDragEnd={this.handleDynamicCircleDragEnd}
          icon={{
            path: fa.SHIELD,
            scale: 0.5,
            strokeWeight: 0,
            fillColor: '#327d33',
            fillOpacity: 1,
          }}
          position={center}
          zIndex={10000}>
          {!readOnly && (
            <InfoWindow>
              <Fragment>
                <Slider
                  style={{ width: 300, marginLeft: 25, marginRight: 25 }}
                  marks={marks}
                  step={250}
                  defaultValue={radius}
                  min={0}
                  max={2000}
                  disabled={readOnly}
                  onChange={this.handleDynamicCircleRadiusChange}
                />
                <Row type="flex" justify="end" style={{ paddingTop: 12 }}>
                  <Button onClick={this.props.onCircleCancel}>取消</Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 12 }}
                    loading={creatingGuardArea}
                    onClick={this.handleDynamicCircleConfirm}>
                    確認
                  </Button>
                </Row>
              </Fragment>
            </InfoWindow>
          )}
        </Marker>
      </Fragment>
    );
  }

  renderCircles() {
    const { circles } = this.props;

    return (
      <Fragment>
        {circles.map((circle, idx) => {
          return (
            <Circle
              key={idx}
              center={{ lat: circle.latitude, lng: circle.longitude }}
              radius={25}
              options={{
                strokeWeight: 0,
                fillColor: '#317c31',
                fillOpacity: 0.2,
              }}
            />
          );
        })}
      </Fragment>
    );
  }

  renderRectangle() {
    const { rectangleOption } = this.state;

    return (
      <Fragment>
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
            <Button shape="circle" icon="plus" onClick={this.handleRectAdd} />
            <Button shape="circle" icon="minus" onClick={this.handleRectRemove} />
          </Row>
        </InfoWindow>
      </Fragment>
    );
  }

  render() {
    const { directions, mapCenter } = this.state;
    const { circles, rectangle, dynamicCircle, defaultZoom, onRef, ...rest } = this.props;

    return (
      <GoogleMap
        {...rest}
        ref={map => {
          this.map = map;
          if (onRef && map) {
            onRef(map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
          }
        }}
        onLoad={() => console.log(123)}
        defaultZoom={defaultZoom}
        center={mapCenter}
        options={mapOptions}
        onClick={this.handleMapClick}>
        {directions && <DirectionsRenderer directions={directions} />}
        {circles && this.renderCircles()}
        {dynamicCircle && this.renderDynamicCircle()}
        {rectangle && this.renderRectangle()}
        {this.props.children}
      </GoogleMap>
    );
  }
}

const GoogleMapWrapper = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props => <GoogleMapComponent {...props} />);

export default GoogleMapWrapper;
