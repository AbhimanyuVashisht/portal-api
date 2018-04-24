'use strict';

let getStatus = function (code) {
  let status;

  switch (code) {
      case 'success':
          status = {
              code: code,
              error: false,
              message: 'Successful'
          };
          break;

      case 'input_missing':
          status = {
              code: code,
              error: true,
              message: 'Missing mandatory input fields'
          };
          break;

      case 'headers_missing':
          status = {
              code: code,
              error: true,
              message: 'Missing headers'
          };
          break;

      case 'authn_fail':
          status = {
              code: code,
              error: true,
              message: 'Authentication failed'
          };
          break;

      case 'unsupported_feature':
          status = {
              code: code,
              error: true,
              message: 'Unsupported feature'
          };
          break;

      case 'role_missing':
          status = {
              code: code,
              error: true,
              message: 'User role not found'
          };
          break;

      case 'user_missing':
          status = {
              code: code,
              error: true,
              message: 'User not found'
          };
          break;

      case 'no_results':
          status = {
              code: code,
              error: true,
              message: 'No results found'
          };
          break;

      case 'origin_fail':
          status = {
              code: code,
              error: true,
              message: 'Invalid or deprecated app version.'
          };
          break;

      default:
          status = {
              code: 'generic_fail',
              error: true,
              message: 'Generic failure: Something went wrong'
          };
          break;
  }

  return status;
};

module.exports = {
    getStatus: getStatus
};