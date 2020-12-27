import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import ActivityMap from './ActivityMap/index';

import { ACTIVITY_MAP } from 'constants/routes';

export default class ActivityManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={ACTIVITY_MAP} component={ActivityMap} />
        <Route component={ActivityMap} />
      </Switch>
    );
  }
}
