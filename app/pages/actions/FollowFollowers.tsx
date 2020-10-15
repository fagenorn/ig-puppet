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
import { UserFilterOptions } from '../../types/filter';
import FollowFollowersOptions from '../../types/follow';
import Sessions from '../../components/Sessions';
import CardWidget from '../../components/CardWidget';
import UserFilter from '../../components/actions/UserFilter';
import PlaywrightService from '../../utils/playwright';
import IgDatabase from '../../utils/database';

export default function FollowFollowersPage(): JSX.Element {
  const history = useHistory();
  const [actionOptions, setActionOptions] = useState({
    delay: 0,
    amount: 0,
    username: '',
  } as FollowFollowersOptions);
  const [filter, setFilter] = useState({
    mustHaveWebsite: false,
    mustNotBePrivate: false,
    mustHaveName: false,
    maxFollowers: 9_999_999,
    minFollowers: 0,
    maxFollowings: 9_999_999,
    minFollowings: 0,
    maxPosts: 9_999_999,
    minPosts: 0,
  } as UserFilterOptions);
  const [sessionId, setSessionId] = useState('');
  const [hasError, setHasError] = useState(false);
  const [sessions] = Sessions();
  const setAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({
      ...actionOptions,
      amount: parseInt(e.target.value, 10),
    });
  const setUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({ ...actionOptions, username: e.target.value });
  const setDelay = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({ ...actionOptions, delay: parseInt(e.target.value, 10) });

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    actionOptions.filter = filter;
    const session = await IgDatabase.database.sessions
      .findOne()
      .where('id')
      .eq(sessionId)
      .exec();

    if (!session || !actionOptions) {
      setHasError(true);
      return;
    }

    session
      .update({ $set: { status: 'active' } })
      .then(() =>
        PlaywrightService.follow_followers(session, actionOptions).finally(() =>
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
                <Card.Title>Follow Followers</Card.Title>
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
                    <Form.Control
                      as="select"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                    >
                      <option disabled value="">
                        -- select an option --
                      </option>
                      {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.username}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="fEmail">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={actionOptions.amount}
                      onChange={setAmount}
                    />
                    <Form.Text className="text-muted">
                      Number of users to follow.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="fUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={actionOptions.username}
                      onChange={setUsername}
                    />
                    <Form.Text className="text-muted">
                      Username of the user you want to scrape from.
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

                  <hr />

                  <CardWidget title={<h4>User Filters</h4>} isCollapsed>
                    <UserFilter filter={filter} setFilter={setFilter} />
                  </CardWidget>
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
