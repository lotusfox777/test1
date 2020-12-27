import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { reverse } from 'ramda';
import { connect } from 'react-redux';
import { Modal, Form, DatePicker, Row, Col, Button, Table } from 'antd';

import GoogleMapWrapper from 'components/GoogleMapWrapper';
import { listCardActivities } from 'reducers/cards';

const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;

const mapStateToProps = state => ({
  cards: state.cards
});

const mapDispatchToProps = {
  listCardActivities
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MapModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardActivities: [],
      gettingActivities: false
    };
  }

  handleSearch = () => {
    const {
      card,
      form: { validateFields },
      listCardActivities
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setState({
        gettingActivities: true
      });

      listCardActivities({
        id: card.id,
        startTime: moment(values.startTime).valueOf(),
        endTime: moment(values.endTime).valueOf()
      });
    });
  };

  static getDerivedStateFromProps(props, state) {
    const {
      cards: { isLoading, activities }
    } = props;
    const { gettingActivities } = state;

    if (!isLoading && gettingActivities) {
      return {
        gettingActivities: false,
        cardActivities: reverse(activities.beaconInfos)
      };
    }

    return null;
  }

  componentDidMount() {}

  renderControls() {
    const {
      form: { getFieldDecorator },
      card
    } = this.props;

    return (
      <Form hideRequiredMark style={{ width: '100%' }}>
        <Row style={{ marginTop: 15 }}>{`ID # ${card.cardId}`}</Row>
        <Row type="flex" align="middle" style={{ marginTop: 15 }}>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('startTime', {
                rules: [{ required: true, message: '請輸入開始時間' }]
              })(
                <DatePicker
                  style={{ width: '90%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD  HH:mm"
                  placeholder="開始時間"
                />
              )}
            </FormItem>
          </Col>
          <Col span={1}>
            <span style={{ display: 'inline-block', textAlign: 'center' }}>
              至
            </span>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('endTime', {
                rules: [{ required: true, message: '請輸入結束時間' }]
              })(
                <DatePicker
                  style={{ width: '90%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD  HH:mm"
                  placeholder="結束時間"
                />
              )}
            </FormItem>
          </Col>
          <Col
            span={7}
            style={{ display: 'flex', justifyContent: 'space-around' }}
          >
            <Button type="primary" onClick={this.handleSearch}>
              動態搜尋
            </Button>
            <Button icon="upload">匯出資料</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderUFOS() {
    const { cardActivities } = this.state;

    const columns = [
      {
        title: 'UFO ID',
        dataIndex: 'ufoId'
      },
      {
        title: 'Time',
        dataIndex: 'time'
      }
    ];

    return (
      <Table
        style={{ marginTop: 15 }}
        rowKey="id"
        dataSource={cardActivities}
        columns={columns}
      />
    );
  }

  render() {
    const { onClose } = this.props;
    const { cardActivities } = this.state;

    return (
      <Modal
        width="95%"
        title="定位管理"
        style={{ top: 20 }}
        visible={true}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        cancelText="關閉"
      >
        <Row style={{ marginTop: 10, height: 400 }}>
          <GoogleMapWrapper routes={cardActivities} />
        </Row>

        {this.renderControls()}

        {this.renderUFOS()}
      </Modal>
    );
  }
}

export default MapModal;
