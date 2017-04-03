// *Requiring the needed modules:
const Configurator = require('w-srvr');

// *Creating a new server configurator:
const server = new Configurator();



/**
 * Configures and starts the API server
 * @param  {object} routes      All the routes available
 * @param  {string|number} port The server port
 * @return {Promise}            A promise that resolves into a { server, address } object, or rejects if something went wrong
 */
function start({ routes, port }){
   // *Returning the starting promise:
   return server

      // *Setting the server port:
      .port(port)

      // *Configuring the API:
      .api

         // *Defining routes for media resources:
         // *Checks the access:
         .most(['/api/v1/apps/:app/media', '/api/v1/apps/:app/media/*'], routes.accesses.check)

         // *Downloads the given media file:
         .get('/api/v1/apps/:app/media/:media', routes.media.download)

         // *Retrieves all the media names of the given app:
         .get('/api/v1/apps/:app/media', routes.media.getAllFromApp)

         // *Uploads a file:
         .post('/api/v1/apps/:app/media', routes.media.upload)
            .advanced.parseJSON({limit: '5mb'}).done()

         // *Removes the given media:
         .delete('/api/v1/apps/:app/media/:media', routes.media.removeFromApp)

         // *Removes all the media files of the given app:
         .delete('/api/v1/apps/:app/media', routes.media.removeAllFromApp)



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
      .start();
}



/**
 * Stops all the server connections
 * @return {Promise} A promise that resolves if everything went fine, or rejects if something went wrong
 */
function stop(){
   // *Stopping the server:
   return server.stop();
}



// *Exporting this module:
module.exports = { start, stop };
