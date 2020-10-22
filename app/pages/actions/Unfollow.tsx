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
import UnfollowFollowersOptions from '../../types/unfollow';
import CardWidget from '../../components/CardWidget';
import UserFilter from '../../components/actions/UserFilter';
import PlaywrightService from '../../utils/playwright';
import SessionDropDown from '../../components/SessionDropDown';

export default function UnfollowPage(): JSX.Element {
  const history = useHistory();
  const [actionOptions, setActionOptions] = useState({
    delay: 0,
    amount: 0,
    ignoreFollowers: false,
  } as UnfollowFollowersOptions);
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
  const [session, SessionDropDownElement] = SessionDropDown();
  const [hasError, setHasError] = useState(false);
  const setAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({
      ...actionOptions,
      amount: parseInt(e.target.value, 10),
    });
  const setDelay = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({ ...actionOptions, delay: parseInt(e.target.value, 10) });
  const setIgnoreFollowers = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({
      ...actionOptions,
      ignoreFollowers: e.target.checked,
    });

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    actionOptions.filter = filter;

    if (!session || !actionOptions) {
      setHasError(true);
      return;
    }

    session
      .update({ $set: { status: 'active' } })
      .then(() =>
        PlaywrightService.unfollow(session, actionOptions).finally(() =>
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
                <Card.Title>Unfollow</Card.Title>
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
                  <Form.Group controlId="fEmail">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={actionOptions.amount}
                      onChange={setAmount}
                    />
                    <Form.Text className="text-muted">
                      Number of users to unfollow.
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
                      Delay between each unfollow.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="fIgnoreFollowers">
                    <Form.Check
                      type="checkbox"
                      label="Ignore followers."
                      checked={actionOptions.ignoreFollowers}
                      onChange={setIgnoreFollowers}
                    />
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
