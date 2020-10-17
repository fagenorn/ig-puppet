import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, FormControl, InputGroup, Table } from 'react-bootstrap';
import fs from 'fs';
import { remote } from 'electron';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

export default function StringArrayInput(props: Props) {
  const { strings, setStrings } = props;
  const [input, setInput] = useState('');
  const importFile = async () => {
    const dialogResult = await remote.dialog.showOpenDialog({
      filters: [{ extensions: ['txt'], name: 'Text File' }],
      properties: ['openFile'],
    });

    if (!dialogResult || !dialogResult.filePaths[0]) return;
    const stream = fs.createReadStream(dialogResult.filePaths[0], 'utf-8');

    stream.on('data', (data: string) => {
      const lines = data
        .split(/\n/)
        .map((x) => x.replace(/\r?\n|\r/g, ''))
        .filter((x) => x.trim() && strings.indexOf(x) === -1);
      setStrings([...strings, ...lines]);
      stream.destroy();
    });
  };

  return (
    <div>
      <InputGroup>
        <FormControl value={input} onChange={(e) => setInput(e.target.value)} />

        <InputGroup.Append>
          <Button variant="info" onClick={importFile}>
            <span className="mr-2">Import</span>
            <FontAwesomeIcon icon="file-upload" />
          </Button>
        </InputGroup.Append>

        <InputGroup.Append>
          <Button
            variant="primary"
            onClick={() => {
              if (strings.indexOf(input) === -1) {
                strings.push(input);
                setStrings(strings);
              }

              setInput('');
            }}
          >
            <span className="mr-2">Add</span>
            <FontAwesomeIcon icon="plus" />
          </Button>
        </InputGroup.Append>
      </InputGroup>

      <OverlayScrollbarsComponent style={{ maxHeight: '350px' }}>
        <Table bordered hover size="sm" className="mt-1">
          <tbody>
            {strings.map((item) => {
              return (
                <tr key={item}>
                  <td>{item}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
    </div>
  );
}

interface Props {
  strings: string[];
  setStrings: (strings: string[]) => unknown;
}
