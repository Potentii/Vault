// *Requiring the needed modules:
const mongoose = require('mongoose');
const Mongod = require('mongod');

/**
 * The mongo database controller instance
 * @type {Mongod}
 */
let mongo_database = null;

// *Setting up the internal mongoose promise engine:
mongoose.Promise = Promise;



/**
 * Starts the database
 *  i.e. spawns mongod if it's necessary, and connects
 * @param  {object} settings             The settings to configure the database
 * @param  {string} settings.host        The database hostname
 * @param  {string} settings.database    The database schema
 * @param  {string|number} settings.port The database port (The mongodb default is 27017)
 * @param  {string} settings.user        The database username
 * @param  {string} settings.pass        The database password
 * @param  {string} settings.db_path     The mongodb directory (will set the '--dbpath' flag of 'mongod') (not needed if the database is remote)
 * @return {Promise}                     It resolves into the mongoose instance, or it rejects if some error happens
 */
function start(settings){
   // *Checking if it is necessary to spawn the database process:
   if(!mongo_database && (settings.host==='127.0.0.1' || settings.host==='localhost')){
      // *If it is:
      // *Spawning the process:
      return spawnDatabase(settings)
         // *Trying to connect and sync the model:
         .then(() => connectAndSync(settings))
   } else{
      // *If it's not:
      // *Trying to connect and sync the model:
      return connectAndSync(settings);
   }
}



/**
 * Stops the database
 *  i.e. disconnects and kills the database server process
 * @return {Promise} Resolves if it goes ok, or rejects if an error has happened
 */
function stop(){
   // *Checking if the database controller is set:
   if(!mongo_database){
      // *If it's not:
      // *Disconnecting from the database:
      return disconnect();
   } else{
      // *If it is:
      // *Disconnecting from the database:
      return disconnect()
         // *Killing the database server process, even if some error has occured while disconnecting:
         .then(() => killDatabase(), err => {
            return killDatabase()
               .then(() => Promise.reject(err));
         })
   }
}



/**
 * Spawns a new MongoDB server process
 * @param  {object} settings             The settings to configure the database
 * @param  {string|number} settings.port The database port (The mongodb default is 27017)
 * @param  {string} settings.db_path     The mongodb directory (will set the '--dbpath' flag of 'mongod') (not needed if the database is remote)
 * @return {Promise}                     Resolves if it goes ok, or rejects if an error has happened
 */
function spawnDatabase({ port, db_path }){
   // *Setting the database server controller:
   mongo_database = new Mongod({
      port,
      dbpath: db_path
   });

   // *Spawning the database process:
   return mongo_database.open();
}



/**
 * Kills the MongoDB server process
 * @return {Promise} Resolves if it goes ok, or rejects if an error has happened
 */
function killDatabase(){
   return mongo_database.close();
}



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
         server: {poolSize: 4}
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
         // *Getting the schema definition:
         const Schema = mongoose.Schema;

         // TODO implement the model

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
   start,
   stop,
   connectAndSync,
   connect,
   sync,
   disconnect
};
