// *Requiring the needed modules:
const Configurator = require('w-srvr');
const env = require('./env.js');
const db = require('./db/db.js');

// *Creating a new server configurator:
const server = new Configurator();

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
         // *Starting the database:
         .then(() => db.start({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || '27017',
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            database: process.env.DB_SCHEMA || 'vault',
            db_path: process.env.DB_PATH
         }))
         // TODO setup the disk folders
         // *Setting up the routes:
         .then(mongoose => router(mongoose))
         // *Setting up the server:
         .then(routes => {
            // *Appending the server promise in the chain:
            return server

               // *Setting the server port:
               .port(process.env.PORT || 80)

               // *Configuring the API:
               .api

                  // *Defining routes for media resources:
                  // *TODO implement the Apps auth
                  .most('/api/v1/media/*',                     (req, res, next) => next())
                  .get('/api/v1/media/:app/images/:file',      routes.images.getFile)
                  .post('/api/v1/media/:app/images',           routes.images.saveFile).advanced.parseJSON({limit: '1mb'}).done()
                  .delete('/api/v1/media/:app/images/:file',   routes.images.removeFile)



                  // *Defining routes for remote service configuration:
                  // *Sets the credentials:
                  .post('/api/v1/credentials', routes.credentials.set)
                     .advanced.parseJSON().done()

                  // *Updates the credentials:
                  .put('/api/v1/credentials', routes.credentials.check)
                     .advanced.allowedHeaders('Auth-User', 'Auth-Pass').done()
                  .put('/api/v1/credentials', routes.credentials.update)
                     .advanced.parseJSON().done()

                  // *Erases the credentials:
                  .delete('/api/v1/credentials', routes.credentials.check)
                     .advanced.allowedHeaders('Auth-User', 'Auth-Pass').done()
                  .delete('/api/v1/credentials', routes.credentials.erase)



                  // *Prepending the admin auth middleware before the /apps routes:
                  .most(['/api/v1/apps', '/api/v1/apps/*'], routes.credentials.check)
                     .advanced.allowedHeaders('Auth-User', 'Auth-Pass').done()



                  // *Defining routes for user management:
                  // *Registers a new app:
                  .post('/api/v1/apps', routes.apps.add).advanced.parseJSON().done()

                  // *Removes an existing app:
                  .delete('/api/v1/apps/:app', routes.apps.remove)



                  // *Defining routes for access management:
                  // *Retrieves all accesses of an app:
                  .get('/api/v1/apps/:app/accesses', routes.accesses.getAllFromApp)

                  // *Adds a new access for an app:
                  .post('/api/v1/apps/:app/accesses', routes.accesses.addOnApp)

                  // *Removes an access from an app:
                  .delete('/api/v1/apps/:app/accesses/:key', routes.accesses.removeFromApp)

                  // *Removes all the accesses of an app:
                  .delete('/api/v1/apps/:app/accesses', routes.accesses.removeAllFromApp)



                  // *Defining development routes:
                  // *Resets all the database and credentials info (not available in production):
                  .delete('/api/v1', routes.dev.check)
                  .delete('/api/v1', routes.dev.reset)



                  .done()

               // *Starting the server:
               .start()
         });
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

   // *Stopping the database:
   return db.stop()
      // *Stopping the server:
      .then(() => server.stop());
}



// *Exporting this module:
module.exports = { start, finish };
