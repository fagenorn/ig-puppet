import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import DirectOptions from '../../types/direct';
import Sessions from '../../components/Sessions';
import PlaywrightService from '../../utils/playwright';
import SessionDropDown from '../../components/SessionDropDown';
import StringArrayInput from '../../components/StringArrayInput';

export default function DirectPage(): JSX.Element {
  const history = useHistory();
  const [actionOptions, setActionOptions] = useState({
    messages: [] as string[],
    users: [] as string[],
    users_per_message: 0,
    delay: 0,
  } as DirectOptions);
  const [session, SessionDropDownElement] = SessionDropDown();
  const [hasError, setHasError] = useState(false);
  const setUsersPerMessage = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({
      ...actionOptions,
      users_per_message: parseInt(e.target.value, 10),
    });
  const setDelay = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({
      ...actionOptions,
      delay: parseInt(e.target.value, 10),
    });
  const setMessages = (strings: string[]) =>
    setActionOptions({
      ...actionOptions,
      messages: strings,
    });
  const setUsers = (strings: string[]) =>
    setActionOptions({
      ...actionOptions,
      users: strings,
    });

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!session || !actionOptions) {
      setHasError(true);
      return;
    }

    session
      .update({ $set: { status: 'active' } })
      .then(() =>
        PlaywrightService.direct(session, actionOptions).finally(() =>
          session.update({ $set: { status: 'inactive' } })
        )
      )
      .catch(() => null);

    history.push('/accounts');
  }

  return (
    <div className="content">
      <Container fluid="md">
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>Direct Message</Card.Title>
              </Card.Header>
              <Card.Body>
                {hasError && (
                  <Alert
                    variant="danger"
                    onClose={() => setHasError(false)}
                    dismissible
                  >
                    Failed to start, make sure your parameters are correct.
                  </Alert>
                )}
                <Form>
                  <Form.Group controlId="fAccount">
                    <Form.Label>Account</Form.Label>
                    <SessionDropDownElement />
                  </Form.Group>
                  <Form.Group controlId="fUsersPerMessage">
                    <Form.Label>Users per Message</Form.Label>
                    <Form.Control
                      type="number"
                      value={actionOptions.users_per_message}
                      onChange={setUsersPerMessage}
                    />
                    <Form.Text className="text-muted">
                      Number of users to message per DM.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="fDelay">
                    <Form.Label>Delay</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        step="100"
                        min="0"
                        value={actionOptions.delay}
                        onChange={setDelay}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text id="inputGroup-sizing-default">
                          Millisec
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Delay between actions.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="fUsers">
                    <Form.Label>Users</Form.Label>
                    <StringArrayInput
                      strings={actionOptions.users}
                      setStrings={setUsers}
                    />
                  </Form.Group>

                  <Form.Group controlId="fMessages">
                    <Form.Label>Messages</Form.Label>
                    <StringArrayInput
                      strings={actionOptions.messages}
                      setStrings={setMessages}
                    />
                  </Form.Group>

                  <hr />

                  <Button
                    variant="success"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Start
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
