import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import CardList from './CardList/index';

import {
  CARD_LIST
} from 'constants/routes';

export default class CardManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={CARD_LIST} component={CardList} />
      </Switch>
    );
  }
}
