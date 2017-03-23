// *Initializing the credentials:
let user = undefined;
let pass = undefined;



/**
 * Sets the credentials
 * @param  {string} new_user The new username
 * @param  {string} new_pass The new password
 * @throws {TypeError}       If the credentials are not strings
 */
function set(new_user, new_pass){
   // *Throwing an error, if the credentials are not strings:
   if(typeof new_user !== 'string' || typeof new_pass !== 'string')
      throw new TypeError('The new credentials must be strings');

   // *Setting the credentials:
   pass = new_pass;
   user = new_user;
}



/**
 * Checks whether the credentials are set
 * @return {boolean} true if the credentials are already set, false otherwise
 */
function isSet(){
   return user !== undefined && pass !== undefined;
}



/**
 * Checks if the given credentials matches the actual ones
 * @param  {string} test_user The username to be tested
 * @param  {string} test_pass The password to be tested
 * @return {boolean}          Whether the credentials matches or not
 */
function testAgainst(test_user, test_pass){
   return user === test_user && pass === test_pass;
}



// *Exporting this module:
module.exports = { set, isSet, testAgainst };
