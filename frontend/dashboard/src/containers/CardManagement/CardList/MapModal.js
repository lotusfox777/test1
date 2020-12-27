import React, { PureComponent } from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { Modal, Form, DatePicker, Row, Col, Button, Table, Select } from 'antd';
import GoogleMapWrapper from 'components/GoogleMapWrapper';
import CardActivities from 'components/CardActivities';
import { listCardActivities, clearCardActivities } from 'reducers/cards';
import { padStart } from 'utils/webHelper';
import { exportToCSV } from 'utils/downloadFile';
import { BLOCK_CHAIN_SERVICE } from 'constants/endpoint';

const styles = {
  select: {
    width: '50%',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
};

const { Option } = Select;

const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;

const mapStateToProps = state => ({
  cards: state.cards,
});

const mapDispatchToProps = {
  listCardActivities,
  clearCardActivities,
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class MapModal extends PureComponent {
  constructor(props) {
    super(props);

    const { cardId, chainUuid } = this.props.card;
    const url = `${BLOCK_CHAIN_SERVICE}/${cardId}/${chainUuid}`;

    this.state = {
      currentPage: 1,
      isSearching: false,
      blockChainLog: url,
      mapCenter: undefined,
      focusedMarker: undefined,
    };

    this.map = null;
  }

  loadCardActivities = page => {
    const {
      card,
      form: { validateFields },
      listCardActivities,
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      listCardActivities({
        body: {
          id: card.id,
          startTime: moment(values.startTime).valueOf(),
          intervalMin: 1,//Number(values.intervalMin),
          endTime: moment(values.endTime).valueOf(),
        },
        page,
        updateMapCenter: this.handleUpdateMapCenter,
      });
    });
  };

  handleSearch = () => {
    this.setState({
      isSearching: true,
    });
    this.props.clearCardActivities();
    this.handleClearFocusMarker();
    this.loadCardActivities(0);
  };

  handleTableChange = pagination => {
    this.setState({
      currentPage: pagination.current,
    });
  };

  componentDidUpdate() {
    const {
      cards: { activities, isLoading, page },
    } = this.props;
    if (this.state.isSearching && !isLoading) {
      if (activities && activities.cardPositions.length < activities.total) {
        this.loadCardActivities(page + 1);
      }
    }
  }

  exportCSV = () => {
    const {
      cards: { activities },
    } = this.props;
    if (activities.cardPositions.length === 0) {
      return;
    }

    let data = 'idx,time,latitude,longitude\n';
    activities.cardPositions.forEach((pos, idx) => {
      data += `${idx},${moment(pos.createTime).format('YYYY.MM.DD HH:mm:ss')},${
        pos.latitude
      },${pos.longitude}\n`;
    });
    exportToCSV('ufos', data);
  };

  handleBlockChainLog = () => {
    window.open(this.state.blockChainLog);
  };

  handleUpdateMapCenter = bounds => {
    this.map.fitBounds(bounds);
    this.setState({ mapCenter: bounds.getCenter() });
  };

  handleClearFocusMarker = () => {
    this.setState({ focusedMarker: undefined });
  };

  handleFocusMarker = (record, idx) => {
    console.log(record)
    this.map.setZoom(18);
    this.setState({
      mapCenter: {
        lat: record.latitude,
        lng: record.longitude,
      },
      focusedMarker: record.id,
    });
  };

  componentWillUnmount() {
    this.props.clearCardActivities();
  }

  renderControls = () => {
    const {
      form: { getFieldDecorator },
      card,
    } = this.props;

    return (
      <Form hideRequiredMark style={{ width: '100%' }}>
        <Row style={{ marginTop: 15 }}>
          ID # {card.uuid} Major(
          {card.major}) Minor(
          {card.minor})
        </Row>
        <Row type="flex" align="middle" style={{ marginTop: 15 }}>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('startTime', {
                rules: [{ required: true, message: '請輸入開始時間' }],
              })(
                <DatePicker
                  style={{ width: '90%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD  HH:mm"
                  placeholder="開始時間"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={1}>
            <span style={{ display: 'inline-block', textAlign: 'center' }}>
              至
            </span>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator('endTime', {
                rules: [{ required: true, message: '請輸入結束時間' }],
              })(
                <DatePicker
                  style={{ width: '90%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD  HH:mm"
                  placeholder="結束時間"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              每
              {getFieldDecorator('intervalMin', {
                initialValue: '10',
                rules: [{ required: true, message: '此欄位必填' }],
              })(
                <Select style={styles.select}>
                  <Option value="10">10 min</Option>

                </Select>,
              )}
              顯示一筆資料
            </FormItem>
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={this.handleSearch}>
              動態搜尋
            </Button>
          </Col>
          <Col span={2}>
            <Button icon="upload" onClick={this.exportCSV}>
              匯出資料
            </Button>
          </Col>
          <Col span={2}>
            <Button icon="link" onClick={this.handleBlockChainLog}>
              區塊鏈紀錄
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  renderCards = () => {
    const { cards } = this.props;
    const { currentPage, focusedMarker } = this.state;

    const columns = [
      {
        title: '#',
        dataIndex: '',
        render: (v, r, idx) =>
          padStart(String(idx + (currentPage - 1) * cards.size + 1), 5),
      },
      {
        title: 'Time',
        dataIndex: 'createTime',
        render: v => moment(v).format('YYYY.MM.DD HH:mm:ss'),
      },
    ];

    const total = cards.activities ? cards.activities.total : 0;
    const pagination = {
      current: currentPage,
      pageSize: cards.size,
      total,
    };

    return (
      <Table
        style={{ marginTop: 15, width: '60%' }}
        rowKey="id"
        onRow={(record, idx) => ({
          onClick: evt => this.handleFocusMarker(record, idx),
        })}
        rowClassName={(r, idx) =>
          cx('cursor-pointer', { 'bg-lightblue': r.id === focusedMarker })
        }
        loading={cards.isLoading}
        dataSource={cards.activities && cards.activities.cardPositions}
        pagination={pagination}
        onChange={this.handleTableChange}
        columns={columns}
      />
    );
  };

  render() {
    const { onClose, cards } = this.props;
    const { mapCenter, focusedMarker } = this.state;

    return (
      <Modal
        width="95%"
        title="定位管理"
        style={{ top: 20 }}
        visible={true}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        cancelText="關閉">
        <Row style={{ marginTop: 10, height: 400 }}>
          <GoogleMapWrapper center={mapCenter} onRef={map => (this.map = map)}>
            <CardActivities
              positions={cards.activities && cards.activities.cardPositions}
              focusedMarker={focusedMarker}
            />
          </GoogleMapWrapper>
        </Row>
        {this.renderControls()}
        {this.renderCards()}
      </Modal>
    );
  }
}

export default MapModal;
