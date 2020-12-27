import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { pipe } from 'ramda';
import { DatePicker, Col, Row, Form, Table } from 'antd';
import Button from 'components/Button';
import { Flex } from 'components/common/Flex';
import { listHeartRate } from 'reducers/device';
import moment from 'moment';
import { StyledModal } from './style';

const { RangePicker } = DatePicker;

const HeartRateModal = ({ device, onCancel, content, isLoading, total, listHeartRate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState([]);

  const onChange = val => {
    setDate(val);
  };

  const handleSearch = () => {
    const params = _getParams({ page: 0 });

    setCurrentPage(1);
    listHeartRate(params);
  };

  useEffect(() => {
    const params = _getParams({ page: 0 });
    listHeartRate(params);
  }, []);

  const _getParams = val => {
    const [start, end] = date;
    let startDate, endDate;

    if (start) {
      startDate = new Date(start.format('YYYY-MM-DD')).valueOf();
    }
    if (end) {
      endDate = new Date(end.format('YYYY-MM-DD').concat(' 23:59:59')).valueOf();
    }

    return {
      cardSeq: device.id,
      ...val,
      size: 10,
      start: startDate,
      end: endDate,
    };
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
    current: currentPage,
    pageSize: 10,
    total,
  };

  const handlePagination = pagination => {
    const current = pagination.current - 1;
    const params = _getParams({ page: current });
    listHeartRate(params);

    setCurrentPage(pagination.current);
  };

  return (
    <StyledModal
      title={
        <Row>
          <Col sm={12} xs={24}>
            {device.uuid}({device.major})({device.minor})
          </Col>
          <Col sm={12} xs={24}>
            <Flex>
              <RangePicker onChange={onChange} format="YYYY-MM-DD" />
              <Button className="ml-8 mr-20" text="搜尋" onClick={handleSearch} />
            </Flex>
          </Col>
        </Row>
      }
      visible={true}
      width="70%"
      onCancel={onCancel}
      footer={null}>
      <Table
        rowKey="id"
        className="mt-15"
        columns={columns}
        dataSource={content}
        pagination={pagination}
        loading={isLoading}
        onChange={handlePagination}
        locale={{ emptyText: '沒有資料' }}
      />
    </StyledModal>
  );
};

const mapStateToProps = state => ({
  content: state.device.content,
  isLoading: state.device.loading,
  total: state.device.total,
});

const mapDispatchToProps = {
  listHeartRate,
};

export default pipe(connect(mapStateToProps, mapDispatchToProps), Form.create())(HeartRateModal);
