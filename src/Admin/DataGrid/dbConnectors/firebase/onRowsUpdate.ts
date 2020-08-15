import debugCreator from '../../../../helpers/debug';
import updateValue from '../../../Editors/updateValue';

const debug = debugCreator('onRowsUpdate');

export default async ({
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
  if (!updated) return;

  const {
    options,
    ...updatedVal
  } = updated;

  if (options?.saveValue === false) return;

  debug(`Updating row ${fromRow} to ${toRow} with value`, updated);

  if (fromRow === 0) {
    // blank row
    // we want to check if the first field is updated
    if (!updatedVal[fields[0].key]) return false;

    createFn(updatedVal);
    return;
  }

  for (let i = fromRow; i <= toRow; i++) {
    updateValue({
      row: rows[i],
      updated,
      updateFn,
    })
  }
};