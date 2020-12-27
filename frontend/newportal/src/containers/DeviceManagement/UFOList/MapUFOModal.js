import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { Modal, Form, DatePicker, Row, Col, Button, Table, Tag } from 'antd';

import GoogleMapWrapper from 'components/GoogleMapWrapper';

import { Status, listUFOCards } from 'reducers/ufos';

const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;

const mapStateToProps = state => ({
  ufos: state.ufos
});

const mapDispatchToProps = {
  listUFOCards
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MapUFOModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gettingCards: false,
      currentPage: 0
    };
  }

  handleSearch = () => {
    const {
      ufo,
      form: { validateFields },
      listUFOCards
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setState({
        gettingCards: true
      });

      listUFOCards({
        body: {
          id: ufo.id,
          startTime: moment(values.startTime).valueOf(),
          endTime: moment(values.endTime).valueOf()
        }
      });
    });
  };

  handlePagination = pagination => {
    const {
      ufo: { id },
      form: { getFieldValue },
      listUFOCards
    } = this.props;

    this.setState(
      {
        currentPage: pagination.current - 1
      },
      () => {
        const startTime = getFieldValue('startTime');
        const endTime = getFieldValue('endTime');
        listUFOCards({
          body: {
            id,
            startTime: moment(startTime).valueOf(),
            endTime: moment(endTime).valueOf()
          }
        });
      }
    );
  };

  renderControls() {
    const {
      form: { getFieldDecorator },
      ufo
    } = this.props;

    return (
      <Form hideRequiredMark style={{ width: '100%' }}>
        <Row style={{ marginTop: 15 }} type="flex" gutter={24}>
          <Col>
            <span style={{ marginRight: 12 }}>UFO ID</span>
            <Tag>{ufo.ufoId}</Tag>
          </Col>
          <Col>
            <span style={{ marginRight: 12 }}>座標</span>
            <Tag>{ufo.latitude}</Tag>
            <Tag>{ufo.longitude}</Tag>
          </Col>
          <Col>
            <span style={{ marginRight: 12 }}>狀態</span>
            <Tag>{Status[ufo.status]}</Tag>
          </Col>
        </Row>
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

  renderCards() {
    const {
      ufos: { cards, cardsTotalPages, isLoading }
    } = this.props;
    const { currentPage } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'cardId'
      },
      {
        title: '進入區域時間',
        dataIndex: 'createTime',
        render: time => (
          <span>{moment(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        )
      },
      {
        title: '離開區域時間',
        dataIndex: 'exitTime',
        render: time => (
          <span>
            {time ? moment(time).format('YYYY.MM.DD HH:mm:ss') : 'N/A'}
          </span>
        )
      }
    ];

    const pagination = {
      defaultCurrent: currentPage,
      pageSize: 10,
      total: 10 * cardsTotalPages,
      position: 'top'
    };

    return (
      <Table
        style={{ marginTop: 15 }}
        rowKey="cardId"
        dataSource={cards}
        columns={columns}
        isLoading={isLoading}
        locale={{ emptyText: '沒有資料。' }}
        onChange={this.handlePagination}
        pagination={pagination}
      />
    );
  }

  render() {
    const { ufo, onClose } = this.props;

    const center = {
      lat: ufo.latitude,
      lng: ufo.longitude
    };

    return (
      <Modal
        width="95%"
        title={`裝置管理 > UFO管理 > #${ufo.ufoId} 定位`}
        style={{ top: 20 }}
        visible={true}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        cancelText="關閉"
      >
        <Row style={{ marginTop: 10, height: 400 }}>
          <GoogleMapWrapper circles={[ufo]} center={center} />
        </Row>

        {this.renderControls()}

        {this.renderCards()}
      </Modal>
    );
  }
}

export default MapUFOModal;
