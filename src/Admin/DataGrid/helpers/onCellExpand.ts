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

export default () => { }