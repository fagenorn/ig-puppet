import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import fs from 'fs';
import Sessions from '../components/Sessions';
import IgDatabase from '../utils/database';
import SessionOptions from '../types/session';
import routes from '../constants/routes.json';

const fsPromises = fs.promises;

export default function AccountPage() {
  const [sessions, loading] = Sessions();
  const [deleting, setDeleting] = React.useState('');

  const deleteAccount = async (id: string) => {
    setDeleting(id);
    await IgDatabase.database.sessions.findOne().where('id').eq(id).remove();
    await fsPromises.rmdir(`./tmp/${id}`, { recursive: true });
  };

  const sessionStatusClass = (session: SessionOptions) => {
    switch (session.status) {
      case 'active':
        return 'success';
      case 'loading':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Accounts</Card.Title>
              <div className="text-right">
                <Link
                  to={routes.ACCOUNTS.ADD_NEW}
                  className="btn btn-sm bg-teal"
                >
                  <span className="mr-2">Add</span>
                  <FontAwesomeIcon icon="plus" />
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {loading && (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              )}
              {!loading && sessions.length === 0 && (
                <div className="d-flex justify-content-center">
                  <h3>No Accounts</h3>
                </div>
              )}
              {!loading && sessions.length !== 0 && (
                <Table bordered responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Proxy</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => {
                      return (
                        <tr key={session.id}>
                          <td>{session.id}</td>
                          <td>{session.username}</td>
                          <td>
                            {session.proxy
                              ? `${session.proxy.host}:${session.proxy.port}`
                              : 'N/A'}
                          </td>
                          <td>
                            <Badge variant={sessionStatusClass(session)}>
                              {session.status}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              disabled={
                                deleting === session.id &&
                                !!sessions.find((x) => x.id === session.id)
                              }
                              onClick={() => deleteAccount(session.id)}
                              size="sm"
                              variant="danger"
                            >
                              {deleting === session.id &&
                              !!sessions.find((x) => x.id === session.id) ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              ) : (
                                <div>
                                  <FontAwesomeIcon
                                    className="mr-1"
                                    icon="trash"
                                  />
                                  Delete
                                </div>
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
