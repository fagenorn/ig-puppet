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
import { PostFilterOptions } from '../../types/filter';
import CardWidget from '../../components/CardWidget';
import PostFilter from '../../components/actions/PostFilter';
import PlaywrightService from '../../utils/playwright';
import SessionDropDown from '../../components/SessionDropDown';
import LikeHashtagOptions from '../../types/like';

export default function LikeTagsPage(): JSX.Element {
  const history = useHistory();
  const [actionOptions, setActionOptions] = useState({
    delay: 0,
    amount: 0,
    tag: '',
  } as LikeHashtagOptions);
  const [filter, setFilter] = useState({
    maxLikes: 999_999_999,
    minLikes: 0,
    maxAge: new Date(2050, 1),
    minAge: new Date(1975, 1),
  } as PostFilterOptions);
  const [session, SessionDropDownElement] = SessionDropDown();
  const [hasError, setHasError] = useState(false);
  const setAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({
      ...actionOptions,
      amount: parseInt(e.target.value, 10),
    });
  const setTag = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({ ...actionOptions, tag: e.target.value });
  const setDelay = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionOptions({ ...actionOptions, delay: parseInt(e.target.value, 10) });

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
        PlaywrightService.like_tag(session, actionOptions).finally(() =>
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
                <Card.Title>Like Tags</Card.Title>
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
                      Number of posts to like.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="fUsername">
                    <Form.Label>Hashtag</Form.Label>
                    <Form.Control
                      type="text"
                      value={actionOptions.tag}
                      onChange={setTag}
                    />
                    <Form.Text className="text-muted">
                      Hashtag you want to scrape from.
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

                  <CardWidget title={<h4>Post Filters</h4>} isCollapsed>
                    <PostFilter filter={filter} setFilter={setFilter} />
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
