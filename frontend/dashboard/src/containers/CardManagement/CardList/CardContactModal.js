/* eslint indent:0, no-multi-spaces:0, no-nested-ternary:0, no-use-before-define:0, semi:0, no-trailing-spaces:0, react/sort-comp:0, react/self-closing-comp:0, eol-last:0, padded-blocks:0 */
import React, { Fragment, useState, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { pathOr } from 'ramda';
import styled from 'styled-components';
import moment from 'moment';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Radio,
  Tabs,
  Icon,
  Table as AntTable,
  DatePicker,
} from 'antd';
import { listCardHealth } from 'reducers/cards';

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;

const Table = styled(AntTable)`
  .ant-table-thead > tr > th {
    padding: 10px 16px;
    font-weight: 400;
  }

  .ant-table-tbody > tr > td {
    padding: 8px 16px;
    font-weight: 400;
  }
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const tabNames = {
  INFO: 'info',
  CONTACT: 'contact',
};

function CardContactModal({
  onClose,
  onOk,
  id,
  form: {
    getFieldDecorator,
    getFieldValue,
    validateFields,
    setFields,
    resetFields,
    getFieldError,
  },
}) {
  const [date, setDate] = useState();
  const [tabName, setTabName] = useState(tabNames.INFO);

  const onChange = useCallback(evt => setTabName(evt.target.value), []);

  const mapState = useCallback(
    state => ({
      loading: state.cards.isLoadingHealth,
      cardHealth: state.cards.cardHealth,
      card: state.cards.cardInfo,
    }),
    [id],
  );

  const { loading, card, cardHealth } = useMappedState(mapState);

  const { updating } = useMappedState(state => ({
    updating: state.cards.isUpdating,
  }));

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(listCardHealth({ cardSeq: id }));
  }, []);

  const getDateRange = ([start, end] = []) => {
    return {
      ...(start
        ? {
            start: start
              .clone()
              .set({ h: 0, m: 0, s: 0 })
              .valueOf(),
          }
        : {}),
      ...(end
        ? {
            end: end
              .clone()
              .set({ h: 23, m: 59, s: 59 })
              .valueOf(),
          }
        : {}),
    };
  };

  const handleTableChange = pagination => {
    dispatch(
      listCardHealth({
        ...getDateRange(date),
        cardSeq: id,
        page: pagination.current - 1,
      }),
    );
  };

  const handleDateChange = (date = []) => {
    setDate(date);
    dispatch(
      listCardHealth({
        ...getDateRange(date),
        cardSeq: id,
        page: 0,
      }),
    );
  };

  const columns = [
    {
      title: '時間',
      dataIndex: 'dataAt',
      render: v => moment(v).format('YYYY.MM.DD HH:mm:ss'),
    },
    {
      title: '血氧(%)',
      dataIndex: 'spo2',
    },
    {
      title: '心率(次/分)',
      dataIndex: 'heartbeat',
    },
  ];

  const pagination = {
    total: cardHealth.total,
    current: cardHealth.page,
    pageSize: cardHealth.size,
  };

  return (
    <Modal
      visible
      title={
        <ModalTitle>
          {pathOr('', ['cardOwner', 'name'], card)}
          <span>#{card.uuid}</span>
        </ModalTitle>
      }
      width={750}
      onCancel={onClose}
      confirmLoading={updating}
      maskClosable={false}
      keyboard={false}
      bodyStyle={{ paddingLeft: 48, paddingRight: 48 }}
      footer={false}>
      {loading && <Loading spin type="loading-3-quarters" />}
      {!loading && (
        <Fragment>
          <RadioGroup value={tabName} onChange={onChange}>
            <Radio.Button value={tabNames.INFO}>生理資料</Radio.Button>
            <Radio.Button value={tabNames.CONTACT}>手錶上傳</Radio.Button>
          </RadioGroup>
          <Form>
            <StyledTabs
              animated={false}
              activeKey={tabName}
              defaultActiveKey={tabName}>
              {tabName === tabNames.INFO && (
                <TabPane tab={tabNames.INFO} key={tabNames.INFO}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <FormItem {...formItemLayout} colon={false} label="身高">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'height'], card)}
                          addonAfter="cm"
                        />
                      </FormItem>
                      <FormItem {...formItemLayout} colon={false} label="體重">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'weight'], card)}
                          addonAfter="kg"
                        />
                      </FormItem>
                      <FormItem {...formItemLayout} colon={false} label="體溫">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'temperature'], card)}
                          addonAfter="℃"
                        />
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        colon={false}
                        label="收縮壓">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'sbp'], card)}
                          addonAfter="mmHg"
                        />
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        colon={false}
                        label="舒張壓">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'dbp'], card)}
                          addonAfter="mmHg"
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} colon={false} label="脈搏">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'pulse'], card)}
                          addonAfter="bpm"
                        />
                      </FormItem>
                      <FormItem {...formItemLayout} colon={false} label="血氣">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'spo2'], card)}
                          addonAfter="%"
                        />
                      </FormItem>
                      <FormItem {...formItemLayout} colon={false} label="血糖">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'bloodsugar'], card)}
                          addonAfter="mg/dl"
                        />
                      </FormItem>
                      <FormItem {...formItemLayout} colon={false} label="體脂">
                        <Input
                          readOnly
                          value={pathOr(null, ['health', 'bodyfat'], card)}
                          addonAfter="%"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </TabPane>
              )}
              {tabName === tabNames.CONTACT && (
                <TabPane tab={tabNames.CONTACT} key={tabNames.CONTACT}>
                  <Row style={{ marginBottom: 24 }}>
                    <Col>
                      查詢區間：
                      <RangePicker
                        style={{ width: 280 }}
                        onChange={handleDateChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Table
                        rowKey="id"
                        dataSource={cardHealth.data}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                      />
                    </Col>
                  </Row>
                </TabPane>
              )}
            </StyledTabs>
          </Form>
        </Fragment>
      )}
    </Modal>
  );
}

const FormItem = styled(Form.Item)`
  .ant-input-group-addon {
    width: 66px;
  }

  .ant-form-item-label {
    text-align: left;
  }
`;

const RadioGroup = styled(Radio.Group)`
  &.ant-radio-group {
    display: flex;
    justify-content: center;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-bar {
    border-bottom: none;
  }

  .ant-tabs-nav-scroll {
    visibility: hidden;
  }
`;

const ModalTitle = styled.div`
  font-size: 20px;

  span {
    margin-left: 8px;
    font-size: 16px;
  }
`;

const Loading = styled(Icon)`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 24px;
`;

export default React.memo(Form.create()(CardContactModal));
