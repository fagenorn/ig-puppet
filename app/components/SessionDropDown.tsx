/* eslint-disable @typescript-eslint/ban-types */
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { RxDocument } from 'rxdb';
import SessionOptions from '../types/session';
import IgDatabase from '../utils/database';
import Sessions from './Sessions';

export default function SessionDropDown(): [
  RxDocument<SessionOptions, {}> | null,
  () => JSX.Element
] {
  const [sessions] = Sessions();
  const [session, setSession] = useState(
    null as RxDocument<SessionOptions, {}> | null
  );

  const updateSession = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSession(
      await IgDatabase.database.sessions.findOne().where('id').eq(value).exec()
    );
  };

  return [
    session,
    () => {
      return (
        <Form.Control
          as="select"
          value={session?.id ?? ''}
          onChange={updateSession}
        >
          <option disabled value="">
            -- select an account --
          </option>
          {sessions.map((curr) => (
            <option key={curr.id} value={curr.id}>
              {curr.username}
            </option>
          ))}
        </Form.Control>
      );
    },
  ];
}
