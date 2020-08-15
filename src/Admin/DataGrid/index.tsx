import React, { useRef } from 'react';
import { createGlobalStyle } from 'styled-components';
import 'react-data-grid/dist/react-data-grid.css';
import ReactDataGrid from 'react-data-grid';

import onRowsUpdate from './dbConnectors/firebase/onRowsUpdate';
import useSortEntities from './helpers/useSortEntities';
import usePassThroughPropsToEditors from './helpers/usePassThroughPropsToEditors';

const ROW_HEIGHT = 100;
const HEADER_ROW_HEIGHT = 30;

const StyledGrid = createGlobalStyle`
  .rdg {
    height: 100vh !important;
  }
`;

export default ({ entity }: any) => {
  const dataGridRef = useRef(null);

  const {
    collection,
    fields,
    updateFn,
    createFn,
  } = entity;

  // pass fields like collection, createFn, updateFn, and fields to the editors
  const fieldsWithProps = usePassThroughPropsToEditors(fields, {
    entity,
    // list of fields
    fields,

    // db functions
    updateFn,
    createFn,

    // @ts-ignore
    selectCell: (...props) => {
      // @ts-ignore
      dataGridRef.current.selectCell(...props)
    }
  });

  // sort entities
  const entityRows = useSortEntities(collection, entity);

  if (!fieldsWithProps || !collection) return null

  // add blank row on top (new entry)
  const rows = [
    {},
    ...entityRows
  ];

  return (
    <div>
      {/* for height: 100vh */}
      <StyledGrid />

      {
        rows && <ReactDataGrid
          // @ts-ignore
          ref={dataGridRef}
          // @ts-ignore
          columns={fieldsWithProps}
          // @ts-ignore
          rows={rows}

          headerRowHeight={HEADER_ROW_HEIGHT}
          rowHeight={ROW_HEIGHT}

          onRowsUpdate={(props: any) => onRowsUpdate({
            ...props,
            rows,
            updateFn,
            createFn,
            fields,
          })}

          onRowClick={(rowIdx: number, row: any, column: any) => {
            // @ts-ignore
            dataGridRef.current?.selectCell({ rowIdx, idx: column.idx }, true);
          }}
        />
      }
    </div>
  )
}