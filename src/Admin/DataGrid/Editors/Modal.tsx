import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import Modal from '../../../commonComponents/Modal';

export default (props: any) => {
  // debugger;
  const { row, editorProps, fields: parentFields } = props;
  if (!editorProps) return null
  const { fields } = editorProps;
  const [modalOpen, setModalOpen] = useState(false);
  const nameFieldKey = parentFields.find((field: any) => field.nameField).key;

  return (
    <>
      <Button
        color="primary"
        onClick={() => setModalOpen(true)}
      >
        Edit Properties
      </Button>
      <Modal
        header={`Editing ${row[nameFieldKey]}`}
        setOpen={setModalOpen}
        open={modalOpen}
      >
        <table>
          <tbody>
            {fields.map((field: any) => {
              const Editor = field.editor;

              return (
                <tr key={field.subKey || field.key}>
                  <td>{field.name}</td>
                  <td>
                    <Editor
                      {...{
                        ...props,
                        // has to be keyVal because key
                        // is reserved
                        keyVal: field.key,
                        subKey: field.subKey,
                        editorProps: {
                          ...props.editorProps,
                          ...field.editorProps
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal>
    </>
  );
}
