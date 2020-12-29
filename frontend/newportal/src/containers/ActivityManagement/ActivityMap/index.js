import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Layout, Row, Col, Button, Select, Input, Menu, Dropdown, notification } from 'antd';
import { isNil, forEach } from 'ramda';
import {
  listUFOsInRoundRange,
  addGuardArea,
  updateGuardArea,
  clearUfos,
  listGuardAreas,
} from 'reducers/guardAreas';
import { getCardDetail, listCardsCurrentInfo } from 'reducers/cards';
import GoogleMapComponent from 'components/GoogleMapWrapper';
import { ACTIVITY_MAP } from 'constants/routes';
import { DEVICE_TYPE } from 'constants/device';
import { withDrawer } from 'drawer-context';
import cardGroupService from 'services/cardGroupService';
import GuardAreaModal from './GuardAreaModal';
import CardMarkers from './CardMarkers';
import ConfirmCard from './ConfirmCard';
import GeneralSearchDrawer from './GeneralSearchDrawer';
import DetailSearchDrawer from './DetailSearchDrawer';
import CardActivities from './CardActivities';
import GuardAreas from './GuardAreas';
import { withI18next } from 'locales/withI18next';
import { readNotify } from 'reducers/guardAreas';

const { Content } = Layout;
const { Search } = Input;

const DropdownWithBigFont = styled(Dropdown)`
  .anticon {
    font-size: 18px !important;
  }
`;

const mapStateToProps = (state) => ({
  guardAreas: state.guardAreas,
  cards: state.cards,
  unreadNotifyHistory: state.guardAreas.unreadNotifyHistory,
});

const mapDispatchToProps = {
  listUFOsInRoundRange,
  listCardsCurrentInfo,
  addGuardArea,
  updateGuardArea,
  getCardDetail,
  clearUfos,
  listGuardAreas,
  readNotify,
};

