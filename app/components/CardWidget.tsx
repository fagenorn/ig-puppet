import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import $ from 'jquery';

interface Props {
  title: React.ReactNode;
  isCollapsed: boolean;
  children: React.ReactNode;
}

export default function CardWidget(props: Props) {
  const { title, isCollapsed, children } = props;
  const [isCollapse, setIsCollapse] = useState(isCollapsed);
  const body = useRef<HTMLDivElement>(null);

  const collapse = () => {
    $(body.current as HTMLDivElement).slideUp('normal', () =>
      setIsCollapse(true)
    );
  };

  const expand = () => {
    $(body.current as HTMLDivElement).slideDown('normal', () =>
      setIsCollapse(false)
    );
  };

  useEffect(() => {
    if (isCollapse) {
      $(body.current as HTMLDivElement).hide();
    }
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            onClick={() => (isCollapse ? expand() : collapse())}
            data-card-widget="collapse"
          >
            <FontAwesomeIcon icon={isCollapse ? 'plus' : 'minus'} />
          </button>
        </div>
      </Card.Header>
      <Card.Body ref={body}>{children}</Card.Body>
    </Card>
  );
}
