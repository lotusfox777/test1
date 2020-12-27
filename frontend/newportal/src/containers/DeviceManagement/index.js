import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import UFOList from './UFOList/index';
import GuardAreaList from './GuardAreaList/index';

import {
  UFO_LIST,
  GUARD_AREA_LIST
} from 'constants/routes';

export default class DeviceManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={UFO_LIST} component={UFOList} />
        <Route path={GUARD_AREA_LIST} component={GuardAreaList} />
      </Switch>
    );
  }
}
