'use strict';
/**
 * Generates the object to return instead of a profile.
 * @param {object} err The error.
 * @return {object} Contains status code and an error message.
**/
let handleErr = (err) => {
  //TODO: Add the error Message and Status code
  let errObject = {
    'message': err.message
  };
  console.log(err);
  console.log(err.stack);
  return errObject;
}

module.exports = handleErr;
