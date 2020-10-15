import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Jumbotron,
  Row,
  Spinner,
} from 'react-bootstrap';
import routes from '../constants/routes.json';
// import UserPrefs from '../components/UserPrefs';

// const { dialog } = require('electron').remote;

export default function Home(): JSX.Element {
  // const [userprefs, loading, updateUserPrefs] = UserPrefs();
  // const updateBrowserPath = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   updateUserPrefs((prefs) => {
  //     prefs.browserPath = value;
  //     return prefs;
  //   });
  // };

  // const selectBrowsePathDialog = async () => {
  //   const file = await dialog.showOpenDialog({
  //     filters: [{ extensions: ['exe'], name: 'firefox' }],
  //     defaultPath: userprefs.browserPath,
  //     title: 'Select Firefox Executable',
  //   });

  //   const [selected] = file.filePaths;
  //   if (!selected) return;
  //   updateUserPrefs((prefs) => {
  //     prefs.browserPath = selected;
  //     return prefs;
  //   });
  // };

  return (
    <div className="content">
      <Container fluid="md">
        {/* <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>User Configuration</Card.Title>
              </Card.Header>
              <Card.Body>
                {loading && (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                )}
                {!loading && (
                  <Form.Group controlId="fUserPrefsBrowserPath">
                    <Form.Label>Firefox Browser Path</Form.Label>
                    <InputGroup className="mb-3">
                      <FormControl
                        value={userprefs.browserPath}
                        onChange={updateBrowserPath}
                        placeholder="\path\to\browser\firefox.exe"
                        readOnly
                      />
                      <InputGroup.Append>
                        <Button
                          variant="outline-secondary"
                          onClick={selectBrowsePathDialog}
                        >
                          Browse
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
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
