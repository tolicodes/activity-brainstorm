const DEBUG = true;
export default (component: any, what: any, data: any) => {
  DEBUG && console.log(`${component} - ${what}`, data)
}