// *Requiring the needed modules:
const env = require('./env.js');
const db = require('./db/db.js');
const server = require('./server.js');

// *Setting the finish flag:
let finish_signaled = false;



/**
 * Starts the server
 * @return {Promise} A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start(){
   // *Trying to start the server:
   try{
      // *Getting the api router:
      const router = require('./router/router.js');

      // *Preparing the environment variables:
      return env.load()
         // *Connecting to the database:
         .then(() => db.connectAndSync({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || '27017',
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            database: process.env.DB_SCHEMA || 'vault'
         }))
         // TODO setup the disk folders
         // *Setting up the routes:
         .then(mongoose => router(mongoose))
         // *Setting up the server:
         .then(routes => server.start({
            routes,
            port: process.env.PORT || 80
         }));
   } catch(err){
      // *Rejecting the promise if something went wrong:
      return Promise.reject(err);
   }
}



/**
 * Finishes all the services
 * @return {Promise} A promise that resolves when the services have been finished, or rejects if something went wrong
 */
function finish(){
   // *Checking if the finish signal has been set already, returning if it has:
   if(finish_signaled) return Promise.resolve();

   // *Setting the finish signal:
   finish_signaled = true;

   // *Disconnecting from the database:
   return db.disconnect()
      // *Stopping the server:
      .then(() => server.stop());
}



// *Exporting this module:
module.exports = { start, finish };
