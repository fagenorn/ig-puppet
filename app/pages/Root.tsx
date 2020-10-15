import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Store } from '../store';
import Routes from '../Routes';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../sass/app.global.scss';
import routes from '../constants/routes.json';

library.add(fas);

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0 text-dark">Dashboard v3</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to={routes.HOME}>Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Dashboard v3</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <Routes />
        </div>
        <Footer />
      </div>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
