import React from 'react';
import moment from 'moment';
import { useDispatch, useMappedState } from 'redux-react-hook';
import styled from 'styled-components';
import {
  Modal as AntModal,
  Row,
  Col,
  Button,
  Form,
  DatePicker,
  Table as AntTable,
} from 'antd';
import { listCardHealth } from 'reducers/cards';
import { padStart } from 'utils/webHelper';

const RangePicker = DatePicker.RangePicker;

const Table = styled(AntTable)`
  .ant-table-thead > tr > th {
    padding: 10px 16px;
    font-weight: 400;
  }
`;

const Modal = styled(AntModal)`
  .ant-modal-footer {
    padding-bottom: 16px;
    padding-right: 24px;
    border-top: none;
  }
`;

function CardHealthModal({
  item,
  onClose,
  form: { getFieldDecorator, getFieldsValue },
}) {
  const [date, setDate] = React.useState();

  const mapState = React.useCallback(
    state => ({
      loading: state.cards.isLoading,
      cardHealth: state.cards.cardHealth,
    }),
    [item.id],
  );

  const { loading, cardHealth = {} } = useMappedState(mapState);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(listCardHealth({ cardSeq: item.id }));
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
        cardSeq: item.id,
        page: pagination.current - 1,
      }),
    );
  };

  const handleDateChange = (date = []) => {
    setDate(date);
    dispatch(
      listCardHealth({
        ...getDateRange(date),
        cardSeq: item.id,
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
      title={`裝置號 ${item.uuid} (${item.major}) (${padStart(item.minor, 4)})`}
      onCancel={onClose}
      width={750}
      bodyStyle={{ paddingLeft: 40, paddingRight: 40 }}
      maskClosable={false}
      keyboard={false}
      footer={[
        <Button key="btn-ok" type="primary" onClick={onClose}>
          確認
        </Button>,
      ]}>
      <Form>
        <Row style={{ marginBottom: 24 }}>
          <Col>
            查詢區間：
            <RangePicker style={{ width: 280 }} onChange={handleDateChange} />
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
      </Form>
    </Modal>
  );
}

export default Form.create()(CardHealthModal);
