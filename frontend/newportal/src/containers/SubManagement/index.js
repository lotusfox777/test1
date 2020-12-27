import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import SubManagerList from './SubManagerList/index';

import { SUBMANAGER_LIST } from 'constants/routes';

export default class SubManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={SUBMANAGER_LIST} component={SubManagerList} />
      </Switch>
    );
  }
}
