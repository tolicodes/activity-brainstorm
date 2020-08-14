import debug from '../../../helpers/debug';

export default async ({
  row,
  subKey,
  // Note: has to be keyVal because key is reserved
  keyVal: key,
  updateFn,
}: any, newValue: any) => {
  let valueObj;

  if (subKey) {
    // @todo why get?
    const data = (await row.doc.get()).data();
    valueObj = data[key] = data[key] || {};
    // @ts-ignore
    valueObj[subKey] = newValue;
  }

  const update = valueObj || newValue;
  debug('admin/DataGrid/Editors/updateValue', `updateValue: ${key}${subKey ? `.${subKey}` : ''}`, update)

  return updateFn(row.doc, {
    [key]: update
  });
}