import debugCreator from '../../helpers/debug';
const merge = require('deepmerge')

const debug = debugCreator('admin/DataGrid/Editors/updateValue')

export default async ({
  row,
  updateFn,
  updated
}: any) => {
  const {
    options,
    ...updatedVal
  } = updated;

  const { doc, firebaseDoc } = row;
  debug('updatedValue', updatedVal);

  const overwriteMerge = (destinationArray: any, sourceArray: any) => sourceArray

  const mergedData = merge(doc.data(), updatedVal, { arrayMerge: overwriteMerge });
  debug('mergedUpdatedValue', mergedData);
  // @ts-ignore
  updateFn(firebaseDoc, mergedData);
}