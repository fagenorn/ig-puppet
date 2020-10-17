/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LazyPage from './components/LazyPage';
import routes from './constants/routes.json';
import App from './pages/App';
import Home from './pages/Home';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path={routes.HOME} component={Home} />
        <Route
          path={routes.ACCOUNTS.ADD_NEW}
          component={LazyPage.AccountsAdd}
        />
        <Route
          path={routes.ACCOUNTS.BASE}
          component={LazyPage.AccountsOverview}
        />
        <Route
          path={routes.ACTIONS.FOLLOW_FOLLOWERS}
          component={LazyPage.FollowFollowers}
        />
        <Route path={routes.ACTIONS.LIKE_TAGS} component={LazyPage.LikeTags} />
        <Route path={routes.ACTIONS.DIRECT} component={LazyPage.Direct} />
      </Switch>
    </App>
  );
}
