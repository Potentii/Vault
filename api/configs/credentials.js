// *Initializing the credentials:
let user = undefined;
let pass = undefined;
let last_credentials = undefined;



/**
 * Sets the credentials
 * @param  {string} new_user The new username
 * @param  {string} new_pass The new password
 */
function set(new_user = undefined, new_pass = undefined){
   // *Saving the last credentials:
   last_credentials = { user, pass };

   // *Setting the credentials:
   user = new_user;
   pass = new_pass;
}



/**
 * Restores the credentials to their last value:
 */
function restore(){
   // *Checking if the credentials have a previous value:
   if(last_credentials)
      // *If they have:
      // *Restoring the last credentials:
      set(last_credentials.user, last_credentials.pass);
}



/**
 * Resets the credentials to their initial value
 */
function reset(){
   // *Saving the last credentials:
   last_credentials = { user, pass };

   // *Resetting the credentials:
   pass = undefined;
   user = undefined;
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
module.exports = { set, restore, reset, isSet, testAgainst };
