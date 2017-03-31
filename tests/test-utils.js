// *Getting the dependencies:
const request = require('request-promise-native');



/**
 * Issues a custom HTTP request
 * @param  {string} method    The HTTP method
 * @param  {string} uri       The resource url
 * @param  {object} [body]    The request body object (will be automatically stringified)
 * @param  {object} [headers] The set of headers to be sent
 * @return {Promise}          A promise that resolves into a response object, or rejects if some error happens
 */
function req(method, uri, body, headers){
   // *Building and returning the request:
   return request({
      method,
      uri,
      resolveWithFullResponse: true,
      simple: false,
      headers,
      json: body?true:false,
      body
   });
}



/**
 * Issues a request that erases all the API info
 * @return {Promise} A promise that resolves if everything went fine, or rejects if some error happens
 */
function resetAPI(){
   // *Issuing the request:
   return req('DELETE', process.env.TEST_HOST + 'api/v1')
      .then(res => {
         // *Checking if the API could be erased:
         if(res.statusCode != 200)
            // *If it couldn't be:
            // *Failing this promise:
            throw new Error('The API could not be reset');
      });
}



/**
 * Issues a request that sets the service credentials for the first time only
 * @param {string} user The username to be set
 * @param {string} pass The password to be set
 * @return {Promise}    A promise that resolves if everything went fine, or rejects if some error happens
 */
function setCredentials(user, pass){
   // *Issuing the request:
   return req('POST', process.env.TEST_HOST + 'api/v1/credentials', { user, pass })
      .then(res => {
         // *Checking if the credentials could be set:
         if(res.statusCode != 200)
            // *If it couldn't be:
            // *Failing this promise:
            throw new Error('The credentials could not be set');
      });
}



/**
 * Issues a request to erase the service's credentials
 * @param  {string} user The current username
 * @param  {string} pass The current password
 * @return {Promise}     A promise that resolves if everything went fine, or rejects if some error happens
 */
function resetCredentials(user, pass){
   return req('DELETE', process.env.TEST_HOST + 'api/v1/credentials', undefined, credentialsHeaders(user, pass))
      .then(res => {
         // *Checking if the credentials could be erased:
         if(res.statusCode != 200)
            // *If it couldn't be:
            // *Failing this promise:
            throw new Error('The credentials could not be erased');
      });
}



/**
 * Builds the credentials headers, given the user and pass
 * @param  {string} user The username
 * @param  {string} pass The password
 * @return {object}      The credentials headers object
 */
function credentialsHeaders(user, pass){
   return {
      'Auth-User': user,
      'Auth-Pass': pass
   };
}



// *Exporting this module:
module.exports = {
   req,
   resetAPI,
   setCredentials,
   resetCredentials,
   credentialsHeaders
};
