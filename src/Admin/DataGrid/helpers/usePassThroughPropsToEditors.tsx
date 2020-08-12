import React from 'react';
import { useEffect } from 'react';

export default (fields: any, props: any) => {
  useEffect(() => {
    const passThroughProps = (Editor: any) => (properties: any) => (
      <Editor
        {...properties}
        {...props}
      />
    );

    fields.forEach((field: any) => {
      const {
        editor,
        formatter,
      } = field;

      field.editor = editor && passThroughProps(editor);
      field.formatter = formatter && passThroughProps(formatter);
    });
  })
}