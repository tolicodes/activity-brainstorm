import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import 'react-data-grid/dist/react-data-grid.css';
import ReactDataGrid from 'react-data-grid';
import { useCollection } from 'react-firebase-hooks/firestore';

import { createActivity, activitiesCollection, updateActivity } from '../../apiHelpers';

import NameFormatter from './NameCell';
import AzureImageSearch, { Editor as AzureImageSearchEditor } from './AzureImageSearch';
import Checkbox from './Checkbox';
import GooglePlacesAutocomplete, { Editor as GooglePlacesAutocompleteEditor } from './GooglePlacesAutocomplete';

const ROW_HEIGHT = 100;

const StyledGrid = createGlobalStyle`
  .rdg {
    height: 100vh !important;
  }
`;

export default () => {
  const [activities] = useCollection(activitiesCollection);
  const [positions, setPositions] = useState({});
  const [activityRows, setActivityRows] = useState([]);

  const onRowsUpdate = ({ fromRow, toRow, updated }: { fromRow: number, toRow: number, updated: any }) => {
    // @ts-ignore
    if (!activityRows) return;

    if (fromRow === 0) {
      // blank row
      if (!updated.name) return;
      createActivity(updated);
      return;
    }

    for (let i = fromRow; i <= toRow; i++) {
      // @ts-ignore
      updateActivity(rows[i].doc, updated);
    }
  };

  // const onCellExpand = args => ({ rows, expandedRows }) => {
  //   const rowKey = args.rowData.id;
  //   const rowIndex = rows.indexOf(args.rowData);
  //   const subRows = args.expandArgs.children;
  //   if (expandedRows && !expandedRows[rowKey]) {
  //     expandedRows[rowKey] = true;
  //     updateSubRowDetails(subRows, args.rowData.treeDepth);
  //     rows.splice(rowIndex + 1, 0, ...subRows);
  //   } else if (expandedRows[rowKey]) {
  //     expandedRows[rowKey] = false;
  //     rows.splice(rowIndex + 1, subRows.length);
  //   }
  //   setExpandedRow(expandedRows, rows };
  // };

  const columns = [
    { key: "name", name: "Name", editable: true, formatter: NameFormatter },
    { key: "imageUrl", name: "Image", editor: AzureImageSearchEditor, formatter: AzureImageSearch, editable: true },
    { key: "covidFriendly", name: "COVID Friendly", formatter: Checkbox, editor: Checkbox, editable: true },
    { key: "openNow", name: "Open Now", formatter: Checkbox, editor: Checkbox, editable: true },
    { key: "location", name: "Location", formatter: GooglePlacesAutocomplete, editor: GooglePlacesAutocompleteEditor, editable: true },
  ];

  useEffect(() => {
    if (!activities) return
    const activityRows = activities.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      doc: activitiesCollection.doc(doc.id),
    }));

    // we want to sort by the existing position (in case we edit something, and lastUpdated changes) or by the
    // last updated date
    // @ts-ignore
    activityRows.sort(({ lastUpdated: lastUpdatedA = new Date(), id: idA }, { lastUpdated: lastUpdatedB = new Date(), id: idB }) => {
      // @ts-ignore 
      return (positions[idA] - positions[idB]) || (lastUpdatedB.seconds - lastUpdatedA.seconds);
    });

    activityRows.map((data: any, i: number) => {
      // @ts-ignore
      if (positions[data.id]) return data;

      // @ts-ignore
      positions[data.id] = i + 1;

      return data;
    });

    setPositions(positions);
    // @ts-ignore;

    setActivityRows(activityRows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  if (!activityRows.length) return null;

  const rows = [
    {},
    ...activityRows
  ];

  return (
    <div>
      {/* for height: 100vh */}
      <StyledGrid />
      {
        activities && <ReactDataGrid
          // @ts-ignore
          columns={columns}
          // @ts-ignore
          rows={rows}
          headerRowHeight={30}
          rowHeight={ROW_HEIGHT}
          // toolbar={<Toolbar enableFilter={true} />}
          onRowsUpdate={onRowsUpdate}
          enableCellSelect={true}
        // getSubRowDetails={}
        />
      }
    </div>
  )
}