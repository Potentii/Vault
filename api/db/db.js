// *Requiring the needed modules:
const mongoose = require('mongoose');

// *Setting up the internal mongoose promise engine:
mongoose.Promise = Promise;



/**
 * Connects to the database, and sets up the data model
 * @param  {object} settings             The settings to configure the database
 * @param  {string} settings.host        The database hostname
 * @param  {string} settings.database    The database schema
 * @param  {string|number} settings.port The database port (The mongodb default is 27017)
 * @param  {string} settings.user        The database username
 * @param  {string} settings.pass        The database password
 * @return {Promise}                     It resolves into the mongoose instance, or it rejects if some error happens
 */
function connectAndSync(settings){
   // *Returning the connection and model sync promise chain:
   return connect(settings)
      .then(() => sync());
}



/**
 * Connects to the database
 * @param  {object} settings             The settings to configure the database
 * @param  {string} settings.host        The database hostname
 * @param  {string} settings.database    The database schema
 * @param  {string|number} settings.port The database port (The mongodb default is 27017)
 * @param  {string} settings.user        The database username
 * @param  {string} settings.pass        The database password
 * @return {Promise}                     It resolves into the mongoose instance, or it rejects if some error happens
 */
function connect({ host, database, port, user, pass }){
   // *Connecting and returning the promise chain:
   return mongoose.connect(host, database, port, {
         user,
         pass,
         server: {poolSize: 4},
         promiseLibrary: Promise
      })
      // *Appending the mongoose in the chain:
      .then(() => mongoose);
}



/**
 * Sets up the data model
 * @return {Promise} It resolves into the mongoose instance, or it rejects if some error happens
 */
function sync(){
   // *Returning the promise chain:
   return new Promise((resolve, reject) => {
      // *Trying to setup the model:
      try{
         // *Getting the schemas:
         const schemas = require('./model.js')(mongoose);

         // *Applying the schemas:
         mongoose.model('App', schemas.Apps);
         mongoose.model('Access', schemas.Accesses);

         // Resolving the promise with mongoose:
         resolve(mongoose);
      } catch(err){
         // *Rejecting the promise if something went wrong:
         reject(err);
      }
   });
}



/**
 * Disconnects from the database
 * @return {Promise} Resolves if it goes ok, or rejects if an error has happened
 */
function disconnect(){
   // *Disconnecting:
   return mongoose.disconnect();
}



// *Exporting this module:
module.exports = {
   connectAndSync,
   connect,
   sync,
   disconnect
};
