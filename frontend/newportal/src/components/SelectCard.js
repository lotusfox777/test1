import * as React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const fake_cards = [
  { id: '0001', name: '奶奶' },
  { id: '0002', name: '爺爺' },
  { id: '0003', name: '陳先生' }
];

class CardSelect extends React.Component {
  render() {
    return (
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="選取守護名單">
        {fake_cards.map(function(c, idx) {
          return (
            <Option key={c.id} value={c.id}>
              {c.name}
            </Option>
          );
        })}
      </Select>
    );
  }
}

export default CardSelect;
