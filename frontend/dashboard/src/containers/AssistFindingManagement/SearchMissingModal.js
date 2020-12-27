import React from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import styled from 'styled-components';
import { map, keys, compose, filter } from 'ramda';
import { Modal, Input, Radio, Form } from 'antd';
import { REVIEW_STATS, updateAssistFinding } from 'reducers/assistFinding';

const RadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

function SearchMissingModal({
  item,
  onCancel,
  form: { getFieldDecorator, validateFields },
}) {
  const dispatch = useDispatch();

  const { updating } = useMappedState(state => ({
    updating: state.assistFinding.updating,
  }));

  const handleOk = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch(
        updateAssistFinding({
          ...values,
          id: item.id,
          onCompleted: () => onCancel(),
        }),
      );
    });
  };

  return (
    <Modal
      visible
      width={400}
      title="審核"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={updating}>
      <Form>
        <Form.Item>
          {getFieldDecorator('status', {
            rules: [{ required: true, message: '此欄位必填' }],
          })(
            <RadioGroup>
              {compose(
                map(key => (
                  <Radio key={key} value={key} style={{ marginRight: 12 }}>
                    {REVIEW_STATS[key]}
                  </Radio>
                )),
                filter(
                  key => !['未審核', '未申請'].includes(REVIEW_STATS[key]),
                ),
                keys,
              )(REVIEW_STATS)}
            </RadioGroup>,
          )}
        </Form.Item>
        <Form.Item label="備註">
          {getFieldDecorator('remark')(
            <Input.TextArea autoSize={{ minRows: 4 }} />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(SearchMissingModal);