@withDrawer
@connect(mapStateToProps, mapDispatchToProps)
class ActivityMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      guardAreaModalVisible: false,
      selectingGuardCenter: false,
      currentGuardArea: undefined,
      currentCardId: undefined,
      mapCenter: undefined,
      focusedMarker: undefined,
      showGuardAreas: false,
      guardAreaType: '0',
      focusingCardMarkerId: null,
      defaultZoom: 18,
      search: null,
      needReloadGuardAreas: false,
      needUpdateMapCenter: false,
      currentStartTime: undefined,
      currentEndTime: undefined,
      currentTimeInterval: undefined,
      loadingCardGrpInfo: false,
      mapLoaded: false,
      inited: false,
    };

    this.map = null;
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const params = new URLSearchParams(nextProps.location.search);
    const hasCardId = !isNil(params.get('card_id'));
    const currentCardId = Number(params.get('card_id'));

    if (hasCardId && prevState.focusingCardMarkerId !== currentCardId) {
      return { focusingCardMarkerId: currentCardId };
    }

    return null;
  };

  componentDidMount = () => {
    const { getCardDetail } = this.props;
    const { focusingCardMarkerId } = this.state;

    if (focusingCardMarkerId) {
      getCardDetail(focusingCardMarkerId);
    }

    window.handleReadNotify = this.props.readNotify;
  };

  handleMarkers = () => {
    const { search } = this.state;
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    const hasCardId = !isNil(params.get('card_id'));

    if (!search && !hasCardId) {
      const bounds = new window.google.maps.LatLngBounds();
      forEach((x) => {
        if (!x.latitude || !x.longitude) {
          return;
        }

        bounds.extend(
          new window.google.maps.LatLng({
            lat: x.latitude,
            lng: x.longitude,
          }),
        );
      }, this.props.unreadNotifyHistory.content);
      this.map.fitBounds(bounds);
      this.setState({ mapCenter: bounds.getCenter() });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      getCardDetail,
      guardAreas: { isLoading },
      cards: {
        activities: { content },
      },
    } = this.props;
    const {
      focusingCardMarkerId,
      needReloadGuardAreas,
      guardAreaType,
      needUpdateMapCenter,
      mapLoaded,
      inited,
    } = this.state;

    if (!isLoading && needReloadGuardAreas) {
      this.setState({ needReloadGuardAreas: false });
      this.props.listGuardAreas(guardAreaType);
    }

    if (focusingCardMarkerId !== prevState.focusingCardMarkerId) {
      getCardDetail(focusingCardMarkerId);
    }

    if (
      !this.props.cards.isLoading &&
      needUpdateMapCenter &&
      content.length > 0 &&
      content[0].cardPositions.length > 0
    ) {
      this.setState({
        mapCenter: {
          lat: content[0].cardPositions[0].latitude,
          lng: content[0].cardPositions[0].longitude,
        },
        needUpdateMapCenter: false,
      });
    }

    if (!prevState.mapLoaded && mapLoaded) {
      this.handleMarkers();
      this.setState({ inited: true });
    }

    if (
      inited &&
      JSON.stringify(prevProps.unreadNotifyHistory.content) !==
        JSON.stringify(this.props.unreadNotifyHistory.content)
    ) {
      this.handleMarkers();
    }
  };

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
      positionLongitude: options.center.lng,
    });
  };

  showCardActivities = () => {
    this.props.onDrawerVisible({
      cardActivitiesVisible: true,
    });
  };

  handleMapChange = (mapOptions) => {
    this.setState({ ...mapOptions });
  };

  hideDrawer = () => {
    this.props.onDrawerVisible({
      detailDrawerVisible: false,
      cardActivitiesVisible: false,
    });
  };

  handleGuardAreaModalVisible = () => {
    this.setState({
      guardAreaModalVisible: !this.state.guardAreaModalVisible,
    });
  };

  handleSaveInfo = (currentGuardArea) => {
    if (currentGuardArea.id) {
      this.props.updateGuardArea(currentGuardArea);
      this.setState({
        currentGuardArea: undefined,
        guardAreaModalVisible: false,
        needReloadGuardAreas: true,
      });
    } else {
      this.setState({
        currentGuardArea,
        guardAreaModalVisible: false,
        selectingGuardCenter: true,
      });
    }
  };

  handleAddGuardArea = async (options) => {
    this.setState({ loadingCardGrpInfo: true });

    const { currentGuardArea } = this.state;
    const { ufosInRange } = this.props.guardAreas;

    const { cards, cardGroupSeqs } = currentGuardArea;

    const cardGroups = await cardGroupService.getCardGroups(cardGroupSeqs);

    const hasUFO = ufosInRange.length > 0;
    const hasCard = !!(
      cards.some((card) => card.deviceType === DEVICE_TYPE.Card) ||
      cardGroups.some((card) => card.deviceType === DEVICE_TYPE.Card)
    );

    if (!hasUFO && hasCard) {
      notification.warning({
        message: '設定範圍內無接收器，故守護名單無法加入卡片。',
        description: '',
        duration: 2,
      });
      return;
    }

    this.props.addGuardArea(
      Object.assign({}, currentGuardArea, {
        positionLatitude: options.center.lat,
        positionLongitude: options.center.lng,
        radius: options.radius,
        ufoSeqs: ufosInRange.map((ufo) => ufo.id),
        onCompleted: () => {
          // clear the ufos we get during creation to avoid duplicate
          this.props.clearUfos();
          this.setState({ selectingGuardCenter: false, needReloadGuardAreas: true });
        },
      }),
    );

    this.setState({ loadingCardGrpInfo: false });
  };

  handleEditGuardArea = (currentGuardArea) => {
    this.setState({
      currentGuardArea,
      guardAreaModalVisible: true,
    });
  };

  handleCardDetail = (currentCardId) => {
    this.setState(
      {
        currentCardId,
        focusedMarker: undefined,
        // needUpdateMapCenter: true
      },
      () => {
        // make sure the props being updated after state
        this.props.onDrawerVisible({
          generalDrawerVisible: false,
          detailDrawerVisible: true,
          cardActivitiesVisible: true,
        });
      },
    );
  };

  handleCancel = () => {
    this.props.clearUfos();
    this.setState({
      selectingGuardCenter: false,
      currentGuardArea: undefined,
    });
  };

  handleFocusMarker = (idx, mapCenter) => {
    this.setState({
      mapCenter,
      focusedMarker: idx,
    });
  };

  handleClearFocusMarker = () => {
    this.setState({
      focusedMarker: undefined,
    });
  };

  handleFitBounds = (bounds) => {
    this.map.fitBounds(bounds);
    this.setState({ mapCenter: bounds.getCenter() });
  };

  handleUpdateMapCenter = () => {
    this.setState({
      needUpdateMapCenter: true,
    });
  };

  handleShowGuardAreas = () => {
    this.setState({
      showGuardAreas: !this.state.showGuardAreas,
    });
  };

  handleGuardAreaType = (e) => {
    this.setState({
      showGuardAreas: true,
      guardAreaType: e.key,
    });
  };

  handleCardMarkerFocus = (focusingCardMarkerId) => {
    this.setState({ focusingCardMarkerId });
  };

  handleSearch = (keywordStr) => {
    if (keywordStr && keywordStr.trim()) {
      const { history, listCardsCurrentInfo } = this.props;
      const search = keywordStr.toLowerCase();

      this.setState({ search });
      history.push(ACTIVITY_MAP);
      listCardsCurrentInfo({
        search,
        onMapChange: this.handleMapChange,
        onMarkerFocus: this.handleCardMarkerFocus,
        onFitBounds: this.handleFitBounds,
      });
    }
  };

  handleCloseGeneralDrawer = (currentStartTime, currentEndTime, currentTimeInterval) => {
    this.setState(
      {
        currentStartTime,
        currentEndTime,
        currentTimeInterval,
      },
      () => {
        this.props.onDrawerVisible({
          generalDrawerVisible: false,
        });
      },
    );
  };

  renderControls() {
    const searchAddon = (
      <Select defaultValue="name">
        <Select.Option value="name">{this.props.t('search name')}</Select.Option>
      </Select>
    );
    const menu = (
      <Menu onClick={this.handleGuardAreaType}>
        <Menu.Item key="0">自訂</Menu.Item>
        <Menu.Item key="1">預設</Menu.Item>
        <Menu.Item key="2">全部</Menu.Item>
      </Menu>
    );

    return (
      <Row
        style={{ position: 'absolute', top: 25, right: 100, zIndex: 100 }}
        type="flex"
        gutter={16}
        justify="end">
        <Col>
          <DropdownWithBigFont overlay={menu}>
            <Button
              shape="circle"
              icon="heart"
              type="primary"
              onClick={this.handleShowGuardAreas}
            />
          </DropdownWithBigFont>
        </Col>
        <Col>
          <Button shape="circle" icon="plus" onClick={this.handleGuardAreaModalVisible} />
        </Col>
        <Col>
          <Search addonBefore={searchAddon} onSearch={this.handleSearch} />
        </Col>
      </Row>
    );
  }

  render() {
    const {
      guardAreas: { ufosInRange, isLoading },
      cards: { activities },
      generalDrawerVisible,
      detailDrawerVisible,
      cardActivitiesVisible,
      location,
    } = this.props;
    const {
      guardAreaModalVisible,
      selectingGuardCenter,
      currentCardId,
      mapCenter,
      focusedMarker,
      showGuardAreas,
      guardAreaType,
      currentGuardArea,
      focusingCardMarkerId,
      defaultZoom,
      search,
      currentStartTime,
      currentEndTime,
      currentTimeInterval,
      loadingCardGrpInfo,
    } = this.state;

    const showRealtimeInfo = !guardAreaModalVisible && !cardActivitiesVisible;
    const params = new URLSearchParams(location.search);
    const hasCardId = !isNil(params.get('card_id'));

    return (
      <Layout>
        {/* height = 100vh - header height (AppHeader.js) */}
        <Content style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
          {this.renderControls()}
          {generalDrawerVisible && (
            <GeneralSearchDrawer
              onFitBounds={this.handleFitBounds}
              onSearchStart={this.showCardActivities}
              onSearchFinished={this.handleCloseGeneralDrawer}
              onClose={this.handleCloseGeneralDrawer}
            />
          )}
          {detailDrawerVisible && (
            <DetailSearchDrawer
              currentCardId={currentCardId}
              clearFocusMarker={this.handleClearFocusMarker}
              updateMapCenter={this.handleUpdateMapCenter}
              onFocusMarker={this.handleFocusMarker}
              onClose={this.hideDrawer}
              focusedMarker={focusedMarker}
              defaultStartTime={currentStartTime}
              defaultEndTime={currentEndTime}
              defaultTimeInterval={currentTimeInterval}
            />
          )}
          <GoogleMapComponent
            onRef={(map) => {
              this.map = map;
              this.setState({ mapLoaded: true });
            }}
            center={mapCenter}
            dynamicCircle={selectingGuardCenter}
            creatingGuardArea={loadingCardGrpInfo || isLoading}
            circles={ufosInRange}
            defaultZoom={defaultZoom}
            searchUFOInRoundRange={this.searchUFOs}
            onCircleAdd={this.handleAddGuardArea}
            onCircleCancel={this.handleCancel}>
            {showRealtimeInfo && (
              <CardMarkers
                goToDetailSearch={this.handleCardDetail}
                onMapChange={this.handleMapChange}
                focusingCardMarkerId={focusingCardMarkerId}
                search={search}
              />
            )}
            {
              // hasCardId || search ? (
              //   showRealtimeInfo && (
              //     <CardMarkers
              //       goToDetailSearch={this.handleCardDetail}
              //       onMapChange={this.handleMapChange}
              //       focusingCardMarkerId={focusingCardMarkerId}
              //       search={search}
              //     />
              //   )
              // ) : <ConfirmCard goToDetailSearch={this.handleCardDetail}/>
            }
            {cardActivitiesVisible &&
              activities.content.map((act) => (
                <CardActivities
                  key={act.id}
                  cardId={act.id}
                  positions={act.cardPositions}
                  getCardDetail={this.handleCardDetail}
                  focusedMarker={focusedMarker}
                  isDetailMode={detailDrawerVisible}
                  onFocusMarker={this.handleFocusMarker}
                />
              ))}
            {showGuardAreas && (
              <GuardAreas guardAreaType={guardAreaType} onEdit={this.handleEditGuardArea} />
            )}
          </GoogleMapComponent>
          {guardAreaModalVisible && (
            <GuardAreaModal
              currentGuardArea={currentGuardArea}
              onSave={this.handleSaveInfo}
              onClose={this.handleGuardAreaModalVisible}
            />
          )}
        </Content>
      </Layout>
    );
  }
}

export default withI18next()(ActivityMap);
