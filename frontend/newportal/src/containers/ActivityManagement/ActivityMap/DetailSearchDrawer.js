import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { isNil } from 'ramda';
import { Drawer, Row, Col, Button, Select, DatePicker, Form } from 'antd';
import { withI18next } from 'locales/withI18next';
import { listCardActivities, clearCardActivities } from 'reducers/cards';

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 12
  }
};

const FormItem = Form.Item;
const DrawerWithoutMask = styled(Drawer)`
  width: 0 !important;

  .ant-drawer-header {
    background-color: #eee;
  }

  .ant-drawer-content {
    padding-top: 70px;
    background-color: #eee;
  }

  .ant-drawer-close {
    top: 70px;
  }
`;
const HoverableRow = styled(Row)`
  height: 30px;
  &:hover {
    background-color: #79abe5;
    cursor: pointer;
  }
  &.isFocused {
    background-color: #79abe5;
  }
`;

const mapStateToProps = state => ({
  cards: state.cards
});

const mapDispatchToProps = {
  listCardActivities,
  clearCardActivities
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class DetailSearchDrawer extends Component {
  constructor(props) {
    super(props);
    //預設搜尋條件為前一個小時每分鐘的資料. 如果回傳 0 筆數, warning '近一小時並無動態'
    this.state = {
      intervalMin: props.defaultTimeInterval || '1',
      startTime: props.defaultStartTime || moment().subtract(1, 'hours').valueOf(),
      endTime: props.defaultEndTime || moment().valueOf(),
      defaultTimePeriod : props.defaultStartTime ? false : true
    };
  }

  handleClose = () => {};

  handlePosition = (idx, pos) => {
    this.props.onFocusMarker(idx, {
      lat: pos.latitude,
      lng: pos.longitude
    });
  };

  handleSearch = () => {
    const {
      form: { validateFields },
      listCardActivities,
      currentCardId,
      clearCardActivities,
      clearFocusMarker,
      updateMapCenter
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      clearCardActivities();
      clearFocusMarker();
      updateMapCenter();
      this.setState({
        startTime: moment(values.startTime).valueOf(),
        endTime: moment(values.endTime).valueOf(),
        intervalMin: values.intervalMin
      });

      listCardActivities({
        body: {
          id: currentCardId,
          startTime: moment(values.startTime).valueOf(),
          endTime: moment(values.endTime).valueOf(),
          intervalMin: values.intervalMin
        },
        page: 0,
        size: 100,
        defaultTimePeriod : false
      });
    });
  };

  componentDidMount() {
    this.props.clearCardActivities();

    const { intervalMin, startTime, endTime, defaultTimePeriod } = this.state;

    this.props.listCardActivities({
      body: {
        id: this.props.currentCardId,
        startTime,
        endTime,
        intervalMin
      },
      page: 0,
      size: 100,
      defaultTimePeriod
    });

    this.props.updateMapCenter();
  }

  componentDidUpdate(prevProps) {
    const {
      cards: { activities, isLoading },
      listCardActivities,
      currentCardId,
      focusedMarker
    } = this.props;
    const { intervalMin, startTime, endTime } = this.state;

    if (!isLoading && activities.page < activities.totalPages - 1) {
      listCardActivities({
        body: {
          id: currentCardId,
          startTime,
          endTime,
          intervalMin
        },
        page: activities.page + 1,
        size: 100,
        defaultTimePeriod : startTime ? false : true
      });
    }

    if(isNil(focusedMarker)){
      return;
    }

    if (prevProps.focusedMarker !== focusedMarker) {
      const timeLog = window.document.getElementById(
        `time-log-${focusedMarker}`
      );
      timeLog.scrollIntoView();
    }
  }

  render() {
    const {
      onClose,
      cards: { activities },
      form: { getFieldDecorator },
      focusedMarker,
      t
    } = this.props;
    const { intervalMin, startTime, endTime } = this.state;

    return (
      <DrawerWithoutMask
        width="350"
        title={t('search trace')}
        placement="right"
        mask={false}
        visible={true}
        onClose={onClose}>
        {/* <h4>設定查詢區間</h4> */}
        {/* <p>搜尋區間最多一日</p> */}
        <FormItem label={t('datetime-from')} {...formItemLayout}>
          {getFieldDecorator('startTime', {
            initialValue: moment(startTime),
            rules: [{ required: true, message: '此欄位必填' }]
          })(
            <DatePicker
              style={{ width: 210 }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          )}
        </FormItem>
        <FormItem label={t('datetime-to')} {...formItemLayout}>
          {getFieldDecorator('endTime', {
            initialValue: moment(endTime),
            rules: [{ required: true, message: '此欄位必填' }]
          })(
            <DatePicker
              style={{ width: 210 }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          )}
        </FormItem>
        <Row type="flex" align="middle" gutter={8}>
          <Col span={2}>{t('datetime-per')}</Col>
          <Col span={9}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('intervalMin', {
                initialValue: intervalMin
              })(
                <Select style={{ width: '100%' }}>
                  <Select.Option value="1">1 min</Select.Option>
                  <Select.Option value="5">5 min</Select.Option>
                  <Select.Option value="10">10 min</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={9}>{t('show the data')}</Col>
        </Row>

        <Button
          style={{ width: '100%', marginTop: 12 }}
          type="primary"
          onClick={this.handleSearch}>
          {t('start')}
        </Button>

        <Row style={{ marginTop: 36, borderBottom: '1px solid #1e3954' }}>
          <Col span={8}>#</Col>
          <Col span={16}>Time</Col>
        </Row>

        <div style={{ height: 400, marginTop: 12, overflowY: 'scroll' }}>
          {activities.content[0] &&
            activities.content[0].cardPositions.map((pos, idx) => {
              // todo: hover style & onclick function
              return (
                <HoverableRow
                  key={idx}
                  id={`time-log-${idx}`}
                  className={focusedMarker === idx ? 'isFocused' : ''}
                  onClick={() => this.handlePosition(idx, pos)}>
                  <Col span={8}>{idx + 1}</Col>
                  <Col span={16}>
                    {moment(pos.createTime).format('YYYY.MM.DD HH:mm:ss')}
                  </Col>
                </HoverableRow>
              );
            })}
        </div>
      </DrawerWithoutMask>
    );
  }
}

export default withI18next(['all'])(DetailSearchDrawer);
