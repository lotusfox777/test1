import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import UserList from './UserList/index';

import {
  USER_LIST
} from 'constants/routes';

export default class UserManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={USER_LIST} component={UserList} />
      </Switch>
    );
  }
}
