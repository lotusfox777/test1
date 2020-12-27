import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import PermissionList from './PermissionList/index';

import {
  PERM_LIST
} from 'constants/routes';

export default class SystemManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={PERM_LIST} component={PermissionList} />
      </Switch>
    );
  }
}
