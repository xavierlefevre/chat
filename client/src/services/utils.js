// @flow
/* eslint no-param-reassign: 0 */
export const sortObject = (obj: { A?: any }) =>
  Object.keys(obj).sort().reduce((reduced, key) => {
    reduced[key] = obj[key];
    return reduced;
  }, {});
