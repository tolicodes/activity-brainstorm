export default (
  {
    row,
    // using in modal
    keyVal: key,
    subKey,
  }: any,
  defaultValue?: any
) => {
  if (subKey) {
    return (row[key] && (row[key][subKey] !== undefined)) ?
      (row[key][subKey]) :
      defaultValue;
  }

  return (row[key] !== undefined) ?
    row[key] :
    defaultValue;
}