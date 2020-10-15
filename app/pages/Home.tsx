import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron } from 'react-bootstrap';
import routes from '../constants/routes.json';

export default function Home(): JSX.Element {
  return (
    <div className="content">
      <Container fluid="md">
        <Jumbotron fluid>
          <Container>
            <h1>Welcome</h1>
            <p>
              Get started by adding an
              <Link to={routes.ACCOUNTS.BASE}> account </Link>
              then you can start your
              <Link to={routes.ACTIONS.FOLLOW_FOLLOWERS}> follow action </Link>
            </p>
          </Container>
        </Jumbotron>
      </Container>
    </div>
  );
}
