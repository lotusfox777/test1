import * as React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const DarkBlueButton = styled(Button)`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #1e3954;
  border: solid 1px #1e3954;
  line-height: 1.13;
  :hover,
  :focus,
  :active {
    background-color: #3f5b77;
    color: #fff;
    border: solid 1px #3f5b77;
  }
`;

const LightBlueButton = styled(Button)`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #79abe5;
  border: solid 1px #79abe5;
  line-height: 1.13;
  :hover,
  :focus,
  :active {
    background-color: #6d98ca;
    color: #fff;
    border: solid 1px #6d98ca;
  }
`;

const WhiteButton = styled(Button)`
  font-size: 14px;
  font-weight: bold;
  background-color: #ffffff;
  color: #4a4a4a;
  border: solid 1px #d9d9d9;
  line-height: 1.13;
  :hover,
  :focus,
  :active {
    background-color: #eeeeee;
    color: #4a4a4a;
    border: solid 1px #d9d9d9;
  }
`;

const RedButton = styled(Button)`
  font-size: 14px;
  font-weight: bold;
  color: #f5222d;
  background-color: #fff;
  border: solid 1px #f5222d;
  line-height: 1.13;
  :hover,
  :focus,
  :active {
    background-color: #f5222d;
    color: #fff;
    border: solid 1px #f5222d;
  }
`;

class StyleButton extends React.Component {
  render() {
    const props = this.props;
    switch (props.type) {
    case 'white':
      return <WhiteButton {...props}>{this.props.text}</WhiteButton>;
    case 'darkblue':
      return <DarkBlueButton {...props}>{this.props.text}</DarkBlueButton>;
    case 'lightblue':
      return <LightBlueButton {...props}>{this.props.text}</LightBlueButton>;
    case 'red':
      return <RedButton {...props}>{this.props.text}</RedButton>;

    default:
      return <LightBlueButton {...props}>{this.props.text}</LightBlueButton>;
    }
  }
}

export default StyleButton;
