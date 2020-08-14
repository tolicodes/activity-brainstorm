export default ({
  fromRow,
  toRow,
  updated,
  fields,
  createFn,
  updateFn,
  rows,
}: {
  fromRow: number,
  toRow: number,
  updated: any,
  // @todo
  fields: any,
  createFn: any,
  updateFn: any,
  rows: any
}) => {
  if (fromRow === 0) {
    // blank row
    // we want to check if the first field is updated
    if (!updated[fields[0].key]) return;

    createFn(updated);
    return;
  }

  for (let i = fromRow; i <= toRow; i++) {
    // @ts-ignore
    updateFn(rows[i].doc, updated);
  }
};