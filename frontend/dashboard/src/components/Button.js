import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { getFunc } from 'constants/functions';
import { checkUserAuth } from 'utils/authentication';

@withRouter
@connect(state => ({
  permissions: state.auth.permissions
}))
export default class extends PureComponent {
  static displayName = 'Button';

  static propTypes = {
    type: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    actionType: PropTypes.string,
    icon: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    size: 'default',
    className: '',
    style: {},
    icon: null
  };

  render() {
    const {
      children,
      actionTypes,
      permissions,
      location: { pathname },
      staticContext,
      dispatch,
      ...props,
    } = this.props;

    const hasAuth = checkUserAuth({
      permissions,
      func: getFunc(pathname),
      actionTypes
    });

    if (hasAuth) {
      return (
        <Button {...props}>
          {children}
        </Button>
      );
    }

    return null;
  }
}
