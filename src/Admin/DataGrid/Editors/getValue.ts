export default (
  {
    row,
    // using directly
    column: { key },
    // using in modal
    keyVal: keyVal,
    subKey,
  }: any,
  defaultValue: any
) => {
  const fieldKey = keyVal === undefined ? key : keyVal
  if (subKey) {
    return (row[fieldKey] && row[fieldKey][subKey] !== undefined) ?
      (row[fieldKey][subKey]) :
      defaultValue;
  }

  return (typeof row[fieldKey] !== undefined) ?
    row[fieldKey] :
    defaultValue;
}