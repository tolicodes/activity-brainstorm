import React from 'react';
import { useEffect } from 'react';

export default (fields: any, props: any) => {
  useEffect(() => {
    if (!fields || !props) return;

    const passThroughProps = (Editor: any, editorProps: any) => (properties: any) => {
      if (!(properties.row?.id)) return null;

      return (
        <Editor
          {...properties}
          {...props}
          editorProps={editorProps}
        />
      );
    };

    fields.forEach((field: any) => {
      const {
        editor,
        formatter,
        editorProps,
      } = field;

      field.editor = editor && passThroughProps(editor, editorProps);
      field.formatter = formatter && passThroughProps(formatter, editorProps);
    });
  }, [fields, props])
}