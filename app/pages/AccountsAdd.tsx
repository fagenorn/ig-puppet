import * as React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import CardWidget from '../components/CardWidget';
import IgDatabase from '../utils/database';
import SessionOptions, { Proxy } from '../types/session';
import Sessions from '../components/Sessions';

const { dialog } = require('electron').remote;

export default function AddAccountPage() {
  const [sessions] = Sessions();
  const [session, setSessionState] = useState({
    username: '',
    password: '',
  } as SessionOptions);
  const [proxy, setProxyState] = useState({
    host: '',
    port: 0,
    username: '',
    password: '',
  } as Proxy);
  const history = useHistory();

  const setSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { value } = target;
    const { name } = target;

    setSessionState({ ...session, [name]: value });
  };

  const setProxy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const value =
      target.type === 'number' ? parseInt(target.value, 10) : target.value;
    const { name } = target;

    setProxyState({ ...proxy, [name]: value });
  };

  const generateId = async (): Promise<string> => {
    const largest = await IgDatabase.database.sessions
      .findOne()
      .sort({ id: 'desc' })
      .exec();

    return largest ? `${parseInt(largest.id, 10) + 1}` : '0';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sessions.length >= 2) {
      await dialog.showMessageBox({
        message: "Can't add any more accounts.",
        title: 'Error',
      });
      history.push('/accounts');

      return;
    }

    session.id = await generateId();
    session.status = 'inactive';

    if (proxy.host && proxy.port) {
      session.proxy = proxy;
    }

    IgDatabase.database.sessions.insert(session);

    history.push('/accounts');
  };

  return (
    <div className="content">
      <Container fluid="md">
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>Add Account</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={session.username}
                      onChange={setSession}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={session.password}
                      onChange={setSession}
                    />
                  </Form.Group>

                  <CardWidget title={<h4>Proxy</h4>} isCollapsed>
                    <Form.Group controlId="fProxyHost">
                      <Form.Label>Host</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="192.168.1.1"
                        name="host"
                        value={proxy.host}
                        onChange={setProxy}
                      />
                    </Form.Group>

                    <Form.Group controlId="fProxyPort">
                      <Form.Label>Port</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="8000"
                        name="port"
                        value={proxy.port}
                        onChange={setProxy}
                      />
                    </Form.Group>

                    <Form.Group controlId="fProxyUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={proxy.username}
                        onChange={setProxy}
                      />
                    </Form.Group>

                    <Form.Group controlId="fProxyPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={proxy.password}
                        onChange={setProxy}
                      />
                    </Form.Group>
                  </CardWidget>

                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
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
