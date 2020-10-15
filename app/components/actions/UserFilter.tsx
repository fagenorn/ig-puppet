import * as React from 'react';
import { Form } from 'react-bootstrap';
import { UserFilterOptions } from '../../types/filter';

export default function UserFilter(props: Props) {
  const { filter } = props;
  const setFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    props.setFilter({ ...props.filter, [name]: value });
  };

  return (
    <>
      <Form.Group controlId="fFilterPrivate">
        <Form.Check
          type="checkbox"
          label="Ignore private users"
          name="mustNotBePrivate"
          checked={filter.mustNotBePrivate}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterWebsite">
        <Form.Check
          type="checkbox"
          label="Ignore users without website"
          name="mustHaveWebsite"
          checked={filter.mustHaveWebsite}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterName">
        <Form.Check
          type="checkbox"
          label="Ignore users without name"
          name="mustHaveName"
          checked={filter.mustHaveName}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMaxFollowers">
        <Form.Label>Max Followers</Form.Label>
        <Form.Control
          type="number"
          name="maxFollowers"
          value={filter.maxFollowers}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMinFollowers">
        <Form.Label>Min Followers</Form.Label>
        <Form.Control
          type="number"
          name="minFollowers"
          value={filter.minFollowers}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMaxFollowings">
        <Form.Label>Max Followings</Form.Label>
        <Form.Control
          type="number"
          name="maxFollowings"
          value={filter.maxFollowings}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMinFollowings">
        <Form.Label>Min Followings</Form.Label>
        <Form.Control
          type="number"
          name="minFollowings"
          value={filter.minFollowings}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMaxPosts">
        <Form.Label>Max Posts</Form.Label>
        <Form.Control
          type="number"
          name="maxPosts"
          value={filter.maxPosts}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMinPosts">
        <Form.Label>Min Posts</Form.Label>
        <Form.Control
          type="number"
          name="minPosts"
          value={filter.minPosts}
          onChange={setFilter}
        />
      </Form.Group>
    </>
  );
}

interface Props {
  filter: UserFilterOptions;
  setFilter: (filter: UserFilterOptions) => void;
}
