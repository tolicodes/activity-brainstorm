import { useState, useEffect } from 'react';
import PassThroughEditor from '../../Editors/PassThroughEditor';

import debugCreator from '../../../helpers/debug';

const debug = debugCreator('usePassThroughPropsToEditors');

export default (fields: any, passedThroughProps: any) => {
  const [updatedFields, setUpdatedFields] = useState();

  useEffect(() => {
    fields.forEach((field: any) => {
      const {
        editor,
        formatter,
        editorProps,
        defaultEditorProps,
        key,
        subKey
      } = field;

      const checkIfPassThroughEditor = (obj: any) => {
        function isObject(x: any) {
          return x && x.prototype && !(typeof x === 'function')
        }

        if (!isObject(obj)) return false;
        return obj instanceof PassThroughEditor;
      }

      const finalPassedThroughProps = {
        // entity definition and list of fields
        ...passedThroughProps,
        // has to be keyVal because key is reserved
        keyVal: key,
        subKey,
        // this editor's props (ex: URLs)
        // we might want to pass some editor props
        // from the parent (ex: modal) like manualCommit
        editorProps: {
          ...defaultEditorProps,
          ...(passedThroughProps?.editorProps || {}),
          ...editorProps
        },
      }

      debug('finalPassedThroughProps', {
        finalPassedThroughProps,
        key,
        subKey
      })

      field.editor = editor && (checkIfPassThroughEditor(editor) ?
        editor :
        PassThroughEditor(editor, finalPassedThroughProps));

      field.formatter = formatter && (checkIfPassThroughEditor(formatter) ?
        formatter :
        PassThroughEditor(formatter, finalPassedThroughProps));
    });

    setUpdatedFields(fields);
  }, [fields]);

  return updatedFields;
}