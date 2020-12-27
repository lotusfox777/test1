import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { acceptCardInvite } from 'reducers/cards';

@connect(null, { acceptCardInvite })
export default class InviteAcceptPage extends PureComponent {
  componentDidMount = () => {
    const { match: { params }, acceptCardInvite } = this.props;

    if (params.authToken) {
      acceptCardInvite(params.authToken);
    }
  };

  render() {
    return (
      <div></div>
    );
  }
}
