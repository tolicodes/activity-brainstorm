import React from 'react';

interface IProps {
  render: any
  Editor: any
}

interface IState {
  editorRef: any
}

export default (Editor: any, render?: any) => {
  class PassThroughEditor extends React.Component<IProps, IState> {
    constructor(props: any) {
      super(props);
      this.state = { editorRef: React.createRef() };
    }

    getInputNode() {
      // @ts-ignore
      return this.state.editorRef.current?.querySelector('input');
    }

    getValue() {
      return null;
    }

    render() {
      if (render) {
        return render(this.props);
      }

      return <div ref={this.state.editorRef}><Editor {...this.props} /></div>
    }
  }

  return PassThroughEditor;
}