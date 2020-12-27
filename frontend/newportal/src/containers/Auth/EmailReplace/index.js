import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Row, Icon } from 'antd';
import { connect } from 'react-redux';
import { changeEmailConfirmed } from 'reducers/users';
import { StyledModal } from '../components';

const mapStateToProps = state => ({
  loading: state.users.isVerifyEmail,
});

const mapDispatchToProps = {
  changeEmailConfirmed,
};

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@Form.create()
export default class EmailReplacePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: this.props.match.params.subPath,
    };
  }

  componentDidMount = () => {
    const { changeEmailConfirmed, history } = this.props;
    changeEmailConfirmed({
      token: this.state.token,
      onCompleted: () => {
        history.push('/');
      },
    });
  };

  render() {
    return (
      <StyledModal style={{ height: '100vh' }}>
        <div className="title_01 mb_34" style={{ marginTop: 30 }}>
          <div className="title_02">正在進行信箱變更作業</div>
        </div>
        <Row>
          <Col span={24} style={{ textAlign: 'center', fontSize: 24 }}>
            <Icon type="loading-3-quarters" spin />
          </Col>
        </Row>
      </StyledModal>
    );
  }
}
