import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

import userImg from '../assets/user2-160x160.jpg';
import logoImg from '../assets/AdminLTELogo.png';

// AdminLTE
import { initLayout } from '../utils/layout';
import { initTreeview } from '../utils/treeview';
import { initPushMenu } from '../utils/push-menu';

import routes from '../constants/routes.json';

export default function Sidebar(): JSX.Element {
  React.useEffect(() => {
    initLayout();
    initTreeview();
    initPushMenu();
  }, []);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="index3.html" className="brand-link">
        <img
          src={logoImg}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">IG Puppet</span>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src={userImg}
              className="img-circle elevation-2"
              alt="User Profile"
            />
          </div>
          <div className="info">
            <a href="#!" className="d-block">
              Alexander Pierce
            </a>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <NavLink to="/home" className="nav-link" activeClassName="active">
                <FontAwesomeIcon className="nav-icon" icon="th" />
                <p>Home</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={routes.ACCOUNTS.BASE}
                className="nav-link"
                activeClassName="active"
              >
                <FontAwesomeIcon className="nav-icon" icon="th" />
                <p>Accounts</p>
              </NavLink>
            </li>
            <li className="nav-item has-treeview">
              <NavLink
                to={routes.ACTIONS.BASE}
                className="nav-link"
                activeClassName="active"
              >
                <FontAwesomeIcon className="nav-icon" icon="th" />
                <p>
                  Start Action
                  <FontAwesomeIcon className="right" icon="angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink
                    to={routes.ACTIONS.FOLLOW_FOLLOWERS}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <FontAwesomeIcon className="nav-icon" icon="th" />
                    <p>Follow Followers</p>
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
}
