import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import OverlayScrollbars from 'overlayscrollbars';
import { history, configuredStore } from './store';

const store = configuredStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./pages/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );

  OverlayScrollbars(document.body, {
    nativeScrollbarsOverlaid: {
      initialize: false,
    },
  });

  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  OverlayScrollbars(sidebar, {
    className: 'os-theme-light',
    nativeScrollbarsOverlaid: {
      initialize: false,
    },
  });
});
