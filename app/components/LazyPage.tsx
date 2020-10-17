/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Loading from './Loading';

export default class LazyPage {
  static AccountsOverview = (props: Record<string, never>) => {
    const Page = React.lazy(() =>
      import(/* webpackChunkName: "Pages" */ '../pages/Accounts')
    );

    return (
      <React.Suspense fallback={Loading()}>
        <Page {...props} />
      </React.Suspense>
    );
  };

  static AccountsAdd = (props: Record<string, never>) => {
    const Page = React.lazy(() =>
      import(/* webpackChunkName: "Pages" */ '../pages/AccountsAdd')
    );

    return (
      <React.Suspense fallback={Loading()}>
        <Page {...props} />
      </React.Suspense>
    );
  };

  static FollowFollowers = (props: Record<string, never>) => {
    const Page = React.lazy(() =>
      import(/* webpackChunkName: "Pages" */ '../pages/actions/FollowFollowers')
    );

    return (
      <React.Suspense fallback={Loading()}>
        <Page {...props} />
      </React.Suspense>
    );
  };

  static LikeTags = (props: Record<string, never>) => {
    const Page = React.lazy(() =>
      import(/* webpackChunkName: "Pages" */ '../pages/actions/LikeTags')
    );

    return (
      <React.Suspense fallback={Loading()}>
        <Page {...props} />
      </React.Suspense>
    );
  };

  static Direct = (props: Record<string, never>) => {
    const Page = React.lazy(() =>
      import(/* webpackChunkName: "Pages" */ '../pages/actions/Direct')
    );

    return (
      <React.Suspense fallback={Loading()}>
        <Page {...props} />
      </React.Suspense>
    );
  };
}
