import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function Header(): JSX.Element {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#!"
            role="button"
          >
            <FontAwesomeIcon icon="bars" />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to={routes.HOME} className="nav-link">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
}
