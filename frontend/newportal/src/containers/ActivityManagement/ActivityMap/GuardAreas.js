import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Marker, InfoWindow, Circle } from 'react-google-maps';
import * as fa from 'fontawesome-markers';
import { Row, Button, Tag } from 'antd';

import { listGuardAreas, getGuardArea, clearUfos } from 'reducers/guardAreas';

const mapStateToProps = state => ({
  guardAreas: state.guardAreas,
  users: state.users
});

const mapDispatchToProps = {
  listGuardAreas,
  getGuardArea,
  clearUfos
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class GuardAreas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentGuardAreaId: undefined
    };
  }
  // clicked Marker,to get the currentGuardArea prop, same as the byId prop
  handleClick = currentGuardAreaId => {
    this.props.getGuardArea(currentGuardAreaId);
    this.setState({
      currentGuardAreaId
    });
  };

  handleEdit = () => {
    const {
      guardAreas: { currentGuardArea },
      onEdit
    } = this.props;
    onEdit(currentGuardArea);

    this.setState({
      currentGuardAreaId: undefined
    });
  };

  handleCloseInfoWindow = () => {
    this.setState({
      currentGuardAreaId: undefined
    });
  };

  componentDidMount() {
    this.props.listGuardAreas(this.props.guardAreaType);
  }

  componentDidUpdate(prevProps) {
    const { guardAreaType } = this.props;

    if (guardAreaType !== prevProps.guardAreaType) {
      this.props.listGuardAreas(guardAreaType);
    }
  }

  componentWillUnmount() {
    this.props.clearUfos();
  }

  renderGuardAreaDetail() {
    const {
      guardAreas: { currentGuardArea },
      users: { currentUser }
    } = this.props;
    // only admin user can edit
    const disableEdit =
      currentGuardArea.isSystemArea &&
      currentUser.roles[0].name !== 'ROLE_ADMIN';
    return (
      <React.Fragment>
        <Circle
          center={{
            lat: currentGuardArea.positionLatitude,
            lng: currentGuardArea.positionLongitude
          }}
          radius={currentGuardArea.radius}
          options={{
            strokeColor: '#477400',
            fillOpacity: 0
          }}
        />
        <InfoWindow onCloseClick={this.handleCloseInfoWindow}>
          <div style={{ width: 264 }}>
            <Row>
              <h3 style={{ color: '#1e3954' }}>{currentGuardArea.name}</h3>
            </Row>
            <Row>
              {currentGuardArea.isSystemArea ? '常態守護區域' : '自訂守護區域'}
            </Row>
            {!currentGuardArea.isSystemArea && (
              <Row style={{ marginTop: 24, color: '#1e3954' }}>
                守護範圍
                {` : ${currentGuardArea.radius}m`}
              </Row>
            )}
            <div style={{ border: '1px solid #d9d9d9', margin: '10px 0' }} />
            <Row style={{ marginBottom: 12, color: '#1e3954' }}>守護名單</Row>
            <Row>
              {currentGuardArea.cards &&
                currentGuardArea.cards.map(c => (
                  <Tag key={c.id} style={{ marginBottom: 6 }}>
                    {c.cardName}
                  </Tag>
                ))}
              {currentGuardArea.cardGroups &&
                currentGuardArea.cardGroups.map(c => (
                  <Tag key={c.id} style={{ marginBottom: 6 }}>
                    {c.groupName}
                  </Tag>
                ))}
            </Row>
            <Button
              type="primary"
              style={{ width: '100%', marginTop: 18 }}
              onClick={this.handleEdit}
              disabled={disableEdit}>
              編輯
            </Button>
          </div>
        </InfoWindow>
      </React.Fragment>
    );
  }

  render() {
    const {
      guardAreas: { content }
    } = this.props;
    const { currentGuardAreaId } = this.state;

    return (
      <Fragment>
        {content.map((pos, idx) => {
          return (
            <Marker
              key={pos.name + idx}
              position={{
                lat: pos.positionLatitude,
                lng: pos.positionLongitude
              }}
              icon={{
                path: fa.HEART,
                scale: 0.5,
                strokeWeight: 0.2,
                strokeColor: 'black',
                strokeOpacity: 0.5,
                fillColor: '#477400',
                fillOpacity: 1
              }}
              onClick={() => this.handleClick(pos.id)}>
              {currentGuardAreaId === pos.id && this.renderGuardAreaDetail()}
            </Marker>
          );
        })}
      </Fragment>
    );
  }
}

export default GuardAreas;
