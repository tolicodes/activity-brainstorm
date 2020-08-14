import React, { useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import 'react-data-grid/dist/react-data-grid.css';
import ReactDataGrid from 'react-data-grid';

import onRowsUpdate from './dbConnectors/firebase/onRowsUpdate';
import onCellExpand from './helpers/onCellExpand';
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
  const {
    collection,
    fields,
    updateFn,
    createFn,
  } = entity;

  // pass fields like collection, createFn, updateFn, and fields to the editors
  usePassThroughPropsToEditors(fields, entity);

  // sort entities
  const entityRows = useSortEntities(collection, entity);

  if (!entityRows.length) return null;

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
          columns={fields}
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

          enableCellSelect={true}

        // Cell Expand
        // toolbar={<Toolbar enableFilter={true} />
        // getSubRowDetails={}
        />
      }
    </div>
  )
}