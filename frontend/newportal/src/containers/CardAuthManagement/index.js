import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import CardAuthorityList from './CardAuthList/index';

import { CARDAUTHORITY_LIST } from 'constants/routes';

export default class CardAuthManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={CARDAUTHORITY_LIST} component={CardAuthorityList} />
      </Switch>
    );
  }
}
