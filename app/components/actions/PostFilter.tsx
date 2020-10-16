import moment from 'moment';
import * as React from 'react';
import { Form } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { PostFilterOptions } from '../../types/filter';

export default function PostFilter(props: Props) {
  const { filter } = props;
  const setFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    props.setFilter({ ...props.filter, [name]: value });
  };

  const setDate = (date: moment.Moment | string, name: string) => {
    const dateTs = typeof date === 'string' ? new Date(date) : date.toDate();
    if (!moment(dateTs, true).isValid()) return;
    props.setFilter({ ...props.filter, [name]: dateTs });
  };

  return (
    <>
      <Form.Group controlId="fFilterMaxLikes">
        <Form.Label>Max Likes</Form.Label>
        <Form.Control
          type="number"
          name="maxLikes"
          value={filter.maxLikes}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMinLikes">
        <Form.Label>Min Likes</Form.Label>
        <Form.Control
          type="number"
          name="minLikes"
          value={filter.minLikes}
          onChange={setFilter}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMaxAge">
        <Form.Label>Max Age</Form.Label>
        <Datetime
          onChange={(date) => setDate(date, 'maxAge')}
          value={filter.maxAge}
        />
      </Form.Group>

      <Form.Group controlId="fFilterMinAge">
        <Form.Label>Min Age</Form.Label>
        <Datetime
          onChange={(date) => setDate(date, 'minAge')}
          value={filter.minAge}
        />
      </Form.Group>
    </>
  );
}

interface Props {
  filter: PostFilterOptions;
  setFilter: (filter: PostFilterOptions) => void;
}
