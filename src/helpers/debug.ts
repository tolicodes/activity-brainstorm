const DEBUG = true;

console.time();

export default (component: any) => (what: any, data: any) => {
  console.timeEnd();
  // console.trace();
  DEBUG && console.log(`${component} - ${what}`, data)
  console.time();
}