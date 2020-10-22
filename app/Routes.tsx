/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './pages/App';
import Home from './pages/Home';
import AccountsAdd from './pages/AccountsAdd';
import AccountsOverview from './pages/Accounts';
import FollowFollowers from './pages/actions/FollowFollowers';
import LikeTags from './pages/actions/LikeTags';
import Direct from './pages/actions/Direct';
import Unfollow from './pages/actions/Unfollow';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path={routes.HOME} component={Home} />
        <Route path={routes.ACCOUNTS.ADD_NEW} component={AccountsAdd} />
        <Route path={routes.ACCOUNTS.BASE} component={AccountsOverview} />
        <Route
          path={routes.ACTIONS.FOLLOW_FOLLOWERS}
          component={FollowFollowers}
        />
        <Route path={routes.ACTIONS.LIKE_TAGS} component={LikeTags} />
        <Route path={routes.ACTIONS.DIRECT} component={Direct} />
        <Route path={routes.ACTIONS.UNFOLLOW} component={Unfollow} />
      </Switch>
    </App>
  );
}
