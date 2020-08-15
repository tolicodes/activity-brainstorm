import React from 'react';
import debugCreator from '../../helpers/debug';
import updateValue from './updateValue';

export default (Editor: any, passedThroughProps: any) => {
  const debug = debugCreator(`PassThroughEditor: ${passedThroughProps.keyVal}.${passedThroughProps.subKey}`)
  class PassThroughEditor extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = {
        editorRef: React.createRef(),
      };
    }

    getInputNode() {
      // @ts-ignore
      return this.state.editorRef.current?.querySelector('input');
    }

    getValue() {
      const {
        row
      } = this.props as any;

      // passed in via usePassThroughPropsToEditors
      // field definitions
      const {
        // can't use key because it's reserved
        keyVal: key,
        subKey,
      } = passedThroughProps;

      // @ts-ignore
      const { val: newValue, options } = this.state;

      const {
        saveToRoot,
        manualCommit,
        saveValue,
      } = this.mergeEditorProps(options)

      debug('options', {
        saveToRoot,
        manualCommit,
        saveValue
      });

      const newOptions = {
        // from now on we will have a root object
        saveToRoot: true,
        manualCommit,
        saveValue
      }

      // for example for modal
      if (saveValue === false) {
        return {
          options: {
            saveValue: false
          }
        };
      }

      // if we want to save the output to the root
      // of the document. Example: saving two keys
      // { image, thumbnailImage }
      // the value passed will be merged in with 
      // the root of the document instead of using
      // key/subKey
      if (saveToRoot) {
        debug('getValue - saveToRoot', {
          key,
          subKey,
          newValue
        });

        // we write the newValue (which is the root object)
        // along with options
        return {
          ...newValue,
          // pass through options (like manualCommit, saveToRoot)
          options: newOptions
        };
      }

      let objAtKey;

      if (subKey) {
        const data = row.doc.data();
        debug('getValue: subKey', {
          key,
          subKey,
          newValue,
          currentDataAtKey: data[key]
        });

        // @todo find out why this turns out to be true
        // sometimes
        // this is the object that will be saved to key
        // (will contain the subKey)
        objAtKey = (typeof data[key] === 'object' &&
          data[key]) || {};

        // @ts-ignore
        objAtKey[subKey] = newValue;
      } else {
        // we are saving directly to that key
        objAtKey = newValue;
      }

      const objAtRoot = {
        // pass through options (like manualCommit, saveToRoot)
        options: newOptions,
        [key]: objAtKey
      };

      debug('getValue: returning object', objAtRoot)

      return objAtRoot;
    }

    async save(valAndOpts: any) {
      await this.extractOptions(valAndOpts);
    }

    mergeEditorProps(options: any = {}) {
      // @ts-ignore
      const editorProps = passedThroughProps.editorProps || {};

      // merge in editorProps
      // @ts-ignore
      options.saveToRoot = options.saveToRoot || editorProps.saveToRoot;
      // @ts-ignore
      options.manualCommit = options.manualCommit || editorProps.manualCommit;

      options.saveValue = typeof options.saveValue === 'boolean' ?
        options.saveValue :
        editorProps.saveValue;

      return options;
    }

    extractOptions(valAndOpts: any) {
      debug('extractOptions got value', valAndOpts)
      return new Promise((resolve) => {
        // @ts-ignore
        let val;
        let options = {};

        // this is a plain value
        if (!valAndOpts.hasOwnProperty('options')) {
          val = valAndOpts;
        } else {
          // otherwise destructure the options out
          ({
            options,
            // @ts-ignore
            ...val
          } = valAndOpts);
        }

        options = this.mergeEditorProps(options);

        debug('setting state', {
          val,
          options,
        });

        this.setState({
          val,
          options
        }, resolve)
      });
    }

    async doCommit(valAndOpts: any) {
      await this.extractOptions(valAndOpts);

      const value = this.getValue();

      // @ts-ignore
      if (!this.state.options?.manualCommit) {
        //  commit to the grid
        debug('doCommit: Committing to DataGrid', value);
        // @ts-ignore
        this.props.onCommit();
        return;
      }

      debug('Doing a manual commit', value);

      // still save the value to the parent
      // @ts-ignore
      // this.props.save && this.props.save(value);

      // but run a manual update
      updateValue({
        // @ts-ignore
        row: this.props.row,
        // @ts-ignore
        updateFn: this.props.updateFn,
        updated: value
      });
    }

    render() {
      // @ts-ignore
      return <div ref={this.state.editorRef}>
        <Editor
          // own props (passed from Grid)
          {...this.props}
          // props passed from usePassThroughPropsToEditors
          // includes entity definition (from DataGrid index)
          // and keyVal and subKey and editorProps from 
          // the field definition (in the entities/ definition
          // JSON), passed in usePassThroughPropsToEditors
          {...passedThroughProps}
          // Call to save value (but not commit it)
          save={(val: any) => this.save(val)}
          // Call to save and commit value
          doCommit={(val: any) => this.doCommit(val)}
        />
      </div>
    }
  }

  return PassThroughEditor;
}