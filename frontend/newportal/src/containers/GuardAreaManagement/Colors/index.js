import * as React from 'react';
import styled from 'styled-components';
import { Layout, Drawer, Row, Col, Button, Select, Input, Menu, Dropdown, notification } from 'antd';
import GoogleMapComponent from 'components/GoogleMapWrapper';
import { Marker } from 'react-google-maps';
import * as fa from 'fontawesome-markers';
import { withI18next } from 'locales/withI18next'

const { Content } = Layout;

const Board = styled.div`
  width: 250px;
  position: absolute;
  top: 8px;
  left: 8px;
  background: #fff;
  padding: 20px;
  box-shadow: 3px 4px 1px 0px #cccccc;
`;

const Block = styled.div`
  height: 30px;
`;

class Colors extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markers: [{
        lat: 2.919770,
        lng: 101.657576,
        color: '#b52615'
      }, {
        lat: 2.914882,
        lng: 101.657538,
        color: '#e38141'
      }, {
        lat: 2.919554,
        lng: 101.666639,
        color: '#fac03f'
      }, {
        lat: 2.922953,
        lng: 101.661375,
        color: '#4672be'
      }, {
        lat: 2.925015,
        lng: 101.657015,
        color: '#7aa953'
      }]
    }
  }

  render() {
    const { markers } = this.state;
    return (
      <Layout>
        <Content style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
          <GoogleMapComponent>
            <Board>
              <Row gutter={[16, 16]} align="middle">
                <Col span={10}>Fever</Col>
                <Col span={14}>
                  <Block style={{background: '#b52615'}}/>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span={10}>Leave <br/>fence</Col>
                <Col span={14}>
                  <Block style={{background: '#e38141'}}/>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span={10}>Remove <br/>bracelet</Col>
                <Col span={14}>
                  <Block style={{background: '#fac03f'}}/>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span={10}>Low <br/>battery</Col>
                <Col span={14}>
                  <Block style={{background: '#4672be'}}/>
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle">
                <Col span={10}>Normal</Col>
                <Col span={14}>
                  <Block style={{background: '#7aa953'}}/>
                </Col>
              </Row>
            </Board>
            {
              markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{
                    path: fa.MAP_MARKER,
                    scale: 0.5,
                    strokeWeight: 0,
                    fillOpacity: 1,
                    fillColor: marker.color
                  }}
                />
              ))
            }
          </GoogleMapComponent>
        </Content>
      </Layout>
    );
  }
}

export default withI18next(['all'])(Colors)
