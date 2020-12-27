import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchMissingList from './SearchMissingList';
import { SEARCH_MISSING_LIST } from 'constants/routes';

export default class MissingManagement extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path={SEARCH_MISSING_LIST} component={SearchMissingList} />
      </Switch>
    );
  }
}
