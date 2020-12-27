import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { findIndex, propEq, compose, forEach, slice, pathOr, flatten, pluck, length } from 'ramda';
import { Drawer, Row, Col, Button, Select, DatePicker, Form, Divider, message } from 'antd';
import { withI18next } from 'locales/withI18next'
import { listCardGroups } from 'reducers/cardGroups';

import { listCards, listMultipleCardsActivities, clearCardActivities } from 'reducers/cards';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
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

const mapStateToProps = (state) => ({
  cards: state.cards,
  cardGroups: state.cardGroups,
});

const mapDispatchToProps = {
  listCards,
  listCardGroups,
  listMultipleCardsActivities,
  clearCardActivities,
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class GeneralSearchDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 50,
      page: 0,
      searchingActivities: false,
      endTime: undefined,
      startTime: undefined,
      intervalMin: undefined,
      cardGroupSeqs: [],
      cardSeqs: [],
    };
  }

  handleClose = () => {};

  handleSearch = () => {
    const {
      form: { validateFields },
      cards,
      cardGroups,
      listMultipleCardsActivities,
      clearCardActivities,
      onSearchStart,
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      const cardSeqs = [];
      const cardGroupSeqs = [];
      values.searchTargets.forEach((name) => {
        const cardIdx = findIndex(propEq('cardName', name))(cards.content);
        const cardGroupIdx = findIndex(propEq('groupName', name))(cardGroups.content);
        if (cardIdx > -1) {
          cardSeqs.push(cards.content[cardIdx].id);
        } else if (cardGroupIdx > -1) {
          cardGroupSeqs.push(cardGroups.content[cardGroupIdx].id);
        }
      });
      clearCardActivities();
      this.setState({
        searchingActivities: true,
        endTime: values.endTime.valueOf(),
        startTime: values.startTime.valueOf(),
        intervalMin: Number(values.intervalMin),
        cardGroupSeqs,
        cardSeqs,
      });

      listMultipleCardsActivities({
        page: this.state.page,
        size: this.state.pageSize,
        body: {
          cardGroupSeqs,
          cardSeqs,
          endTime: values.endTime.valueOf(),
          startTime: values.startTime.valueOf(),
          intervalMin: Number(values.intervalMin),
        },
        onFitBounds: this.props.onFitBounds,
      });
      onSearchStart();
    });
  };

  componentDidMount() {
    this.props.listCards({
      type: 1,
      page: 0,
      size: 99999,
    });
    this.props.listCardGroups({
      page: 0,
      size: 99999,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      cards: { isLoading, activities },
      listMultipleCardsActivities,
      onSearchFinished,
      onFitBounds,
    } = this.props;
    const {
      searchingActivities,
      page,
      pageSize,
      endTime,
      startTime,
      intervalMin,
      cardGroupSeqs,
      cardSeqs,
    } = this.state;

    if (!isLoading && searchingActivities) {
      let hasMorePage = false;
      const maxSize = (page + 1) * pageSize;

      for (let i in activities.content) {
        if (activities.content[i].cardPositions.length === maxSize) {
          hasMorePage = true;
          break;
        }
      }

      if (hasMorePage) {
        this.setState({
          page: page + 1,
        });

        listMultipleCardsActivities({
          page: page + 1,
          size: pageSize,
          body: {
            cardGroupSeqs,
            cardSeqs,
            endTime,
            startTime,
            intervalMin,
          },
        });
      } else {
        this.setState({ searchingActivities: false });

        let _activities = compose(
          slice(0, 1000),
          flatten,
          pluck('cardPositions'),
          pathOr([], ['content']),
        )(activities);

        if (length(_activities) === 0) {
          message.warning('找不到任何資料');
          return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        forEach(
          (x) =>
            bounds.extend(
              new window.google.maps.LatLng({
                lat: x.latitude,
                lng: x.longitude,
              }),
            ),
          _activities,
        );

        onFitBounds(bounds);
        onSearchFinished(startTime, endTime, intervalMin);
      }
    }
  }

  renderCardDropdown() {
    const {
      form: { getFieldDecorator },
      cards,
      cardGroups,
    } = this.props;

    return (
      <Fragment>
        {getFieldDecorator('searchTargets', {
          rules: [
            {
              required: true,
              message: '請選擇裝置',
            },
          ],
        })(
          <Select mode="multiple" style={{ width: '100%' }}>
            {cardGroups.content.map((group) => {
              return (
                <Select.Option value={group.groupName} key={`group-${group.id}`}>
                  {group.groupName}
                </Select.Option>
              );
            })}
            {cards.content.map((card) => {
              return (
                <Select.Option value={card.cardName} key={`card-${card.id}`}>
                  {card.cardName}
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </Fragment>
    );
  }

  render() {
    const {
      onClose,
      form: { getFieldDecorator },
      t,
    } = this.props;

    return (
      <DrawerWithoutMask
        width="400"
        title={t('search trace')}
        placement="left"
        mask={false}
        visible={true}
        onClose={onClose}>
        {/* <h4>設定查詢區間</h4>
        <p>搜尋區間最多一日</p> */}
        <FormItem label={t('datetime-from')} {...formItemLayout}>
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '此欄位必填' }],
          })(<DatePicker style={{ width: 210 }} showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </FormItem>
        <FormItem label={t('datetime-to')} {...formItemLayout} labelAlign="left">
          {getFieldDecorator('endTime', {
            rules: [{ required: true, message: '此欄位必填' }],
          })(<DatePicker style={{ width: 210 }} showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </FormItem>
        <Row type="flex" align="middle" gutter={8}>
          <Col span={2}>{t('datetime-per')}</Col>
          <Col span={9}>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('intervalMin', {
                initialValue: '1',
              })(
                <Select style={{ width: '100%' }}>
                  <Select.Option value="1">1 min</Select.Option>
                  <Select.Option value="5">5 min</Select.Option>
                  <Select.Option value="10">10 min</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={9}>{t('show the data')}</Col>
        </Row>
        <Divider />
        <h4>{t('Search name')}</h4>
        <FormItem>{this.renderCardDropdown()}</FormItem>

        <Button style={{ width: '100%' }} type="primary" onClick={this.handleSearch}>
          {t('start')}
        </Button>
      </DrawerWithoutMask>
    );
  }
}

export default withI18next(['all'])(GeneralSearchDrawer);
