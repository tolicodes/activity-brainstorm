import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import Modal from '../../commonComponents/Modal';
import usePassThroughPropsToEditors from '../DataGrid/helpers/usePassThroughPropsToEditors';

const Editor = (props: any) => {
  const {
    row,
    editorProps = {},
    fields: parentFields,
  } = props;
  const { fields: fieldsOriginal } = editorProps;

  const [modalOpen, setModalOpenOriginal] = useState(true);
  const nameFieldKey = parentFields.find((field: any) => field.nameField).key;

  const setModalOpen = (value: any) => {
    props.onCommitCancel();
    setModalOpenOriginal(value);
  }

  const fields = usePassThroughPropsToEditors(fieldsOriginal || [], {
    editorProps: {
      manualCommit: true,
    },
  });

  if (!fields) return null

  return (
    <>
      {<Modal
        header={`Editing ${row[nameFieldKey]}`}
        setOpen={setModalOpen}
        open={modalOpen}
      >
        <table>
          <tbody>
            {/* @ts-ignore */}
            {fields.map((field: any) => {
              const Editor = field.editor;

              return (
                <tr key={field.subKey || field.key}>
                  <td>{field.name}</td>
                  <td>
                    <Editor
                      {...props}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal>}
    </>
  );
}

const Formatter = (() => (
  <Button
    color="primary"
  >
    Edit Properties
  </Button>
));

export default {
  editor: Editor,
  formatter: Formatter,
  editable: true,
  defaultEditorProps: {
    saveValue: false,
  }
}