import React from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Layout, Row, Col, Table, Select, Input, Tooltip } from 'antd';
import { compose, keys, map } from 'ramda';
import moment from 'moment';
import Button from 'components/Button';
import { FORM_FIELDS } from 'constants/formFields';
import { listAssistFindings, REVIEW_STATS } from 'reducers/assistFinding';
import { padStart } from 'utils/webHelper';
import useEdit from './useEdit';
import Image from './Image';
import SearchMissingModal from './SearchMissingModal';
import GoogleMapModal from './GooleMapModal';

const { Content } = Layout;
const { Option } = Select;

export default function SearchMissingList(props) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(listAssistFindings());
  }, []);

  const { data } = useMappedState(state => ({
    data: state.assistFinding,
  }));

  const [editModalVisible, handleEditModalVisible, item] = useEdit({
    content: data.content,
  });

  const [mapModalVisible, handleMapModalVisible, mapItem] = useEdit({
    content: data.content,
  });

  const handlePageSizeChange = size => {
    dispatch(
      listAssistFindings({
        size: Number(data.size),
        status: data.status,
        page: data.page,
      }),
    );
  };

  const handleStatChange = id => {
    dispatch(
      listAssistFindings({
        size: Number(data.size),
        page: data.page,
        status: id,
      }),
    );
  };

  const handleTableChange = pagination => {
    dispatch(
      listAssistFindings({
        status: data.status,
        size: data.size,
        page: pagination.current - 1,
      }),
    );
  };

  const handlePageChange = e => {
    let page = +e.target.value;
    if (Number.isInteger(page)) {
      page = page - 1;
      const isValidPage = page >= 0 && page < data.totalPages;
      if (isValidPage) {
        dispatch(
          listAssistFindings({
            page,
            status: data.status,
            size: data.size,
          }),
        );
      }
    }
  };

  const columns = [
    {
      title: '卡號',
      dataIndex: 'uuid',
      render: (v, r) => `${v || '-'} (${r.major}) (${padStart(r.minor, 4)})`,
    },
    {
      title: '姓名',
      dataIndex: 'cardName',
    },
    {
      title: '審核狀態',
      dataIndex: 'status',
      width: 95,
      render: v => REVIEW_STATS[v],
    },
    {
      title: '申請者帳號',
      dataIndex: 'memberId',
    },
    {
      title: '特徵',
      dataIndex: 'feature',
    },
    {
      title: '照片',
      dataIndex: 'imgUrl',
      render: v => <Image url={v} />,
    },
    {
      title: '最後位置時間',
      dataIndex: 'lastDetectedTime',
      render: v => moment(v).format('YYYY.MM.DD HH:mm:ss'),
    },
    {
      dataIndex: 'act',
      render: (v, r) => (
        <React.Fragment>
          <Tooltip title="查看最後位置">
            <Button
              icon="environment"
              actionTypes={FORM_FIELDS.READABLE}
              data-id={r.id}
              onClick={handleMapModalVisible}
            />
          </Tooltip>
          <Tooltip title="編輯">
            <Button
              icon="edit"
              actionTypes={FORM_FIELDS.READABLE}
              style={{ marginLeft: 7 }}
              data-id={r.id}
              onClick={handleEditModalVisible}
            />
          </Tooltip>
        </React.Fragment>
      ),
    },
  ];

  const pagination = {
    current: data.page + 1,
    pageSize: data.size,
    total: data.total,
  };

  return (
    <Layout>
      {editModalVisible && (
        <SearchMissingModal item={item} onCancel={handleEditModalVisible} />
      )}
      {mapModalVisible && (
        <GoogleMapModal item={mapItem} onCancel={handleMapModalVisible} />
      )}
      <Content style={{ padding: '0px 24px 0px 8px' }}>
        <h1>協尋管理</h1>
        <Row css={{ marginBottom: 15 }}>
          <Col span={10}>
            <Select
              allowClear
              onChange={handleStatChange}
              placeholder="協尋狀態"
              css={{ marginRight: 16, width: 144 }}>
              {compose(
                map(key => (
                  <Option key={key} value={key}>
                    {REVIEW_STATS[key]}
                  </Option>
                )),
                keys,
              )(REVIEW_STATS)}
            </Select>
            <Select onChange={handlePageSizeChange} defaultValue="10">
              <Option value="10">10 筆/頁</Option>
              <Option value="25">25 筆/頁</Option>
              <Option value="50">50 筆/頁</Option>
              <Option value="100">100 筆/頁</Option>
            </Select>
            <div css={{ marginLeft: 16, display: 'inline-block' }}>
              跳至
              <Input
                onPressEnter={handlePageChange}
                style={{ width: '65px', margin: '0 7px' }}
              />
              頁
            </div>
          </Col>
        </Row>
        <Row css={{ marginTop: 30 }}>
          <Col>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={data.content}
              loading={data.loading}
              onChange={handleTableChange}
              locale={{ emptyText: '沒有資料。' }}
              pagination={pagination}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
